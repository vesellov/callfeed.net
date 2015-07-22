# -*- coding: utf-8 -*-
"""
Фильтры, используемые в шаблонах для генерации/подстановки значений
"""
__author__ = 'max'
import datetime
from mainapp.models import CallbackInfo, Bill
from django.template.defaulttags import register
from django import template

register = template.Library()


@register.filter
def get_item(dictionary, key):
    """Достать элемент из словаря по ключу"""
    return dictionary.get(key)


@register.filter
def get_nice_callback_status(callback_status_id):
    """Вернёт красивое имя по идентификатору статуса обратного звонка"""
    for callback_status in CallbackInfo.CALLBACK_STATUSES:
        if callback_status[0] == callback_status_id:
            return callback_status[1]

    return '-'


@register.filter
def get_nice_payment_method_title(payment_method_id):
    """Красивый заголовок метода платежа по идентификатору"""
    for payment_method in Bill.PAYMENT_METHODS:
        if payment_method[0] == payment_method_id:
            return payment_method[1]

    return '-'


@register.filter
def get_nice_bill_status_title(bill_status_id):
    """Красивый заголовок статуса платежа по идентификатору"""
    for bill_status in Bill.BILL_STATUSES:
        if bill_status[0] == bill_status_id:
            return bill_status[1]

    return '-'


@register.filter
def whether_payment_method_is_electron_and_unpaid(bill):
    """Метод платежа: элек"""
    return bill.payment_method == Bill.PAYMENT_METHOD_ELECTRON and bill.status == Bill.BILL_STATUS_UNPAID


@register.filter
def turn_sec_to_min(time_in_sec):
    return str(datetime.timedelta(seconds=time_in_sec))

# Улучшенная форма тэга for: позволяет параллельно итерироваться по нескольким объектам

import re

from itertools import izip
from django.template.base import TemplateSyntaxError
from django.template.defaulttags import ForNode


class ZipExpression(object):
    def __init__(self, var):
        self.var = var

    def resolve(self, *args, **kwargs):
        return izip(*(
            f.resolve(*args, **kwargs) for f in self.var
        ))


@register.tag('for')
def do_for(parser, token):
    """
    For tag with ziping multiple iterables.
    """
    bits = token.contents.split()
    if len(bits) < 4:
        raise TemplateSyntaxError("'foreach' statements should have at least"
                                  " four words: %s" % token.contents)

    is_reversed = False
    try:
        in_index = bits.index('in')
        sequence = bits[in_index + 1:]
        if sequence[-1] == 'reversed':
            is_reversed = True
            sequence.pop()
        if not sequence or 'in' in sequence:
            raise ValueError
        sequence = re.split(r' *, *', ' '.join(sequence))
    except ValueError:
        raise TemplateSyntaxError(
            "'foreach' statements should use the format"
            " 'foreach a,b,(...) in x,y,(...)': %s" % token.contents)

    loopvars = re.split(r' *, *', ' '.join(bits[1:in_index]))
    for var in loopvars:
        if not var or ' ' in var:
            raise TemplateSyntaxError("'foreach' tag received an invalid"
                                      " argumewnt: %s" % token.contents)

    if len(sequence) > 1:
        sequence = ZipExpression(map(parser.compile_filter, sequence))
    else:
        sequence = parser.compile_filter(sequence[0])

    nodelist_loop = parser.parse(('empty', 'endfor',))
    token = parser.next_token()
    if token.contents == 'empty':
        nodelist_empty = parser.parse(('endfor',))
        parser.delete_first_token()
    else:
        nodelist_empty = None
    return ForNode(
        loopvars, sequence, is_reversed, nodelist_loop, nodelist_empty)

####

