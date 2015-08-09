# -*- coding: utf-8 -*-

import sys
import traceback

import datetime
import json
from decimal import Decimal
from django.contrib.auth.models import User, Group
from django.core.exceptions import ObjectDoesNotExist
from django.db import models, IntegrityError

from callfeed import settings
from mainapp import widget_settings
from mainapp.utils.common import rand_string
from mainapp.widget_settings import DEFAULT_SETTINGS

from django.db import models
# from apps.fields import BigAutoField, BigForeignKey

#------------------------------------------------------------------------------ 

CALLBACK_STATUS_STARTED = 'started'
CALLBACK_STATUS_SUCCEED = 'succeed'
CALLBACK_STATUS_PLANNED = 'planned'
CALLBACK_STATUS_LASTING = 'lasting'
CALLBACK_STATUS_FAIL_A = 'fail_a'
CALLBACK_STATUS_FAIL_B = 'fail_b'
CALLBACK_STATUS_FAIL_OUT_OF_BALANCE = 'out_of_balance'
#
TRACKING_EVENT_START_SIDE_A = 'start_side_A'
TRACKING_EVENT_START_SIDE_B = 'start_side_B'
TRACKING_EVENT_END_SIDE_A = 'end_side_A'
TRACKING_EVENT_END_SIDE_B = 'end_side_B'
#
CALLBACK_STATUSES = (
    (CALLBACK_STATUS_STARTED, 'Звонок инициирован'),                     
    (CALLBACK_STATUS_SUCCEED, 'Звонок прошёл успешно'),
    (CALLBACK_STATUS_PLANNED, 'Запланирован'),
    (CALLBACK_STATUS_LASTING, 'Звонок продолжается'),
    (CALLBACK_STATUS_FAIL_A, 'Оператор не взял трубку'),
    (CALLBACK_STATUS_FAIL_B, 'Клиент не взял трубку'),
    (CALLBACK_STATUS_FAIL_OUT_OF_BALANCE, 'Недостаточно минут'),
)
    
#------------------------------------------------------------------------------ 

class ResetPasswordStorage(models.Model):
    RESET_PASSWORD_CODE_LENGTH = 37
    PASSWORD_EXPIRATION_TIMEDELTA = datetime.timedelta(days=1)
    #
    user = models.OneToOneField(User)
    confirmation_code = models.CharField(max_length=RESET_PASSWORD_CODE_LENGTH)
    when_requested = models.DateTimeField()

    @staticmethod
    def gen_unique_confirmation_code():
        code = rand_string(length=ResetPasswordStorage.RESET_PASSWORD_CODE_LENGTH)

        while ResetPasswordStorage.objects.filter(confirmation_code=code).count() > 0:
            code = rand_string(length=ResetPasswordStorage.RESET_PASSWORD_CODE_LENGTH)

        return code

    def is_outdated(self):
        """
        Проверяем не вышел ли срок действия кода восстановления пароля
        """
        return datetime.datetime.now() - self.when_requested >= self.PASSWORD_EXPIRATION_TIMEDELTA


class Client(models.Model):
    MINIMUM_ALLOWED_BALANCE_MINUTES = 2  # Минимальное количество минут, при котором разрешается совешрать звонки.
                                         # Должно учитываться, т.к. звонки могут поступать параллельно, и может
                                         #  получиться так, что клиент сильно уйдёт в минус, если в один момент было
                                         #  совершено несколько параллельных звонков
    #
    user = models.OneToOneField(User)
    reseller = models.ForeignKey('Reseller', blank=True, null=True)
    name = models.CharField('Имя', max_length=35, blank=True, null=True)
    email = models.EmailField('Email', max_length=255)
    phone_number = models.CharField('Номер телефона', max_length=12)
    receive_email_notifications_flag = models.BooleanField('Получать email уведомления', default=True)
    receive_sms_notifications_flag = models.BooleanField('Получать SMS-уведомления', default=True)
    balance_minutes = models.IntegerField('Баланс', )

    def update_registration_data(self, update_dict):
        """
         Обновлять ЛЮБЫЕ регистрационные данные клиента ТОЛЬКО этим методом!

            Method is used to update client's registration data, as
         it is spread over a few models(Client and User at least), and
         it is very convenient to have a single method which does the thing.
         NB. This method does not perform password changing.
        :param update_dict: a dictionary of fields to be updated; ex.:
         {'name': 'new_name', 'email': 'new_email'}.
        :return: boolean - whether the operation successfully performed.
        """
        for key in update_dict:
            try:
                setattr(self, key, update_dict[key])
            except AttributeError, Exception:
                pass

            try:
                setattr(self.user, key, update_dict[key])
            except AttributeError, Exception:
                pass

        self.save()
        self.user.save()

    @staticmethod
    def register_new_client(email, password, name, phone_number):
        """ Warning! This method relays on hardcoded RESELLER object
        (so it may be absent one day).
        Для регистрации клиента нужно:
        * создать пользователя
        * создать объект Client
        * добавить пользовалетя в клиентскую группу
        * создать соответствующего оператора(он создаётся
        """
        try:
            reseller = Reseller.objects.get(id=3)
        except ObjectDoesNotExist:
            print('FAIL: RESELLER OBJECT NOT FOUND; '
                  'check "register_new_client" method of the Client model for further information.')
            return None

        try:
            user = User.objects.create_user(email, email, password)
            user.first_name = name
        except IntegrityError:
            print('FAIL: DUPLICATE USERNAME')
            return None

        if user is None:
            return None

        client = Client(user=user, reseller=reseller, name=name, email=email,
                        phone_number=phone_number, balance_minutes=widget_settings.FREE_MINUTES)

        if client is None:
            print('FAIL: COULD NOT CREATE A NEW CLIENT OBJECT')
            user.delete()
            return None

        try:
            client_group = Group.objects.get(name=settings.USER_GROUP_CLIENT)
        except ObjectDoesNotExist:
            print('FAIL: CLIENT GROUP DOES NOT EXIST')
            user.delete()
            client.delete()
            return False
        else:
            user.groups.add(client_group)

        user.save()
        client.save()

        operator = Operator(client=client, name=name, phone_number=phone_number, email=email,
                            is_delete_protected=True)
        operator.save()

        return client

    def __str__(self):
        return 'Client(%s; %s)' % (self.name, self.email)

    def __unicode__(self):
        return u'Client(%s; %s)' % (self.name, self.email)


class Reseller(models.Model):
    user = models.OneToOneField(User)
    administrative_manager = models.ForeignKey('AdministrativeManager')
    price_per_minute_rub = models.DecimalField(decimal_places=2, max_digits=12)
    tariff_web = models.ManyToManyField('Tariff', blank=True, null=True)  # Сетка тарифов,
                                                                          # доступных для покупки пользователем
    name = models.CharField(max_length=35)

    def __str__(self):
        return 'Reseller(%s)' % self.name

    def __unicode__(self):
        return u'Reseller(%s)' % self.name


class AdministrativeManager(models.Model):
    user = models.OneToOneField(User)
    name = models.CharField(max_length=35)

    def __str__(self):
        return 'AdministrativeManager(%s)' % self.name

    def __unicode__(self):
        return u'AdministrativeManager(%s)' % self.name


class OperatorDepartment(models.Model):
    """
    Отдел. Позже нужно реализовать, когда будет добавляться функционал по отделам
    """
    pass


class Operator(models.Model):
    client = models.ForeignKey(Client)
    related_widgets = models.ManyToManyField('Widget', blank=True, null=True, related_name='related_operators')
    name = models.CharField('Имя', max_length=35)
    position = models.CharField('Должность', max_length=35, default=widget_settings.DEFAULT_OPERATOR_POSITION)
    phone_number = models.CharField('Номер телефона', max_length=12)
    email = models.EmailField('Email', max_length=255)
    photo_url = models.CharField('Фото', max_length=255, blank=True, null=True)
    is_delete_protected = models.BooleanField(default=False)  # an ordinary user cannot delete it

    def delete(self, *args, **kwargs):
        if self.is_delete_protected:
            # handle delete protected operators
            return

        super(Operator, self).delete(*args, **kwargs)

    def __str__(self):
        return 'Operator(%s)' % self.name

    def __unicode__(self):
        return u'Operator(%s)' % self.name


class Tariff(models.Model):
    name = models.CharField('Газвание тарифа', max_length=20)
    description = models.TextField('Описание', blank=True, null=True)
    price_per_minute = models.DecimalField('Цена(руб./мин.)', decimal_places=2, max_digits=12)
    minutes = models.IntegerField('Минуты')
    free_minutes = models.IntegerField('Бесплатные минуты')

    def __str__(self):
        return 'Tariff: %s (%smin.; %s RUB/min.; %s free mins)' \
               % (self.name, self.minutes, self.price_per_minute, self.free_minutes)

    def __unicode__(self):
        return u'Tariff: %s (%smin.; %s RUB/min.; %s free mins)' \
               % (self.name, self.minutes, self.price_per_minute, self.free_minutes)


class Widget(models.Model):
    SETTINGS_FIELD_MAX_LENGTH = 5000  # максмальная длина поля, в котором будут храниться все настройки
                                      # виджета
    #
    CALLBACK_TYPE_RING_ALL = 'ringall'
    CALLBACK_TYPE_LINEAR = 'linear'
    CALLBACK_TYPES = (
        (CALLBACK_TYPE_RING_ALL, 'Одновременно'),
        (CALLBACK_TYPE_LINEAR, 'По очереди'),
    )
    #
    INCOMING_NUMBER_CALLFEED = 'callfeed'
    INCOMING_NUMBER_CLIENT = 'client'
    INCOMING_NUMBER_CHOICES = [(INCOMING_NUMBER_CALLFEED, 'Callfeed'),
                               (INCOMING_NUMBER_CLIENT, 'Клиент')]
    #
    GEO_FILTER_ALL = 'all'
    GEO_FILTER_CHOICES = [(GEO_FILTER_ALL, 'Все'), ]
    #
    client = models.ForeignKey(Client)
    schedule = models.OneToOneField('Schedule', blank=True, null=True)
    settings = models.CharField(max_length=SETTINGS_FIELD_MAX_LENGTH, default=widget_settings.DEFAULT_SETTINGS_JSON)
    site_url = models.URLField('Адрес сайта', blank=True, null=True)
    is_active = models.BooleanField('Активен', default=True)
    is_email_notification_on = models.BooleanField('Получать email уведомления', default=False)
    is_sms_notification_on = models.BooleanField('Получать SMS-уведомления', default=False)
    is_operator_name_included = models.BooleanField('Включать имя оператора в SMS', default=False)
    is_operator_shown_in_widget = models.BooleanField('Показывать в виджете информацию об операторе', default=False)
    callback_type = models.CharField('Порядок дозвона', max_length=10, choices=CALLBACK_TYPES,
                                     default=CALLBACK_TYPE_LINEAR)
    is_raw = models.BooleanField(default=False)  # whether the widget ready for being used(all its options are complete).
                                                # Actually, the only required option is 'site_url'
    is_installed = models.BooleanField('Установлен', default=False)  # whether the widget installed on the web site
    time_before_callback_sec = models.IntegerField('Время до соединения', default=15)
    # delay_before_callback_from_a_to_b = models.IntegerField('Задержка между вызовом оператора и клиента', default=0)
    # delay_before_callback_to_additional_number = models.IntegerField('Задержка перед набором добавочного номера',
    #                                                                 default=0)
    operator_incoming_number = models.CharField('Отображаемый входящий номер у оператора',
                                                choices=INCOMING_NUMBER_CHOICES,
                                                default=INCOMING_NUMBER_CALLFEED,
                                                max_length=8)
    speak_site_name = models.BooleanField('Проговаривать имя сайта', default=False)
    geo_filter = models.CharField('Гео-фильтр', choices=GEO_FILTER_CHOICES, default=GEO_FILTER_ALL,
                                  max_length=20)
    disable_on_mobiles = models.BooleanField('Отключить на мобильных', default=False)
    blacklist_phones = models.CharField('Чёрный список номеров телефонов', max_length=3000, default='', blank=True)
    blacklist_ip = models.CharField('Чёрный список IP-адресов', max_length=3000, default='', blank=True)
    #
    sms_notification_number = models.CharField('Номер для SMS-уведомлений', max_length=20, blank=True,
                                               null=True)
    callback_notifications_email = models.EmailField('Email для уведомления о звонках', blank=True, null=True)
    out_of_balance_notifications_email = models.EmailField('Email для уведомления при нулевом балансе', blank=True,
                                                           null=True)
    offline_message_notifications_email = models.EmailField('Email для оффлайн сообщений', blank=True,
                                                            null=True)
    #
    default_operator = models.ForeignKey(Operator, related_name='widgets_operator_is_default_for',
                                         blank=True, null=True)

    def validate(self):
        """
        Если виджет не настроен - мы его "деактивируем".
         При попытке создать новый виджет, пользователю будет
         предложено отредактировать недонастроенный.
         Это нужно для предотвращения ситуаций, когда пользователь
          насоздаёт кучу пустых виджетов.
        """
        self.is_raw = self.site_url in ('', None)

        if self.is_raw:
            self.is_active = False

    @staticmethod
    def create_or_get_raw(widget_id, user, site_url=None):
        """
        Чтобы не плодить кучу пустых виджетов,
         мы хотим давать пользователю редактировать
         один из старых недонастроенных.
        """
        widget = None

        try:
            # want to edit an existing widget
            widget = user.client.widget_set.get(id=widget_id)
            if site_url:
                widget.site_url = site_url
        except (ObjectDoesNotExist, KeyError):
            # want to create a new widget
            widget_filter = user.client.widget_set.filter(is_raw=True)
            if widget_filter.exists():
                widget = widget_filter.first()
                if site_url:
                    widget.site_url = site_url
            else:
                schedule = Schedule()
                schedule.save()
                widget = Widget(client=user.client, schedule=schedule, site_url=site_url,
                                sms_notification_number=user.client.phone_number,
                                callback_notifications_email=user.client.email,
                                out_of_balance_notifications_email=user.client.email,
                                offline_message_notifications_email=user.client.email)
                if user.client.operator_set.filter(is_delete_protected=True).exists():
                    widget.default_operator = user.client.operator_set.filter(is_delete_protected=True).first()
                    widget.save()
                    widget.related_operators.add(widget.default_operator)

        if widget.schedule is None:
            schedule = Schedule()
            schedule.save()
            widget.schedule = schedule
        else:
            print(widget.schedule)

        widget.schedule.save()
        widget.save()

        return widget

    def gen_setup_code(self):
        return widget_settings.SETUP_CODE_TEMPLATE % {'widget_id': self.id}

    def check_if_installed(self):
        """
        Проверяем установлен ли виджет на сайт пользователя.
        По хорошему, надо быть осторожнее с этой функцией и неплохо бы
        запретить вызывать её слишком часто, иначе это можно использовать
        во вред.
        """
        # setup_code_lines = self.gen_setup_code().split('\n')
        setup_code_lines = [
            "var CallFeedToken = ",
            "http://callfeed.net/static/cf.",
            ]
        
        import requests
        print 'check_if_installed ', str(self.site_url)
        try:
            page_content = requests.get(self.site_url).content
        except:
            self.is_installed = False
            self.save()
            print ('        FAILED, is_installed: ', str(self.is_installed))
            return False

        pos = 0

        for line in setup_code_lines:
            tmp_pos = page_content.find(line)

            if tmp_pos < pos:
                self.is_installed = False
                self.save()
                print '        NOT FOUND, is_installed: ', str(self.is_installed)
                return False

            pos = tmp_pos

        self.is_installed = True
        self.save()
        print '        FOUND!!!, is_installed: ', str(self.is_installed)
        return True

    def update_settings(self, form, excluded_fields=None):
        """
        Обновляет поле 'settings' виджета из заданной формы.
        При этом, если значение поля формы совпадает со стандартным
         (указанным в файле widget_settings в словаре DEFAULT_SETTINGS),
         оно удаляется из поля 'settings' в виджете(соответственно,
         виджет будет подхватывать значение по умолчанию для этого поля).
        Для исключения из рассмотрения каких-нибудь отдельных полей,
         (например, если форма содержит не только поля с настройками,
         которые должны быть помещены в поле 'settings' виджета)
         нужно передать имя искомого поля в списке excluded_fields
         как входной аргумент для функции.
        """
        if not excluded_fields:
            excluded_fields = []

        currents = json.loads(self.settings)  # текущие настройки виджета
        defaults = widget_settings.DEFAULT_SETTINGS  # стандартные настройки виджета

        def create(key, value):
            currents[key] = value

        def update(key, value):
            currents[key] = value

        def delete(key):
            del currents[key]

        try:
            for form_field in form:
                if form_field in excluded_fields:
                    continue

                if form_field in defaults:
                    # CREATE, UPDATE or DELETE
                    if form_field not in currents:
                        # CREATE or DELETE
                        if form[form_field] != defaults[form_field]:
                            # CREATE
                            create(form_field, form[form_field])
                    else:
                        # UPDATE or DELETE
                        if currents[form_field] != form[form_field]:
                            # UPDATE or DELETE
                            # print('currents[form_field]: %s, defaults[form_field]: %s' % (
                            #     currents[form_field], defaults[form_field]))
                            if form[form_field] != defaults[form_field]:
                                # UPDATE
                                update(form_field, form[form_field])
                            else:
                                # DELETE
                                delete(form_field)
                        else:
                            # do nothing, just skip
                            pass

                else:
                    if form_field in currents:
                        # DELETE
                        delete(form_field)
        except Exception as e:
            traceback.print_exc()
            return False

        self.settings = json.dumps(currents, ensure_ascii=False)
        self.save()
        return True


    def set_option(self, key, value):
        try:
            currents = json.loads(self.settings)  # текущие настройки виджета
            currents[key] = value
            self.settings = json.dumps(currents, ensure_ascii=False)
            self.save()
        except Exception as e:
            traceback.print_exc()
            return False
        return True



    def read_settings(self, form, excluded_fields=None, to_str=False):
        """
        По аналогии с методом 'update_settings', извлекает из поля
        'settings' виджета только те настройки, которые содержатся в
        форме 'form', исключая поля формы, переданные в 'excluded_fields'
        """
        if not excluded_fields:
            excluded_fields = []

        currents = json.loads(self.settings)
        defaults = widget_settings.DEFAULT_SETTINGS

        result = {}

        try:
            for form_field in form:
                if form_field in excluded_fields:
                    continue

                if form_field not in defaults:
                    continue

                result[form_field] = currents.get(form_field, defaults[form_field])
        except Exception as e:
            traceback.print_exc()

        return result if not to_str else json.dumps(result, ensure_ascii=False)
    

    def save(self, *args, **kwargs):
        self.validate()  # проверяем, мб стоит установить виджету флаг 'is_raw'(читай о смысле этого флага выше
                         #  в этом классе
        super(Widget, self).save(*args, **kwargs)

    def __str__(self):
        return 'Widget(%s)' % self.site_url

    def __unicode__(self):
        return u'Widget(%s)' % self.site_url


class CallbackInfo(models.Model):
    """
    CallbackInfo; CALLBACK_STATUS_PLANNED status is set by default
    """
    widget = models.ForeignKey(Widget, related_name='callbacks')
    call_description = models.CharField(max_length=255, default='')
    phone_number_side_a = models.CharField('Номер телефона оператора', max_length=12, default='')
    phone_number_side_b = models.CharField('Номер телефона клиента', max_length=12, default='')
    charged_length_a_sec = models.IntegerField('Списанная длина разговора на стороне оператора', default=0)
    charged_length_b_sec = models.IntegerField('Списанная длина разговора на стороне клиента', default=0)
    real_length_a_sec = models.IntegerField('Реальная длина разговора на стороне оператора', default=0)
    real_length_b_sec = models.IntegerField('Реальная длина разговора на стороне клиента', default=0)
    record_url_a = models.CharField('Ссылка на запись разговора оператора', max_length=255, default='')
    record_url_b = models.CharField('Ссылка на запись разговора клиента', max_length=255, default='')
    waiting_period_a_sec = models.IntegerField('Период ожидания со стороны оператора', default=0)
    waiting_period_b_sec = models.IntegerField('Период ожидания со стороны клиента', default=0)
    callback_status = models.CharField('Статус звонка', max_length=20, choices=CALLBACK_STATUSES, default=CALLBACK_STATUS_PLANNED)
    cost = models.DecimalField('Стоимость', decimal_places=2, max_digits=12, default=Decimal())
    currency = models.CharField('Валюта', max_length=3, default='')
    ip_side_b = models.IPAddressField('IP-адрес клиента', default='')
    geodata_side_b = models.CharField('Геодата клиента', max_length=100, default='')  # страна, город откуда пользователь
    mtt_callback_call_id = models.CharField(max_length=50, default='')
    referer = models.CharField('Источник перехода', max_length=255, default='')  # ссылка - откуда пришёл пользователь на сайт
    search_request = models.CharField('Поисковый запрос', max_length=100, default='')  # текст поискового запроса, по которому пришёл пользователь
    when = models.DateTimeField('Когда', blank=True, null=True)  # когда был совершён звонок
    # (или заказан - если звонок запланирован)
    planned_for_datetime = models.DateTimeField(blank=True, null=True)  # на когда запланирован
    tracking_history = models.CharField('История звонка', max_length=100, default='')  # последовательность звонка(кто за кем поднял трубку и тд)

    def update_tracking(self, event):
        """
        Для отслеживания последовательности действий оператора и клиента во время звонка,
        мы храним информацию о всех событиях в поле 'tracking_history' в виде строки.
        Т.е. при последовательности: 1) оператор поднял трубку, 2) клиент поднял трубку, 3) оператор положил
        трубку, 4) клиент положил трубку в поле 'tracking_history' будет храниться последовательность '1234',
        если мы условимся обозначать соответствующие события такими цифрами. Реальные обозначения упомянутых
        событий лежат в константах TRACKING_EVENT_START_SIDE_A, .. и т. д.
        В итоге, мы понимаем на какой стадии находится звонок, и можем это использовать.
        Этот метод добавляет 'TRACKING_EVENT_*' в историю событий звонка.
        :param event: TRACKING_EVENT_*
        :return: True if success, False otherwise
        """
        print 'update_tracking', event, self.tracking_history

        if event in self.tracking_history:
            return False

        self.tracking_history += ("e: %s; " % event)
        self.save()
        return True

    def is_lasting(self):
        """
        Use this method to check if the callback successfully started(and an operator has picked up the phone)
        """
        return TRACKING_EVENT_START_SIDE_A in self.tracking_history and \
               TRACKING_EVENT_END_SIDE_A not in self.tracking_history and \
               TRACKING_EVENT_END_SIDE_B not in self.tracking_history

    def is_finished(self):
        """
        Use this method to check if the callback was successfully finished(operator or a client has dropped the line)
        """
        return TRACKING_EVENT_START_SIDE_A in self.tracking_history and \
               TRACKING_EVENT_START_SIDE_B in self.tracking_history and \
               (TRACKING_EVENT_END_SIDE_A in self.tracking_history or
                TRACKING_EVENT_END_SIDE_B in self.tracking_history)

    def __str__(self):
        return 'CallbackInfo(from %s to %s, cost: %s)' % \
               (self.phone_number_side_a, self.phone_number_side_b, self.cost)

    def __unicode__(self):
        return u'CallbackInfo(from %s to %s, cost: %s)' % \
               (self.phone_number_side_a, self.phone_number_side_b, self.cost)


class PendingCallback(models.Model):
    """
    Описывает звонок, по которому мы пока не имеем никакой информации
    (т.е. для него не создан объект CallbackInfo)
    """
    widget = models.ForeignKey(Widget)
    phone_number_side_b = models.CharField(max_length=12, default='')
    mtt_callback_call_id = models.CharField(max_length=50)
    ip_side_b = models.IPAddressField()
    geodata_side_b = models.CharField(max_length=100, default='-')
    referer = models.CharField(max_length=255)
    search_request = models.CharField(max_length=100)
    when = models.DateTimeField(blank=True, null=True)
    tracking_history = models.CharField(max_length=200, default='') 
    callback_status = models.CharField(max_length=20, choices=CALLBACK_STATUSES, default=CALLBACK_STATUS_PLANNED)
    planned_for_datetime = models.DateTimeField(blank=True, null=True)

    def __repr__(self):
        return "PendingCallback-%d(%s)" % (self.id, self.mtt_callback_call_id)

    def status_check(self, status_str):
        return str(self.tracking_history).count(status_str) > 0

    def is_lasting(self):
        """
        Use this method to check if the callback successfully started(and an operator has picked up the phone)
        """
        return TRACKING_EVENT_START_SIDE_A in self.tracking_history and \
               TRACKING_EVENT_END_SIDE_A not in self.tracking_history and \
               TRACKING_EVENT_END_SIDE_B not in self.tracking_history

    def is_finished(self):
        """
        Use this method to check if the callback was successfully finished(operator or a client has dropped the line)
        """
        return TRACKING_EVENT_START_SIDE_A in self.tracking_history and \
               TRACKING_EVENT_START_SIDE_B in self.tracking_history and \
               (TRACKING_EVENT_END_SIDE_A in self.tracking_history or
                TRACKING_EVENT_END_SIDE_B in self.tracking_history)


class Schedule(models.Model):
    timezone = models.IntegerField(default=widget_settings.DEFAULT_TIMEZONE, choices=widget_settings.TIMEZONE_CHOICES)
    # day schedule has the following format: '10:00-20:00'
    monday = models.CharField('Понедельник', max_length=11, default=widget_settings.DEFAULT_WEEKDAY_SCHEDULE)
    tuesday = models.CharField('Вторник', max_length=11, default=widget_settings.DEFAULT_WEEKDAY_SCHEDULE)
    wednesday = models.CharField('Среда', max_length=11, default=widget_settings.DEFAULT_WEEKDAY_SCHEDULE)
    thursday = models.CharField('Четверг', max_length=11, default=widget_settings.DEFAULT_WEEKDAY_SCHEDULE)
    friday = models.CharField('Пятница', max_length=11, default=widget_settings.DEFAULT_WEEKDAY_SCHEDULE)
    saturday = models.CharField('Суббота', max_length=11, default=widget_settings.DEFAULT_WEEKEND_SCHEDULE)
    sunday = models.CharField('Воскресенье', max_length=11, default=widget_settings.DEFAULT_WEEKEND_SCHEDULE)

    def __str__(self):
        return 'Schedule(timezone: %d)' % self.timezone

    def __unicode__(self):
        return u'Schedule(timezone: %d)' % self.timezone

    def asList(self):
        return [self.timezone,
                self.monday,
                self.tuesday,
                self.wednesday,
                self.thursday,
                self.friday,
                self.saturday,
                self.sunday]


class Bill(models.Model):
    BILL_STATUS_PAID = 'paid'
    BILL_STATUS_UNPAID = 'unpaid'
    #
    BILL_STATUSES = [(BILL_STATUS_PAID, 'Оплачен'),
                     (BILL_STATUS_UNPAID, 'Не оплачен')]
    #
    PAYMENT_METHOD_CASHLESS = 'cashless'
    PAYMENT_METHOD_ELECTRON = 'electron'
    #
    PAYMENT_METHODS = [(PAYMENT_METHOD_CASHLESS, 'Безналичный'),
                       (PAYMENT_METHOD_ELECTRON, 'Электронный')]
    #
    client = models.ForeignKey(Client, blank=True, null=True)
    when = models.DateTimeField('Когда', )
    minutes = models.IntegerField('Минуты', )
    price_per_minute = models.DecimalField('Цена за минуту', max_digits=12, decimal_places=2)
    sum = models.DecimalField('В сумме', max_digits=12, decimal_places=2)
    payment_method = models.CharField('Способ оплаты', choices=PAYMENT_METHODS, default=PAYMENT_METHOD_ELECTRON,
                                      max_length=10)
    status = models.CharField('Статус платежа', choices=BILL_STATUSES, default=BILL_STATUS_UNPAID,
                              max_length=10)

    def __str__(self):
        return 'Bill(%s)' % self.id

    def __unicode__(self):
        return u'Bill(%s)' % self.id

# LEGACY CODE; при удалении этого кода нужно так же удалять соответствующие формы, а так же делать миграцию БД

# Client management
#
class SetupRequest(models.Model):
    # SETUP_REQUEST_STATUS_NO_RESPONSE = 'no_response'
    # SETUP_REQUEST_STATUS_WAITING_FOR_WIDGET = 'waiting_for_widget'
    # SETUP_REQUEST_STATUS_COMPLETE = 'complete'
    # SETUP_REQUEST_STATUSES = (
    #     (SETUP_REQUEST_STATUS_NO_RESPONSE, u'Нет ответа'),
    #     (SETUP_REQUEST_STATUS_WAITING_FOR_WIDGET, u'Ожидает установки виджета'),
    #     (SETUP_REQUEST_STATUS_COMPLETE, u'Виджет установлен'),
    # )
    organization_name = models.CharField(max_length=50)
    site = models.CharField(max_length=50)

    head_fio = models.CharField(max_length=60, blank=True, null=True)
    head_position = models.CharField(max_length=20, blank=True, null=True)
    head_phone_number = models.CharField(max_length=50, blank=True, null=True)
    head_email = models.CharField(max_length=30, blank=True, null=True)

    tech_fio = models.CharField(max_length=30, blank=True, null=True)
    tech_phone_number = models.CharField(max_length=50, blank=True, null=True)
    tech_email = models.CharField(max_length=30, blank=True, null=True)
    advanced_info = models.CharField(max_length=500, blank=True, null=True)

    # status = models.CharField(max_length=50, choices=SETUP_REQUEST_STATUSES,
    #                           default=SETUP_REQUEST_STATUS_NO_RESPONSE)

    def __str__(self):
        return '%s %s' % (self.organization_name, self.site)

    def __unicode__(self):
        return u'%s %s' % (self.organization_name, self.site)


class SetupRequestHistory(models.Model):
    setup_request = models.ForeignKey(SetupRequest, blank=True, null=True)
    when = models.DateTimeField(default=datetime.datetime.now)
    text = models.CharField(max_length=250)

    def __str__(self):
        return '[%s] %s' % (self.when.strftime("%d.%m.%Y; %H:%M"), self.text)

    def __unicode__(self):
        return u'[%s] %s' % (self.when.strftime("%d.%m.%Y; %H:%M"), self.txt)

# ---------------------------------------------------------------------------------

class Task(models.Model):
    id = models.IntegerField(primary_key=True)
    script = models.TextField()
    executed = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
