# coding=utf-8
"""
Здесь описываются задачи, которые нужно выполнять в отложенном порядке.
Например, ежедневная рассылка отчётов о качестве работы операторов по почте и так далее.
"""

import sys
import traceback
import time
import datetime

__author__ = 'max'
from huey.djhuey import periodic_task, crontab, task
# from periodically.decorators import *
from mainapp.jsonpserver import JSONPEntryPoint

from mainapp.models import PendingCallback
from mainapp.models import CallbackInfo
from mainapp.models import Client
from mainapp.models import CALLBACK_STATUSES
from mainapp.models import CALLBACK_STATUS_STARTED
from mainapp.models import CALLBACK_STATUS_PLANNED
from mainapp.models import CALLBACK_STATUS_SUCCEED
from mainapp.models import CALLBACK_STATUS_FAIL_A
from mainapp.models import CALLBACK_STATUS_FAIL_B
from mainapp.models import CALLBACK_STATUS_FAIL_OUT_OF_BALANCE
from mainapp.models import CALLBACK_STATUS_LASTING
from mainapp.models import TRACKING_EVENT_START_SIDE_A
from mainapp.models import TRACKING_EVENT_START_SIDE_B
from mainapp.models import TRACKING_EVENT_END_SIDE_A
from mainapp.models import TRACKING_EVENT_END_SIDE_B
from mainapp.models import tracking_history_to_callback_status

from mainapp.utils import mtt
from mainapp.utils import sms
from mainapp.utils import mail
from mainapp.utils.jsonrpc2 import rpcException
from mainapp.utils.mail import send_email_out_of_balance_initiate_callback

#------------------------------------------------------------------------------ 

# @hourly()
# def do_something():
#     print 'Doing something!'
            
#------------------------------------------------------------------------------ 

# @every(seconds=5)
# def refresh_pending_callbacks_task():
#     return refresh_pending_callbacks()
    
#------------------------------------------------------------------------------ 

def process_pending_callback(callback,
                             mtt_response_result_struct=None,
                             call_description=None,
                             callback_status=None,
                             condition=None):

    print 'process_pending_callback', callback.id, mtt_response_result_struct is not None, callback_status, call_description, condition 

    if mtt_response_result_struct:
        record_url_a = mtt_response_result_struct.get('call_back_record_URL_A', '')
        record_url_a = mtt_response_result_struct.get('downloadURL', '')
        record_url_b = mtt_response_result_struct.get('call_back_record_URL_B', '')
        record_url_b = mtt_response_result_struct.get('downloadURL', '')
        
        callback_info = CallbackInfo(
            widget = callback.widget,
            call_description = mtt_response_result_struct.get('callDescription', ''),
            phone_number_side_a = mtt_response_result_struct.get('destination_A', ''),
            phone_number_side_b = mtt_response_result_struct.get('destination_B', ''),
            charged_length_a_sec = int(mtt_response_result_struct.get('call_back_charged_length_A', '0')),
            charged_length_b_sec = int(mtt_response_result_struct.get('call_back_charged_length_B', '0')),
            real_length_a_sec = int(mtt_response_result_struct.get('call_back_real_length_A', '0')),
            real_length_b_sec = int(mtt_response_result_struct.get('call_back_real_length_B', '0')),
            record_url_a = record_url_a, record_url_b=record_url_b,
            waiting_period_a_sec = mtt_response_result_struct.get('waiting_period_A', '0'),
            waiting_period_b_sec = mtt_response_result_struct.get('waiting_period_B', '0'),
            callback_status = tracking_history_to_callback_status(callback.tracking_history, condition),
            cost = mtt_response_result_struct.get('call_back_cost', 0.0),
            currency = mtt_response_result_struct.get('call_back_currency', 'RUB'),
            ip_side_b = callback.ip_side_b,
            geodata_side_b = callback.geodata_side_b,
            mtt_callback_call_id = callback.mtt_callback_call_id,
            referer = callback.referer, 
            search_request=callback.search_request,
            when = callback.when,
            tracking_history = callback.tracking_history)
        
        callback_info.save()
        
        print '        new CallbackInfo created from MTT response:', callback_info
    
        try:
            charged_a = int(mtt_response_result_struct.get('call_back_charged_length_A', '0'))
            charged_b = int(mtt_response_result_struct.get('call_back_charged_length_B', '0'))
            delta = int((float(charged_a) + float(charged_b)) / 60.0)
            callback.widget.client.balance_minutes -= delta
            callback.widget.client.save()
            print '        BALANCE:', callback.widget.client.name, callback.widget.client.email, callback.widget.client.balance_minutes, delta
            
        except Exception as e:
            traceback.print_exc()
            
        if callback.widget.client.balance_minutes < 1:
            if callback.widget.is_email_notification_on:
                try:
                    # notify manager via email
                    mail.send_email_zero_balance(
                        str(callback.widget.out_of_balance_notifications_email),)  
                except:
                    traceback.print_exc()
            
            if callback.widget.is_sms_notification_on:
                try:
                    sms.send(callback.widget.sms_notification_number,
                        u'CallFeed.NET: на вашем балансе недостаточно средств для совершения звонков')
                except:
                    traceback.print_exc()
        
        print '        %s processed and removed' % callback 
        callback.delete()
        return

    if not callback.mtt_callback_call_id:
        print '        WARNING!!! unknown mtt_callback_call_id, nothing to process, %s not removed' % callback
        return
    
    new_callback_status = callback.callback_status

    if callback_status is None:
        new_callback_status = tracking_history_to_callback_status(callback.tracking_history, condition)
    else:
        new_callback_status = callback_status
        
    callback_info = None

    try:
        callback_info = CallbackInfo.objects.get(mtt_callback_call_id=callback.mtt_callback_call_id)
        print '        found existing CallbackInfo in the DB:', callback_info
        
    except:

        if call_description is None:
            call_description = 'ОШИБКА! Неизвестный статус звонка'  

        callback_info = CallbackInfo(
            widget = callback.widget,
            call_description = call_description,                          
            phone_number_side_b = callback.phone_number_side_b,
            mtt_callback_call_id = callback.mtt_callback_call_id,
            when = callback.when,
            callback_status = new_callback_status,
            referer = callback.referer, 
            search_request = callback.search_request,
            tracking_history = callback.tracking_history,
            ip_side_b = callback.ip_side_b,
            geodata_side_b = callback.geodata_side_b,
            planned_for_datetime = callback.planned_for_datetime)
        callback_info.save()
        print '        new CallbackInfo created from PendingCallback:', callback_info

    callback.delete()
    
    print '        %s processed and removed' % callback 
      
      
#------------------------------------------------------------------------------ 

def refresh_pending_callbacks(pending_callbacks=None):
    """
    Обновляем информацию о только начавшихся звонках, статусы которых нам пока неизвестны.
    Запрашиваем статусы этих самых звонков и т. д.
    """
    
    if pending_callbacks is None:
        pending_callbacks = PendingCallback.objects.all()
        
    print 'refresh_pending_callbacks', pending_callbacks
        
    try:
        mtt_proxy = mtt.MTTProxy(mtt.CUSTOMER_NAME, mtt.LOGIN, mtt.PASSWORD, mtt.api_url)
        for callback in pending_callbacks:
            if callback.planned_for_datetime or callback.callback_status == CALLBACK_STATUS_PLANNED:
                print '        skip, PendingCallback %d (%s) is planned for %s' % (callback.id, callback.mtt_callback_call_id, callback.planned_for_datetime)
                continue
            
            delta = datetime.datetime.now() - callback.when
            
            if not callback.mtt_callback_call_id:
                print '        PendingCallback %d has no MTT ID yet (%s), lifetime is %d seconds' % (callback.id, callback.mtt_callback_call_id, delta.total_seconds()) 
                if delta.total_seconds() > callback.widget.time_before_callback_sec * 2:
                    process_pending_callback(callback,
                        # callback_status=CALLBACK_STATUS_FAIL_A,
                        condition='custom timeout', 
                        call_description="Истек интервал обработки звонока")
                continue 
                    
            try:
                mtt_response = mtt_proxy.getCallBackFollowmeCallInfo(mtt.CUSTOMER_NAME, callback.mtt_callback_call_id)
            except rpcException as e:
                if e.fullMessage == 'Call ended by timeout on side B':
                    print '        PendingCallback %d (%s), operator is not available' % (callback.id, callback.mtt_callback_call_id)
                    process_pending_callback(callback,
                        condition='dropped',
                        callback_status=CALLBACK_STATUS_FAIL_A,
                        call_description="Телефон оператора выключен или вне зоны действия сети")
                    continue
                
                if delta.total_seconds() > callback.widget.time_before_callback_sec * 2:
                    if callback.tracking_history.count(TRACKING_EVENT_START_SIDE_A) and \
                       callback.tracking_history.count(TRACKING_EVENT_START_SIDE_B) == 0:
                        print '        PendingCallback %d (%s), timed out by operator' % (callback.id, callback.mtt_callback_call_id)
                        process_pending_callback(callback,
                            condition='dropped',
                            # callback_status=CALLBACK_STATUS_FAIL_A,
                            call_description="Оператор не поднял трубку")
                        continue

                if delta.total_seconds() > callback.widget.time_before_callback_sec * 2:
                    if callback.tracking_history.count(TRACKING_EVENT_END_SIDE_A):
                        print '        PendingCallback %d (%s), refused' % (callback.id, callback.mtt_callback_call_id)
                        process_pending_callback(callback,
                            condition='dropped',
                            # callback_status=CALLBACK_STATUS_FAIL_A,
                            call_description="Оператор не поднял трубку или сбросил вызов")
                        continue
                        
                if delta.total_seconds() > 5*60:
                    print '        skip, PendingCallback %d (%s), empty MTT responses in 5 min' % (callback.id, callback.mtt_callback_call_id)
                    process_pending_callback(callback,
                        # callback_status=CALLBACK_STATUS_FAIL_A,
                        condition='service timeout',
                        call_description="Звонок не был обработан в течении 5 минут")
                    continue
                
                refresh_pending_callback_again.schedule(args=(callback.id,), delay=(1*5))
                print '        skip, PendingCallback %d (%s), empty MTT response, next refrest in 5 seconds' % (callback.id, callback.mtt_callback_call_id)
                continue
                
            mtt_response_result = mtt_response.get('result', None)
            if mtt_response_result is None:
                refresh_pending_callback_again.schedule(args=(callback.id,), delay=(1*5))
                print '        WARNING!!! empty MTT response, skip, retry in 5 sec'
                continue
    
            mtt_struct = mtt_response_result.get('callBackFollowmeCallInfoStruct', None)
            if mtt_struct is None:
                refresh_pending_callback_again.schedule(args=(callback.id,), delay=(1*5))
                print '        WARNING!!! wrong MTT response, callBackFollowmeCallInfoStruct not found, skip, retry in 5 seconds'
                continue
    
            process_pending_callback(callback,
                mtt_response_result_struct=mtt_struct,
                condition='processed')
    except:
        traceback.print_exc()
        
    return True


#------------------------------------------------------------------------------ 

@task()
def refresh_pending_callback_again(callback_id):
    print 'refresh_pending_callback_again', callback_id
    
    try:
        callback = PendingCallback.objects.get(id=callback_id)
    except:
        print '        PendingCallback %d not found' % callback_id
        sys.stdout.flush()
        return True
        
    try:
        refresh_pending_callbacks([callback,])
    except:
        traceback.print_exc()

    sys.stdout.flush()
    return True

#------------------------------------------------------------------------------ 

@task()
def initiate_deferred_callback(deferred_callback_info):
    """
    Инициация отложенного звонка
    """
    if deferred_callback_info.widget.client.balance_minutes < Client.MINIMUM_ALLOWED_BALANCE_MINUTES:
        # out of balance
        # deferred_callback_info.callback_status = CALLBACK_STATUS_FAIL_OUT_OF_BALANCE
        # deferred_callback_info.save()
        send_email_out_of_balance_initiate_callback(
            deferred_callback_info.widget.out_of_balance_notifications_email,
            deferred_callback_info.phone_number_side_b,
            deferred_callback_info.planned_for_datetime,
            deferred_callback_info.widget.site_url)
        # deferred_callback_info.delete()
        process_pending_callback(deferred_callback_info, 
            call_description = "Недостаточно средств для запуска отложенного звонка", 
            callback_status = CALLBACK_STATUS_FAIL_OUT_OF_BALANCE, 
            condition='out of balance')
        return True

    JSONPEntryPoint.initiate_callback(
        deferred_callback_info.phone_number_side_b, 
        deferred_callback_info.widget,
        deferred_callback_info.search_request, 
        deferred_callback_info.referer,
        deferred_callback_info.ip_side_b,
        pending_callback_id=deferred_callback_info.id)

    return True

#------------------------------------------------------------------------------ 

#@periodic_task(crontab(minute='*/1'))
#def refresh_pending_callbacks_task():
#    # print 'refresh_pending_callbacks_task'
#    try:
#        return refresh_pending_callbacks()
#    except:
#        traceback.print_exc()
#    return True

