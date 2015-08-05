# coding=utf-8
"""
Этот модуль реагирует на вызовы МТТ, сообщающие о смене статуса звонка.
"""
from django.core.exceptions import ObjectDoesNotExist
from django.views.generic import View
from django.http import HttpResponse

from mainapp.models import CallbackInfo
from mainapp.utils.common import random_delay


class CallTrackingPoint(View):
    def get(self, request):
        """
        available event types:
        * start_side_A - when an operator picks up the phone
        * start_side_B - when a client picks up the phone
        * end_side_A - when an operator drops the line
        * end_side_B - when a client drops the line
        """
        event = request.GET.get('event', None)
        callback_id = request.GET.get('id', None)
        
        print ('CallTrackingPoint', event, callback_id)

        if None in (event, callback_id):
            return HttpResponse('')

        try:
            callback = CallbackInfo.objects.get(mtt_callback_call_id=callback_id)
        except ObjectDoesNotExist:
            print('CallTrackingPoint  mtt_callback_call_id %s  is not found' % callback_id)
            random_delay(finishing_with=0.6)  # to prevent time attacks
            return HttpResponse('')

        if event == CallbackInfo.TRACKING_EVENT_START_SIDE_A:
            callback.update_tracking(CallbackInfo.TRACKING_EVENT_START_SIDE_A)
        elif event == CallbackInfo.TRACKING_EVENT_START_SIDE_B:
            callback.update_tracking(CallbackInfo.TRACKING_EVENT_START_SIDE_B)
        elif event == CallbackInfo.TRACKING_EVENT_END_SIDE_A:
            callback.update_tracking(CallbackInfo.TRACKING_EVENT_END_SIDE_A)
        elif event == CallbackInfo.TRACKING_EVENT_END_SIDE_B:
            callback.update_tracking(CallbackInfo.TRACKING_EVENT_END_SIDE_B)

        if callback.is_finished():
            callback.callback_status = CallbackInfo.CALLBACK_STATUS_SUCCEED
            callback.save()
        elif callback.is_lasting():
            callback.callback_status = CallbackInfo.CALLBACK_STATUS_LASTING
            callback.save()

        random_delay()  # to prevent time attacks
        return HttpResponse('')
