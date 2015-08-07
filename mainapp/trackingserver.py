# coding=utf-8
"""
Этот модуль реагирует на вызовы МТТ, сообщающие о смене статуса звонка.
"""

import datetime

from django.core.exceptions import ObjectDoesNotExist
from django.views.generic import View
from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404 

from mainapp.models import CallbackInfo, PendingCallback, CALLBACK_STATUS_SUCCEED, CALLBACK_STATUS_LASTING 
from mainapp.utils.common import random_delay
from mainapp.utils import mtt
from mainapp.tasks import refresh_pending_callbacks

#------------------------------------------------------------------------------ 

def track_by_id(request, id):
    event = request.GET.get('stage', None)
    callback_id = request.GET.get('id', None)
    
    print 'track_by_id', id, event, callback_id
    
    if None in (event, callback_id):
        random_delay(finishing_with=0.6)  # to prevent time attacks
        return HttpResponse('')

    try:
        callback = PendingCallback.objects.get(id=int(id))
    except:
        callback = None
        
    if not callback:
        print '        PendingCallback %s is not found' % id
        random_delay(finishing_with=0.6)  # to prevent time attacks
        return HttpResponse('')
        
    # if callback.mtt_callback_call_id != callback_id:
        # print ('        WARNING: %s != %s' % (callback_id, callback.mtt_callback_call_id))
        
    dt = 0.0
    try:
        dt = (datetime.datetime.now() - callback.when).total_seconds() 
    except:
        import traceback
        traceback.print_exc()
    
    callback.mtt_callback_call_id = callback_id
    callback.tracking_history += "%s(%s);" % (event, dt)
    
    need_refresh = False
    if callback.is_finished():
        callback.callback_status = CALLBACK_STATUS_SUCCEED
        need_refresh = True
    elif callback.is_lasting():
        callback.callback_status = CALLBACK_STATUS_LASTING
        need_refresh = True
        
    callback.save()
        
    print '        OK! %s, need_refresh=%s' % (
        callback.tracking_history, need_refresh) 

    if need_refresh:
        refresh_pending_callbacks(id=callback.id)

    random_delay()  # to prevent time attacks
    return HttpResponse('')        
        
#------------------------------------------------------------------------------ 

#class CallTrackingPoint(View):
#    def get(self, request):
#        """
#        available event types:
#        * start_side_A - when an operator picks up the phone
#        * start_side_B - when a client picks up the phone
#        * end_side_A - when an operator drops the line
#        * end_side_B - when a client drops the line
#        """
#        event = request.GET.get('event', None)
#        callback_id = request.GET.get('id', None)
#        
#        print 'CallTrackingPoint', event, callback_id
#
#        if None in (event, callback_id):
#            return HttpResponse('')
#
#        try:
#            callback = CallbackInfo.objects.get(mtt_callback_call_id=callback_id)
#            print 'CallTrackingPoint found CallbackInfo:', callback
#        except ObjectDoesNotExist:
#            try:
#                callback = PendingCallback.objects.get(mtt_callback_call_id=callback_id)
#            except:
#                print 'CallTrackingPoint  mtt_callback_call_id %s  is not found' % callback_id
#                random_delay(finishing_with=0.6)  # to prevent time attacks
#                return HttpResponse('')
#            
#            print 'CallTrackingPoint found PendingCallback %s' % callback
#
#        dt = 0
#        try:
#            dt = datetime.datetime.now() - callback.when
#        except:
#            import traceback
#            traceback.print_exc()
#        
#        print '        %s %s' % (event, dt) 
#
#        callback.tracking_history += ("%s(%s);" % (event, dt))
#        callback.save()
#
##        if event == CallbackInfo.TRACKING_EVENT_START_SIDE_A:
##            callback.update_tracking(CallbackInfo.TRACKING_EVENT_START_SIDE_A)
##        elif event == CallbackInfo.TRACKING_EVENT_START_SIDE_B:
##            callback.update_tracking(CallbackInfo.TRACKING_EVENT_START_SIDE_B)
##        elif event == CallbackInfo.TRACKING_EVENT_END_SIDE_A:
##            callback.update_tracking(CallbackInfo.TRACKING_EVENT_END_SIDE_A)
##        elif event == CallbackInfo.TRACKING_EVENT_END_SIDE_B:
##            callback.update_tracking(CallbackInfo.TRACKING_EVENT_END_SIDE_B)
#
##        if callback.is_finished():
##            callback.callback_status = CallbackInfo.CALLBACK_STATUS_SUCCEED
##            callback.save()
##        elif callback.is_lasting():
##            callback.callback_status = CallbackInfo.CALLBACK_STATUS_LASTING
##            callback.save()
#
#        random_delay()  # to prevent time attacks
#        return HttpResponse('')

