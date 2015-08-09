# coding=utf-8
"""
Здесь лежат функции, ответственные за отправку мыла. Как правило, каждой функции соответствует
HTML-шаблон, а на вход функциям подаются данные, которые будут использоваться для вставки в
тело письма, и, обычно, адрес получателя.
"""

import locale

from django.core.mail import send_mail
from callfeed import settings

__author__ = 'max'

CALLFEED_EMAIL = 'info@callfeed.ru'

#------------------------------------------------------------------------------ 

def send_email(subject, message, recipients):
    """
    Пример использования: send_mail(subject, '', 'info@callfeed.ru', 'vesellov@gmail.com', html_message=message)
    :param subject: тема письма
    :param message: сообщение(в html-разметке)
    :param recipients: адресат(-ы)
    :return:
    """

    if isinstance(recipients, str) or isinstance(recipients, unicode):
        recipients = [recipients,]

    result = send_mail("CallFeed.NET: " + subject, '', CALLFEED_EMAIL, recipients, html_message=message)
    print 'EMAIL', recipients, len(message), 'bytes'
    return result


# Ниже идут обёртки над функцией send_email


def send_email_order_call(notification_email, order_phone, order_day, order_time, url):
    subject = u'Заказ обратного звонка с сайта'
    template_content = unicode(open('%s/mail/callback_request.html' % settings.TEMPLATE_DIRS[0], 'r').read(), 'utf-8')
    mail_body = template_content % {'order_phone': order_phone,
                                    'order_day': order_day,
                                    'order_time': order_time,
                                    'url': url}
    return send_email(subject, mail_body, notification_email)


def send_email_timeoff_order_call(notification_email, timeoff_phone, timeoff_day, timeoff_time, url):
    subject = u'Заказ звонка с сайта в нерабочее время'
    template_content = unicode(open('%s/mail/callback_timeoff_request.html' % settings.TEMPLATE_DIRS[0], 'r').read(),
                               'utf-8')
    mail_body = template_content % {'timeoff_phone': timeoff_phone,
                                    'timeoff_day': timeoff_day,
                                    'timeoff_time': timeoff_time,
                                    'url': url}
    return send_email(subject, mail_body, notification_email)


def send_email_out_of_balance_initiate_callback(notification_email, phone_number, when, url):
    subject = u'Заказ обратного звонка с сайта(недостаточно средств)'
    template_content = unicode(open('%s/mail/out_of_balance_initiate_callback.html' % settings.TEMPLATE_DIRS[0], 'r').read(),
                               'utf-8')
    mail_body = template_content % {'phone_number': phone_number,
                                    'when': when,
                                    'url': url}
    return send_email(subject, mail_body, notification_email)


def send_email_message(notification_email, message_phone, message_email, message_text, url):
    subject = u'Новое сообщение от посетителя сайта %s' % url
    template_content = unicode(open('%s/mail/callback_message.html' % settings.TEMPLATE_DIRS[0], 'r').read(), 'utf-8')
    mail_body = template_content % {'message_phone': message_phone,
                                    'message_text': message_text,
                                    'message_email': message_email,
                                    'url': url}
    return send_email(subject, mail_body, notification_email)


def send_email_free_version_notification(notifications_email, phone_number, day, time, site_url):
    subject = u'Запрос обратного звонка'
    template_content = unicode(
        open('%s/mail/callback_free_version_notification.html' % settings.TEMPLATE_DIRS[0], 'r').read(),
        'utf-8')
    mail_body = template_content % {'phone_number': phone_number,
                                    'day': day,
                                    'time': time,
                                    'site_url': site_url, }
    return send_email(subject, mail_body, notifications_email)


def send_email_act_request(bill_id, client_id, client_name):
    subject = u'Запрос акта оплаты(счёт #%s)' % bill_id
    template_content = unicode(open('%s/mail/bills_act_request.html' % settings.TEMPLATE_DIRS[0], 'r').read(), 'utf-8')
    mail_body = template_content % {'bill_id': bill_id,
                                    'client_id': client_id,
                                    'client_name': client_name}
    return send_email(subject, mail_body, CALLFEED_EMAIL)


def send_email_widget_setup_code(notification_email, widget_code):
    subject = u'Код виджета Callfeed для установки на сайт'
    template_content = unicode(open('%s/mail/widget_setup_request.html' % settings.TEMPLATE_DIRS[0], 'r').read(),
                               'utf-8')
    mail_body = template_content % {'widget_code': widget_code}
    return send_email(subject, mail_body, notification_email)


def send_email_request_cashless_payment(bill_id, client_id, client_name):
    subject = u'Запрос оплаты(счёт #%s)' % bill_id
    template_content = unicode(open('%s/mail/bills_act_request.html' % settings.TEMPLATE_DIRS[0], 'r').read(), 'utf-8')
    mail_body = template_content % {'bill_id': bill_id,
                                    'client_id': client_id,
                                    'client_name': client_name}
    return send_email(subject, mail_body, CALLFEED_EMAIL)


def send_email_password_reset_request(notification_email, confirmation_code):
    subject = u'Восстановление пароля'
    template_content = unicode(open('%s/mail/password_reset_request.html' % settings.TEMPLATE_DIRS[0], 'r').read(),
                               'utf-8')
    mail_body = template_content % {'confirmation_code': confirmation_code}
    return send_email(subject, mail_body, notification_email)


def send_email_new_user_registered(notification_email, password, name, phone):
    subject = u'Регистрация'
    template_content = unicode(open('%s/mail/new_user_registered.html' % settings.TEMPLATE_DIRS[0], 'r').read(),
                               'utf-8')
    mail_body = template_content % {'password': password,
                                    'name': name,
                                    'phone': phone,}
    return send_email(subject, mail_body, notification_email)
