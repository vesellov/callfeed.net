# coding=utf-8

import traceback
import json
import pprint
import datetime
import urllib

from django.views.generic import View
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist

#------------------------------------------------------------------------------ 

from mainapp import widget_settings

from mainapp.models import Widget
from mainapp.models import PendingCallback
from mainapp.models import CallbackInfo 
from mainapp.models import CALLBACK_STATUS_PLANNED
from mainapp.models import CALLBACK_STATUS_STARTED

from mainapp.utils import mtt
from mainapp.utils import sms
from mainapp.utils import mail
from mainapp.utils.common import random_delay

# ------------------------------------------------------------------------------

def ip_to_location(ip):
    """
    Получение геоданных об ip-адресе. Подставляется в статистику звонков.
    :param ip: ip-адрес клиента
    :return: геоданные по ip-адресу
    """
    if ip in (None, ''):
        return ''
    import geocoder
    ret = geocoder.ip(ip).address
    # print('ip_to_location: %s -> %s' % (ip, str(ret)))
    return ret

# ------------------------------------------------------------------------------

class JSONPEntryPoint(View):
    TIME_FORMAT = '%H:%M'

    def time_fits_in_schedule(self, schedule, order_time):
        """
        Checks whether the order_time fits in the given schedule
        :param schedule: an instance of Schedule model; schedule-day looks like this: "%H:%M-%H:%M"
        :param order_time: time of the following format "%H:%M"
        :return:
        """
        if schedule is None:
            return False

        if order_time in (None, ''):
            return False

        order_time = datetime.datetime.strptime(order_time, self.TIME_FORMAT)

        schedule_days = [schedule.monday, schedule.tuesday, schedule.wednesday, schedule.thursday, schedule.friday,
                         schedule.saturday, schedule.sunday]  # it is easier to pick a needed day that way

        this_moment_tzd = datetime.datetime.now() + datetime.timedelta(hours=schedule.timezone)
        this_day_number = this_moment_tzd.weekday()
        this_day_schedule = schedule_days[this_day_number]  # I told you..)

        if this_day_schedule in ('', '-', None):
            return False

        this_day_schedule_time_from, this_day_schedule_time_to = \
            (lambda x: (datetime.datetime.strptime(x[0], self.TIME_FORMAT),
                        datetime.datetime.strptime(x[1], self.TIME_FORMAT)))(this_day_schedule.split('-'))

        if this_day_schedule_time_to >= this_day_schedule_time_from:
            return this_day_schedule_time_from <= order_time <= this_day_schedule_time_to
        else:
            # not gonna check next day's schedule to be absolutely accurate, cause it is a client's will to
            # have this kind of schedule set up
            return this_day_schedule_time_from <= order_time <= (this_day_schedule_time_to + datetime.timedelta(days=1))

    def datetime_fits_in_schedule(self, schedule, datetime_to_check):
        if schedule is None:
            return False

        if datetime_to_check is None:
            return False

        datetime_to_check += datetime.timedelta(hours=schedule.timezone) # schedule.timezone  # consider user's timezone

        schedule_days = [schedule.monday, schedule.tuesday, schedule.wednesday, schedule.thursday, schedule.friday,
                         schedule.saturday, schedule.sunday]  # it is easier to pick a needed day that way
        that_day_number = datetime_to_check.weekday()
        that_day_schedule = schedule_days[that_day_number]

        if that_day_schedule in ('', '-', None):
            return False

        start_datetime = datetime.datetime(datetime_to_check.year, datetime_to_check.month, datetime_to_check.day)
        end_datetime = start_datetime + datetime.timedelta(days=1, microseconds=-1)

        that_day_schedule_datetime_from, that_day_schedule_datetime_to = \
            (lambda x: (datetime.datetime.strptime(x[0], self.TIME_FORMAT).replace(year=start_datetime.year,
                                                                                   month=start_datetime.month,
                                                                                   day=start_datetime.day),
                        datetime.datetime.strptime(x[1], self.TIME_FORMAT).replace(year=start_datetime.year,
                                                                                   month=start_datetime.month,
                                                                                   day=start_datetime.day)))(
                that_day_schedule.split('-'))

        if that_day_schedule_datetime_to < that_day_schedule_datetime_from:
            that_day_schedule_datetime_to += datetime.timedelta(days=1)
            end_datetime += datetime.timedelta(days=1)

        return that_day_schedule_datetime_from <= datetime_to_check <= that_day_schedule_datetime_to

    def is_number_in_blacklist(self, phone_number, blacklist_phones):
        """
        Used to check whether a phone number is in a given blacklist
        :param phone_number: the one that user has entered in the widget
        :param blacklist_phones: value, taken from widget.blacklist_phones
        :return: True if the number is blocked, False otherwise
        """
        if phone_number in (None, ''):
            return True

        if blacklist_phones in (None, ''):
            return False

        for black_phone in blacklist_phones:
            if phone_number.strip() == black_phone.strip():
                return True
            if phone_number.strip().startswith('8') and ('+7%s' % phone_number.strip()[1:]) == black_phone.strip():
                return True

        return False

    def is_ip_in_blacklist(self, ip, blacklist_ip):
        """
        Used to check whether an ip is in a given blacklist
        :param ip: user's IP address
        :param blacklist_ip: value, taken from widget.blacklist_ip
        :return: True if the ip is blocked, False otherwise
        """
        if ip in (None, ''):
            return True

        if blacklist_ip in (None, ''):
            return False

        return ip in blacklist_ip

    def order_deferred_callback(self, widget, ip_side_b, referrer,
                                search_request, callback_planned_for_datetime, phone_number):
        """
        :param widget: callback made from
        :param ip_side_b: client's ip
        :param referrer: site the client has came from
        :param search_request: -
        :param callback_planned_for_datetime: an accurate datetime the callback to be initiated at; should be in the server's timezone
        :return: True or False
        """
        print 'order_deferred_callback', ip_side_b, referrer, search_request, callback_planned_for_datetime, phone_number

        max_delta_sec = 30  # how many seconds is allowed between two deferred callbacks

        if not self.datetime_fits_in_schedule(widget.schedule, callback_planned_for_datetime):
            return False

        # deferred_callbacks_filter = widget.callbacks.filter(
        deferred_callbacks_filter = PendingCallback.filter(
            planned_for_datetime__range=(
                callback_planned_for_datetime - datetime.timedelta(seconds=max_delta_sec),
                callback_planned_for_datetime + datetime.timedelta(seconds=max_delta_sec)),
            callback_status=CALLBACK_STATUS_PLANNED,
        )

        if deferred_callbacks_filter.count() > 0:
            # can't have many deferred callbacks for the same time as we are limited in an
            #  ability to count spent minutes for such cases
            return False

        deferred_callback_info = PendingCallback(
            widget = widget,
            phone_number_side_b = phone_number,
            mtt_callback_call_id = '', 
            ip_side_b = ip_side_b,
            referer = referrer,
            geodata_side_b = ip_to_location(ip_side_b),
            search_request = search_request,
            when = datetime.datetime.now(),
            tracking_history = '',
            callback_status = CALLBACK_STATUS_PLANNED,
            planned_for_datetime = callback_planned_for_datetime,)

    
#        deferred_callback_info = CallbackInfo(widget=widget, 
#                                              ip_side_b=ip_side_b,
#                                              geodata_side_b=ip_to_location(ip_side_b),
#                                              referer=referrer,
#                                              search_request=search_request,
#                                              planned_for_datetime=callback_planned_for_datetime,
#                                              when=datetime.datetime.now(),
#                                              phone_number_side_b=phone_number)

        deferred_callback_info.save()
        from tasks import initiate_deferred_callback
        initiate_deferred_callback.schedule(args=(deferred_callback_info,), eta=callback_planned_for_datetime)
        return True

    @staticmethod
    def initiate_callback(phone_number, widget, search_str, rferrer_str, ip_address, pending_callback_id=None):
        """
        Инициирует соединение.
        :param phone_number: телефон клиента
        :param widget: виджет, с которого происходит запрос звонка
        :param search_str: поисковый запрос
        :param rferrer_str: откуда клиент пришёл
        :param ip_address: ip-адрес клиента
        :return:
        """
        
        print 'initiate_callback', phone_number, widget, search_str, rferrer_str, ip_address
        
        try:
            manager = {}
            managers = []
            operators = widget.client.operator_set.all() if widget.related_operators.count() < 1 \
                else widget.related_operators.all()
            for i, operator in enumerate(operators, 1):
                if operator == widget.default_operator:
                    managers.insert(0, {
                        'phone': operator.phone_number,
                        'name': operator.name.encode('utf8').decode('utf8'),
                        'role': operator.position.encode('utf8').decode('utf8'),  # 'Manager', # operator.role,
                        'photo_url': operator.photo_url,
                    })
                    manager = {
                        'phone': operator.phone_number,
                        'name': operator.name.encode('utf8').decode('utf8'),
                        'role': operator.position.encode('utf8').decode('utf8'),  # 'Manager', # operator.role,
                        'photo_url': operator.photo_url,
                    }
                else:
                    managers.append({
                        'phone': operator.phone_number,
                        'name': operator.name.encode('utf8').decode('utf8'),
                        'role': operator.position.encode('utf8').decode('utf8'),  # 'Manager', # operator.role,
                        'photo_url': operator.photo_url,
                    })
            if len(manager) == 0:
                manager = managers[0]
            phoneA = manager['phone']
            phoneB = phone_number
            timeout = widget.time_before_callback_sec
            call_duration = timeout * (len(managers) + 1)
            client_caller_id = widget_settings.CALLFEED_PHONE_NUMBER \
                if widget.operator_incoming_number == Widget.INCOMING_NUMBER_CALLFEED else phoneB
            structs = []
            for i in range(len(managers)):
                m = managers[i]
                structs.append(mtt.MTTProxy.CallbackFollowMeStruct.make(
                    1,
                    int(timeout),
                    str(m['phone'].strip('+')),
                    str(widget.callback_type),
                    m['name']))
            if pending_callback_id:
                new_pending_info = PendingCallback.objects().get(id=pending_callback_id) 
                print '        loaded existing PendingCallback (id=%d) : %s' % (new_pending_info.id, new_pending_info)
            else:
                new_pending_info = PendingCallback(
                    widget = widget,
                    mtt_callback_call_id = '',
                    ip_side_b = ip_address,
                    geodata_side_b = ip_to_location(ip_address),
                    referer = rferrer_str,
                    search_request = search_str,
                    when = datetime.datetime.now(),
                    phone_number_side_b = phone_number,
                    callback_status = CALLBACK_STATUS_STARTED)
                new_pending_info.save()
                print '        new PendingCallback created (id=%d) : %s' % (new_pending_info.id, new_pending_info)
            
            mttproxy = mtt.MTTProxy(mtt.CUSTOMER_NAME, mtt.LOGIN, mtt.PASSWORD, mtt.api_url)
            mtt_response = mttproxy.makeCallBackCallFollowme(
                mtt.CUSTOMER_NAME,
                b_number=str(phoneB.strip('+')),
                caller_id=str(phoneA.strip('+')),
                callback_url='callfeed.net/tracking/%d' % (new_pending_info.id),
                record_enable=1,
                client_caller_id=str(client_caller_id.strip('+')),
                duration=int(call_duration),
                direction=0,
                caller_description=str('CallFeed.NET from %s to %s' % (phoneB.strip('+'), phoneA.strip('+'))),
                callback_follow_me_struct=structs)
            mtt_response_result = mtt_response.get('result', None)

            if mtt_response_result is None:
                print '        ERROR: makeCallBackCallFollowme returned None'
                return ('error', 'makeCallBackCallFollowme returned None',)
            
            mtt_response_result_callback_id = mtt_response_result.get('callBackCall_id', None)
            if mtt_response_result_callback_id is None:
                print '        ERROR: callBackCall_id is None'
                return ('error', 'callBackCall_id is None',)
                         
            print '        OK! %s' % new_pending_info.mtt_callback_call_id
            return (mtt_response_result, mtt_response.get('message', ''),)
        
        except:
            traceback.print_exc()
            return ('exception', traceback.format_exc(),)

    def get(self, request):
        try:
            if 'callback' not in request.GET:
                return HttpResponse(json.dumps({
                    'response': 'error',
                    'message': 'callback argument not specified'}, ensure_ascii=False),
                    'application/json')

            if 'token' not in request.GET:
                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps({
                        'response': 'error',
                        'message': 'token argument not specified'}, ensure_ascii=False)),
                                    'text/javascript')

            #--- read from DB by token ID
            token = request.GET.get('token', None)
            widget = None
            try:
                widget = Widget.objects.get(id=int(token))
            except:
                import traceback

                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps({
                        'response': 'error',
                        'message': 'no widget found, token=%s, error=%s' % (
                            token, traceback.format_exc())}, ensure_ascii=False)),
                                    'text/javascript')

            client_ip_addr = request.META.get('REMOTE_ADDR', '')

            jdata = {
                'callback': request.GET['callback'].replace('CallbackRegistry.', ''),
                'ip': client_ip_addr,
                'token': request.GET['token'],
                'referrer': urllib.unquote(request.GET.get('referrer', '')),
                'search_request': request.GET.get('search_request', ''),
                'hostname': request.GET.get('hostname', ''),
            }


            #--- check ip in black list
            if self.is_ip_in_blacklist(jdata['ip'], widget.blacklist_ip.split(',')):
                jdata.update({'response': 'refused',
                              'message': '%s were found in the black list' % jdata['ip'], })
                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps(jdata, ensure_ascii=False)),
                                    'text/javascript')

            try:
                operators = widget.client.operator_set.all() if widget.related_operators.count() < 1 \
                    else widget.related_operators.all()
            except:
                import traceback

                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps({
                        'response': 'error',
                        'message': 'no operators found, token=%s, error=%s' % (
                            token, traceback.format_exc())}, ensure_ascii=False)),
                                    'text/javascript')

            #--- is_active
            try:
                is_on = widget.is_active
                is_active = widget.client.balance_minutes > 1
            except:
                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps({
                        'response': 'error',
                        'message': 'unable to read the data from DB'}, ensure_ascii=False)),
                                    'text/javascript')

            #--- check paid status 
            # if MTT balance is too low or widget is not active - set to false
            jdata['mode'] = 'paid' if is_active else 'free'
            if not is_on:
                jdata['mode'] = 'off'

            #--- managers
            manager = {}
            managers_wo_phones = []
            for i, operator in enumerate(operators, 1):
                if operator == widget.default_operator:
                    managers_wo_phones.insert(0, {
                        'name': operator.name.encode('utf8').decode('utf8'),
                        'role': operator.position.encode('utf8').decode('utf8'),
                        'photo_url': operator.photo_url,
                    })
                    manager = {
                        'name': operator.name.encode('utf8').decode('utf8'),
                        'role': operator.position.encode('utf8').decode('utf8'),
                        'photo_url': operator.photo_url,
                    }
                else:
                    managers_wo_phones.append({
                        'name': operator.name.encode('utf8').decode('utf8'),
                        'role': operator.position.encode('utf8').decode('utf8'),
                        'photo_url': operator.photo_url,
                    })
                    

            if not len(managers_wo_phones):
                jdata.update({
                    'response': 'error',
                    'message': 'no managers found for this widget'})
                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps(jdata, ensure_ascii=False)),
                                    'text/javascript')                    
                
            if len(manager) == 0:
                manager = managers_wo_phones[0]

            # return managers to the widget - to show pictures and names
            # but without phone number
            jdata['managers'] = managers_wo_phones

            # provide client schedule
            jdata['schedule'] = widget.schedule.asList()

            #--- REQUEST OPTIONS
            # retrieve widget settings from DB when widget loads
            if 'request_options' in request.GET:
                hostname = request.GET.get('hostname', None)
                valid_host = False
                # print 'request_options', widget.site_url, hostname, unicode(hostname).decode('idna'), type(unicode(hostname).decode('idna'))
                if hostname:
                    if widget.site_url.count(hostname):
                        valid_host = True
                    if widget.site_url.count(unicode(hostname).decode('idna')):
                        valid_host = True
                if not valid_host:
                    jdata.update({'response': 'refused',
                                  'message': 'incorrect host name', })
                    return HttpResponse('%s(%s);' % (
                        request.GET['callback'],
                        json.dumps(jdata, ensure_ascii=False)),
                                        'text/javascript')

                s = json.loads(widget.settings)
                # BE SURE TO CHECK FOR DEFAULT VALUES FOR ALL NEW OPTIONS !!!
                if 'cookie_ttl_seconds' not in s:
                    s['cookie_ttl_seconds'] = 1 * 60 * 60
                if 'submit_button_line_height' not in s:
                    s['submit_button_line_height'] = 42
                if 'encoding' not in s:
                    s['encoding'] = 'utf-8'
                # TODO
                s['position'] = 'fixed'
                s['flag_is_operator_shown_in_widget'] = widget.is_operator_shown_in_widget
                s['flag_disable_on_mobiles'] = widget.disable_on_mobiles
                jdata['options'] = s
                
                jdata.update({
                    'response': 'ok',
                    'message': 'connected'})
                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps(jdata, ensure_ascii=False)),
                                    'text/javascript')

            #--- REQUEST STATUS
            if 'request_status' in request.GET: 
                hostname = request.GET.get('hostname', None)
                call_id = request.GET.get('call_id', None)
                valid_host = False
                # print 'request_options', widget.site_url, hostname, unicode(hostname).decode('idna'), type(unicode(hostname).decode('idna'))
                if hostname:
                    if widget.site_url.count(hostname):
                        valid_host = True
                    if widget.site_url.count(unicode(hostname).decode('idna')):
                        valid_host = True
                if not valid_host:
                    jdata.update({'response': 'refused',
                                  'message': 'incorrect host name', })
                    return HttpResponse('%s(%s);' % (
                        request.GET['callback'],
                        json.dumps(jdata, ensure_ascii=False)),
                                        'text/javascript')
                try:
                    callback = PendingCallback.objects.get(mtt_callback_call_id=call_id)
                except ObjectDoesNotExist:
                    random_delay(finishing_with=0.6)  # to prevent time attacks
                    jdata.update({'response': 'failed',
                                  'message': 'call id %s not found' % call_id, })
                    return HttpResponse('%s(%s);' % (
                        request.GET['callback'],
                        json.dumps(jdata, ensure_ascii=False)),
                                        'text/javascript')
                    
                jdata['status'] = {
                    'tracking_history': callback.tracking_history,
                    }

                jdata.update({
                    'response': 'ok',
                    'message': 'connected'})
                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps(jdata, ensure_ascii=False)),
                                    'text/javascript')
                    
            #--- ORDER CALL
            if 'order_time' in request.GET and 'order_day' in request.GET and 'order_delta_day' in request.GET and 'order_phone' in request.GET:
                jdata['notify_by_email'] = widget.callback_notifications_email
                jdata['order_time'] = request.GET['order_time']
                jdata['order_day'] = request.GET['order_day']
                jdata['order_delta_day'] = request.GET['order_delta_day']
                jdata['order_phone'] = request.GET['order_phone']
                if self.is_number_in_blacklist(jdata['order_phone'], widget.blacklist_phones.split(',')):
                    jdata.update({'response': 'refused',
                                  'message': '%s were found in the black list' % jdata['order_phone'], })
                    return HttpResponse('%s(%s);' % (
                        request.GET['callback'],
                        json.dumps(jdata, ensure_ascii=False)),
                                        'text/javascript')
                try:
                    # notify manager via email
                    mail.send_email_order_call(
                        widget.callback_notifications_email,
                        jdata['order_phone'],
                        jdata['order_day'],
                        jdata['order_time'],
                        widget.site_url)  
                    # notify manager via SMS
                    sms.send(widget.sms_notification_number, 
                        "Заказ обратного звонка с %s, телефон: %s, время для связи: %s в %s" % (
                            widget.site_url,
                            jdata['order_phone'],
                            jdata['order_day'],
                            jdata['order_time']))
                    response = 'ok'
                except:
                    traceback.print_exc()
                    response = 'exception: ' + traceback.format_exc()

                jdata.update({'response': response,
                              'message': 'sending email to manager on %s' % widget.callback_notifications_email, })

                try:
                    order_time = jdata['order_time'].split(':')
                    order_date = datetime.datetime.combine(
                        datetime.datetime.now() + datetime.timedelta(days=int(jdata['order_delta_day'])),
                        datetime.time(hour=int(order_time[0]), minute=int(order_time[1])))
                    self.order_deferred_callback(widget, jdata['ip'], jdata['referrer'],
                                                 jdata['search_request'], order_date, jdata['order_phone'])
                except:
                    import traceback
                    print traceback.format_exc()

                # temporary save data to the local file
                filename = '/home/callfeed/incomings/%s_%s.txt' % (
                    jdata['ip'].replace('.', '_'), jdata['callback'])
                open(filename, 'wb').write(pprint.pformat(jdata))
                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps(jdata, ensure_ascii=False)),
                                    'text/javascript')

            #--- TIME OFF
            if 'timeoff_time' in request.GET and 'timeoff_day' in request.GET and 'timeoff_phone' in request.GET:
                jdata['notify_by_email'] = widget.callback_notifications_email
                jdata['timeoff_time'] = request.GET['timeoff_time']
                jdata['timeoff_day'] = request.GET['timeoff_day']
                jdata['timeoff_phone'] = request.GET['timeoff_phone']
                if self.is_number_in_blacklist(jdata['timeoff_phone'], widget.blacklist_phones.split(',')):
                    jdata.update({'response': 'refused',
                                  'message': '%s were found in the black list' % jdata['timeoff_phone'], })
                    return HttpResponse('%s(%s);' % (
                        request.GET['callback'],
                        json.dumps(jdata, ensure_ascii=False)),
                                        'text/javascript')
                try:
                    # notify manager via email
                    mail.send_email_timeoff_order_call(
                        widget.callback_notifications_email,
                        jdata['timeoff_phone'],
                        jdata['timeoff_day'],
                        jdata['timeoff_time'],
                        widget.site_url)  
                    # notify manager via SMS
                    sms.send(widget.sms_notification_number, 
                        "Заказ звонка с %s в нерабочее время, телефон: %s, время для связи: %s в %s" % (
                            widget.site_url,                                                                                                        
                            jdata['timeoff_phone'],
                            jdata['timeoff_day'],
                            jdata['timeoff_time']))
                    response = 'ok'
                except:
                    traceback.print_exc()
                    response = 'exception: ' + traceback.format_exc()

                jdata.update({'response': response,
                              'message': 'sending email to manager, email=%s' % widget.callback_notifications_email, })

                # temporary save data to the local file
                filename = '/home/callfeed/incomings/%s_%s.txt' % (
                    jdata['ip'].replace('.', '_'), jdata['callback'])
                open(filename, 'wb').write(pprint.pformat(jdata))

                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps(jdata, ensure_ascii=False)),
                                    'text/javascript')

            #--- SEND MESSAGE
            if 'message_text' in request.GET and 'message_email' in request.GET and 'message_phone' in request.GET:
                jdata['notify_by_email'] = widget.callback_notifications_email
                jdata['message_text'] = request.GET['message_text']
                jdata['message_email'] = request.GET['message_email']
                jdata['message_phone'] = request.GET['message_phone']
                if self.is_number_in_blacklist(jdata['message_phone'], widget.blacklist_phones.split(',')):
                    jdata.update({'response': 'refused',
                                  'message': '%s were found in the black list' % jdata['message_phone'], })
                    return HttpResponse('%s(%s);' % (
                        request.GET['callback'],
                        json.dumps(jdata, ensure_ascii=False)),
                                        'text/javascript')
                # pprint.pprint(widget.offline_message_notifications_email)
                # pprint.pprint(jdata)
                try:
                    # notify manager via email
                    mail.send_email_message(
                        str(widget.offline_message_notifications_email),
                        jdata['message_phone'],
                        str(jdata['message_email']),
                        jdata['message_text'],
                        widget.site_url)  
                    response = 'ok'
                except:
                    traceback.print_exc()
                    response = 'exception: ' + traceback.format_exc()

                if response == 'ok':
                    print str(widget.sms_notification_number)
                    sms_ret = ''
                    try:
                        # pass
                        # notify manager via SMS
                        sms_ret = sms.send(str(widget.sms_notification_number), 
                            "Получено новое сообщение от посетителя %s, проверьте ваш почтовый ящик" % (
                                widget.site_url))
                    except Exception as e:
                        print 'sms error', e
                        # traceback.print_exc()
                        response = 'exception: ' + str(e) # traceback.format_exc()

                jdata.update({'response': response,
                              'message': 'sending email to manager on %s' % widget.callback_notifications_email, })

                # temporary save data to the local file
                filename = '/home/callfeed/incomings/%s_%s.txt' % (
                    jdata['ip'].replace('.', '_'), jdata['callback'])
                open(filename, 'wb').write(pprint.pformat(jdata))
                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps(jdata, ensure_ascii=False)),
                                    'text/javascript')

            #--- FREE VERSION
            if 'free_time' in request.GET and 'free_day' in request.GET and 'free_phone' in request.GET:
                jdata['notify_by_email'] = widget.callback_notifications_email
                jdata['free_time'] = request.GET['free_time']
                jdata['free_day'] = request.GET['free_day']
                jdata['free_phone'] = request.GET['free_phone']
                if self.is_number_in_blacklist(jdata['free_phone'], widget.blacklist_phones.split(',')):
                    jdata.update({'response': 'refused',
                                  'message': '%s were found in the black list' % jdata['free_phone'], })
                    return HttpResponse('%s(%s);' % (
                        request.GET['callback'],
                        json.dumps(jdata, ensure_ascii=False)),
                                        'text/javascript')
                try:
                    mail.send_email_free_version_notification(
                        widget.callback_notifications_email,
                        jdata['free_phone'],
                        jdata['free_day'],
                        jdata['free_time'],
                        widget.site_url)  # notify manager via email
                    response = 'ok'
                except:
                    traceback.print_exc()
                    response = 'exception: ' + traceback.format_exc()

                jdata.update({'response': response,
                              'message': 'sending email to manager, email=%s' % widget.callback_notifications_email, })

                # temporary save data to the local file
                filename = '/home/callfeed/incomings/%s_%s.txt' % (
                    jdata['ip'].replace('.', '_'), jdata['callback'])
                open(filename, 'wb').write(pprint.pformat(jdata))
                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps(jdata, ensure_ascii=False)),
                                    'text/javascript')

            #--- PAID VERSION CHECK
            if 'phone' not in request.GET:
                jdata.update({
                    'response': 'ok',
                    'message': 'connected'})
                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps(jdata, ensure_ascii=False)),
                                    'text/javascript')

            jdata['phone'] = request.GET['phone']

            if self.is_number_in_blacklist(jdata['phone'], widget.blacklist_phones.split(',')):
                jdata.update({'response': 'refused',
                              'message': '%s were found in the black list' % jdata['phone'], })
                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps(jdata, ensure_ascii=False)),
                                    'text/javascript')
            #--- INITIATE CALLBACK
            callback_result = JSONPEntryPoint.initiate_callback(jdata['phone'], widget, '', '', jdata['ip'])
            if callback_result[0] == 'exception':
                jdata.update({'response': 'error', 'message': callback_result[1], })
                # temporary save data to the local file
                filename = '/home/callfeed/incomings/%s_%s.txt' % (
                    jdata['ip'].replace('.', '_'), jdata['callback'])
                open(filename, 'wb').write(pprint.pformat(jdata))
                return HttpResponse('%s(%s);' % (
                    request.GET['callback'],
                    json.dumps(jdata, ensure_ascii=False)),
                                    'text/javascript')

            jdata['mtt_response'] = callback_result[0]
            jdata.update({'response': 'ok', 'message': callback_result[1], })

            mtt_response = jdata.get('mtt_response', {})
            mtt_response_result = mtt_response.get('result', None)

#            if mtt_response_result is not None:
#                mtt_response_result_callback_id = mtt_response_result.get('callBackCall_id', None)
#
#                if mtt_response_result_callback_id is not None:
#                    pending_callback = PendingCallback(
#                        widget=widget,
#                        mtt_callback_call_id=mtt_response_result_callback_id,
#                        ip_side_b=client_ip_addr,
#                        geodata_side_b=ip_to_location(client_ip_addr),
#                        referer=jdata['referrer'],
#                        search_request=jdata['search_request'],
#                        when=datetime.datetime.now())
#                    pending_callback.save()

            # temporary save data to the local file
            filename = '/home/callfeed/incomings/%s_%s.txt' % (
                jdata['ip'].replace('.', '_'), jdata['callback'])
            open(filename, 'wb').write(pprint.pformat(jdata))
            
            print ('MTT CALL!!!',  jdata['token'], jdata['hostname'], jdata['phone'], client_ip_addr, mtt_response_result)

        except Exception as e:
            traceback.print_exc()

        return HttpResponse('%s(%s);' % (
            request.GET['callback'],
            json.dumps(jdata, ensure_ascii=False)), 'text/javascrit')





            # new_pending_info.mtt_callback_call_id = mtt_response_result_callback_id
            # new_pending_info.save()
            
            # if new_pending_info.mtt_callback_call_id != mtt_response_result_callback_id:
                # print ('        WARNING: %s != %s' % (mtt_response_result_callback_id, new_pending_info.mtt_callback_call_id))
                # return ('error', '%s != %s' % (mtt_response_result_callback_id, new_pending_info.mtt_callback_call_id))
                
#            mtt_response_check = mttproxy.getCallBackFollowmeCallInfo(mtt.CUSTOMER_NAME, mtt_response_result_callback_id)
#            mtt_response_check_result = mtt_response_check.get('result', None)
#    
#            if mtt_response_check_result is None:
#                print ('        ERROR: getCallBackFollowmeCallInfo returned None')
#                return ('error', 'getCallBackFollowmeCallInfo returned None',)
#    
#            call_info_struct = mtt_response_check_result.get('callBackFollowmeCallInfoStruct', None)
#    
#            if call_info_struct is None:
#                print ('        ERROR: callBackFollowmeCallInfoStruct is None')
#                return ('error', 'callBackFollowmeCallInfoStruct is None',)
#    
#            record_url_a = call_info_struct.get('call_back_record_URL_A', '')
#            record_url_a = call_info_struct.get('downloadURL', '')
#            record_url_b = call_info_struct.get('call_back_record_URL_B', '')
#            record_url_b = call_info_struct.get('downloadURL', '')
#     
#            new_pending_info.call_description = call_info_struct.get('callDescription', '')
#            new_pending_info.phone_number_side_a = call_info_struct.get('destination_A', '')
#            new_pending_info.phone_number_side_b = call_info_struct.get('destination_B', '')
#            new_pending_info.charged_length_a_sec=int(call_info_struct.get('call_back_charged_length_A', '0'))
#            new_pending_info.charged_length_b_sec=int(call_info_struct.get('call_back_charged_length_B', '0'))
#            new_pending_info.real_length_a_sec=int(call_info_struct.get('call_back_real_length_A', '0'))
#            new_pending_info.real_length_b_sec=int(call_info_struct.get('call_back_real_length_B', '0'))
#            new_pending_info.record_url_a = record_url_a
#            new_pending_info.record_url_b = record_url_b
#            new_pending_info.waiting_period_a_sec = call_info_struct.get('waiting_period_A', '0')
#            new_pending_info.waiting_period_b_sec = call_info_struct.get('waiting_period_B', '0')
#            new_pending_info.callback_status = CallbackInfo.CALLBACK_STATUS_SUCCEED
#            new_pending_info.cost = call_info_struct.get('call_back_cost', 0.0)
#            new_pending_info.currency = call_info_struct.get('call_back_currency', 'RUB')
#            # new_pending_info.ip_side_b = callback.ip_side_b
#            # new_pending_info.geodata_side_b='-'
#            # mtt_callback_call_id=callback.mtt_callback_call_id,
#            # new_pending_info.referer = callback.referer, search_request=callback.search_request,
#            # new_pending_info.when = callback.when,
#            # new_pending_info.tracking_history=callback.tracking_history
#            new_pending_info.save()
#    
#            try:
#                charged_a = int(call_info_struct.get('call_back_charged_length_A', '0'))
#                charged_b = int(call_info_struct.get('call_back_charged_length_B', '0'))
#                widget.client.balance_minutes -= int((float(charged_a) + float(charged_b)) / 60.0)
#                widget.client.save()
#                print ('        BALANCE:', widget.client.name, widget.client.email, widget.client.balance_minutes)
#            except:
#                traceback.print_exc()      



 
                    
#                if mtt_response_result_callback_id is not None:
#                    new_pending_callback = PendingCallback(widget=widget,
#                                                       mtt_callback_call_id=mtt_response_result_callback_id,
#                                                       ip_side_b=ip_address,
#                                                       geodata_side_b=ip_to_location(ip_address),
#                                                       referer=rferrer_str,
#                                                       search_request=search_str,
#                                                       when=datetime.datetime.now(),
#                                                       tracking_history='')
#                    new_pending_callback.save()