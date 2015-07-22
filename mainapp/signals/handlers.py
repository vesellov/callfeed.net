# -*- coding: utf-8 -*-
"""
Обработчики сигналов
"""
__author__ = 'max'
from django.core.exceptions import ObjectDoesNotExist
from django.dispatch import receiver
from robokassa.signals import result_received, fail_page_visited
from mainapp.models import Bill

# Обработчики сигналов робокассы при осуществлении платежа
@receiver(result_received)
def payment_successful(sender, **kwargs):
    """Успешный платёж. Списываем средства, начисляем баланс"""
    try:
        bill = Bill.objects.get(id=kwargs['InvId'])
    except ObjectDoesNotExist:
        return

    if bill.status != Bill.BILL_STATUS_UNPAID:
        return

    bill.client.balance_minutes += bill.minutes
    bill.client.save()
    bill.status = Bill.BILL_STATUS_PAID
    bill.save()


@receiver(fail_page_visited)
def payment_failed(sender, **kwargs):
    """Платёж не прошёл"""
    print('FAIL', sender)
    print(kwargs['InvId'], kwargs['OutSum'], kwargs['extra'])

# ------------------------------------------------------------
