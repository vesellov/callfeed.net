# coding=utf-8
"""
Здесь описываются задачи, которые нужно выполнять в отложенном порядке.
Например, ежедневная рассылка отчётов о качестве работы операторов по почте и так далее.
"""

import traceback

__author__ = 'max'
from huey.djhuey import periodic_task, crontab, task
from mainapp.jsonpserver import JSONPEntryPoint

from mainapp.models import PendingCallback, CallbackInfo, Client, CALLBACK_STATUS_FAIL_OUT_OF_BALANCE
from mainapp.utils import mtt
from mainapp.utils.mail import send_email_out_of_balance_initiate_callback

#------------------------------------------------------------------------------ 

def refresh_pending_callbacks(pending_callbacks=None):
    """
    Обновляем информацию о только начавшихся звонках, статусы которых нам пока неизвестны.
    Запрашиваем статусы этих самых звонков и т. д.
    """
    
    if pending_callbacks is None:
        pending_callbacks = PendingCallback.objects.all()
        
    print 'refresh_pending_callbacks', pending_callbacks
        
    mtt_proxy = mtt.MTTProxy(mtt.CUSTOMER_NAME, mtt.LOGIN, mtt.PASSWORD, mtt.api_url)
    for callback in pending_callbacks:
        try:
            mtt_response = mtt_proxy.getCallBackFollowmeCallInfo(mtt.CUSTOMER_NAME, callback.mtt_callback_call_id)
        except:
            print '        CallbackInfo %s : NOT FOUND in MTT' % callback.mtt_callback_call_id
            callback.delete()
            continue
            
        mtt_response_result = mtt_response.get('result', None)
        if mtt_response_result is None:
            print '        WARNING!!!', mtt_response
            callback.delete()
            continue

        mtt_response_result_struct = mtt_response_result.get('callBackFollowmeCallInfoStruct', None)
        if mtt_response_result_struct is None:
            print '        WARNING!!!', mtt_response_result
            callback.delete()
            continue

        record_url_a = mtt_response_result_struct.get('call_back_record_URL_A', '')
        record_url_a = mtt_response_result_struct.get('downloadURL', '')
        record_url_b = mtt_response_result_struct.get('call_back_record_URL_B', '')
        record_url_b = mtt_response_result_struct.get('downloadURL', '')

        new_callback_info = CallbackInfo(
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
            callback_status = callback.callback_status,
            cost = mtt_response_result_struct.get('call_back_cost', 0.0),
            currency = mtt_response_result_struct.get('call_back_currency', 'RUB'),
            ip_side_b = callback.ip_side_b, geodata_side_b='-',
            mtt_callback_call_id = callback.mtt_callback_call_id,
            referer = callback.referer, search_request=callback.search_request,
            when = callback.when,
            tracking_history = callback.tracking_history)
        
        new_callback_info.save()
        
        print '        new CallbackInfo created:', new_callback_info

        try:
            charged_a = int(mtt_response_result_struct.get('call_back_charged_length_A', '0'))
            charged_b = int(mtt_response_result_struct.get('call_back_charged_length_B', '0'))
            callback.widget.client.balance_minutes -= int((float(charged_a) + float(charged_b)) / 60.0)
            callback.widget.client.save()
            print '        OK!', callback.widget.client.name, callback.widget.client.email, callback.widget.client.balance_minutes
        except Exception as e:
            traceback.print_exc()

        callback.delete()



@task()
def initiate_deferred_callback(deferred_callback_info):
    """
    Инициация отложенного звонка
    """
    if deferred_callback_info.widget.client.balance_minutes < Client.MINIMUM_ALLOWED_BALANCE_MINUTES:
        # out of balance
        # deferred_callback_info.callback_status = CALLBACK_STATUS_FAIL_OUT_OF_BALANCE
        # deferred_callback_info.save()
        send_email_out_of_balance_initiate_callback(deferred_callback_info.widget.out_of_balance_notifications_email,
                                                    deferred_callback_info.phone_number_side_b,
                                                    deferred_callback_info.planned_for_datetime,
                                                    deferred_callback_info.widget.site_url)
        deferred_callback_info.delete()
        return

    JSONPEntryPoint.initiate_callback(
        deferred_callback_info.phone_number_side_b, 
        deferred_callback_info.widget,
        deferred_callback_info.search_request, 
        deferred_callback_info.referer,
        deferred_callback_info.ip_side_b,
        pending_callback_id=deferred_callback_info.id)



@periodic_task(crontab(minute='*/1'))
def refresh_pending_callbacks_task():
    return refresh_pending_callbacks()

