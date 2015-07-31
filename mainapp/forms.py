# coding=utf-8
__author__ = 'max'

import json
from django import forms
from django.contrib.auth import authenticate
from django.forms import ModelForm
from robokassa.forms import RobokassaForm
from django.utils.translation import ugettext as _
from mainapp import widget_settings
from mainapp.models import Reseller, Operator, Tariff, Widget, Schedule, Client, SetupRequest, SetupRequestHistory, \
    Bill, \
    ResetPasswordStorage

# LEGACY CODE; из предыдущих версий, сейчас не используется; чтобы избавиться полностью - нужно
# удалить соответствующие модели и данные из БД

class AddResellerForm(ModelForm):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput())
    tariff = forms.ModelChoiceField(queryset=Tariff.objects.all())

    class Meta:
        model = Reseller
        fields = ['name']
        # fields to be set manually: administrative_manager, user(need to be created)


class EditClientForm(ModelForm):
    def clean_password(self):
        if self.cleaned_data['password'] == '' and self.cleaned_data['client_id'] == '':
            raise forms.ValidationError('Password cant be empty')

        return self.cleaned_data['password']

    client_id = forms.IntegerField(widget=forms.HiddenInput(), required=False)
    password = forms.CharField(widget=forms.PasswordInput(), required=False)

    class Meta:
        model = Client
        fields = ['name', 'email', 'phone_number']
        # fields to be set manually: user(need to create), reseller


class EditScheduleForm(ModelForm):
    class Meta:
        model = Schedule
        fields = ['timezone', 'monday', 'tuesday', 'wednesday', 'thursday',
                  'friday', 'saturday', 'sunday']
        # fields to be set manually: widget


class EditWidgetOperatorForm(ModelForm):
    widget_token = forms.CharField(widget=forms.HiddenInput())
    operator_id = forms.CharField(widget=forms.HiddenInput(), required=False)

    class Meta:
        model = Operator
        fields = ['name', 'phone_number', 'photo_url']


class AddTariffForm(ModelForm):
    class Meta:
        model = Tariff
        fields = ['name', 'description', 'price_per_minute', 'minutes']


class EditSetupRequestForm(ModelForm):
    setup_request_id = forms.CharField(widget=forms.HiddenInput(), required=False)

    class Meta:
        model = SetupRequest
        fields = ['organization_name', 'site',
                  'head_fio', 'head_position', 'head_phone_number', 'head_email',
                  'tech_fio', 'tech_phone_number', 'tech_email',
                  'advanced_info']
        widgets = {'advanced_info': forms.Textarea()}


class EditSetupRequestHistoryForm(ModelForm):
    class Meta:
        model = SetupRequestHistory
        fields = ['when', 'text']


# ------------------------------------------------------------------------------
# Дальше идёт продакшен
# ******************************************************************************

# ## Accounts related staff


class LoginForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={'placeholder': 'Ваш Email'}))
    password = forms.CharField(label='Пароль', widget=forms.PasswordInput(attrs={'placeholder': 'Ваш Пароль'}))

    def clean(self):
        email = self.cleaned_data.get('email')
        password = self.cleaned_data.get('password')
        user = authenticate(username=email, password=password)

        if not user or not user.is_active:
            self.has_errors = True
            raise forms.ValidationError('Неверное имя пользователя и/или пароль')

        self.has_errors = False

        return self.cleaned_data

    def login(self):
        email = self.cleaned_data.get('email')
        password = self.cleaned_data.get('password')
        user = authenticate(username=email, password=password)
        return user


class PasswordResetForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={'placeholder': 'Ваш Email'}))


class PasswordResetConfirmationForm(forms.Form):
    new_password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Введите новый пароль'}))
    new_password_confirmation = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Подтверждение пароля'}))
    reset_password_storage_id = forms.CharField(max_length=ResetPasswordStorage.RESET_PASSWORD_CODE_LENGTH,
                                                widget=forms.HiddenInput())

    def clean(self):
        new_password = self.cleaned_data.get('new_password')
        new_password_confirmation = self.cleaned_data.get('new_password_confirmation')
        reset_password_storage_id = self.cleaned_data.get('reset_password_storage_id')

        if new_password is None or new_password_confirmation is None or new_password != new_password_confirmation \
                or reset_password_storage_id is None:
            self.has_errors = True
            raise forms.ValidationError('Введённые пароли должны совпадать')

        self.has_errors = False

        return self.cleaned_data


class ClientRegisterForm(ModelForm):
    password = forms.CharField(label='Пароль', widget=forms.PasswordInput(attrs={'placeholder': 'Придумайте пароль'}))

    class Meta:
        model = Client
        fields = ['name', 'email', 'phone_number']

        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'Ваше Имя'}),
            'email': forms.EmailInput(attrs={'placeholder': 'Ваш Email'}),
            # CSS-класс 'phone-number' используется для того, чтобы делать по нему
            #  автоподстановку маски для ввода номера(+7) при получением полем
            #  фокуса; js-код в base.html
            'phone_number': forms.TextInput(
                attrs={'placeholder': 'Ваш телефон', 'minlength': 12, 'class': 'phone-number'}),
        }

# ## Client related staff


class ClientCallbacksFilterForm(forms.Form):
    DATE_CHOICES_TODAY = 'date_today'
    DATE_CHOICES_YESTERDAY = 'date_yesterday'
    DATE_CHOICES_WEEK = 'date_week'
    DATE_CHOICES_MONTH = 'date_month'
    #
    DATE_CHOICES = [(DATE_CHOICES_TODAY, 'Сегодня'),
                    (DATE_CHOICES_YESTERDAY, 'Вчера'),
                    (DATE_CHOICES_WEEK, 'Неделя'),
                    (DATE_CHOICES_MONTH, 'Месяц')]
    date_choices = forms.ChoiceField(choices=DATE_CHOICES, widget=forms.RadioSelect(),
                                     initial=DATE_CHOICES_TODAY)
    ##
    SITE_CHOICES_ALL = 'all'
    SITE_CHOICES = [(SITE_CHOICES_ALL, 'Все')]
    ##
    from_date = forms.DateField(input_formats=['%d.%m.%Y'])
    to_date = forms.DateField(input_formats=['%d.%m.%Y'])
    planned = forms.BooleanField(label='Запланированные', required=False)
    site_choices = forms.ChoiceField()

    def __init__(self, sites, *args, **kwargs):
        super(ClientCallbacksFilterForm, self).__init__(*args, **kwargs)
        self.fields['site_choices'].choices = self.SITE_CHOICES + sites


class ClientWidgetForm(forms.Form):
    """
    От этой формы наследуются любые другие формы, в которых идёт работа с виджетом.
    В шаблоне страницы должно присутствовать объявление поля widget_id.
    """
    widget_id = forms.IntegerField(widget=forms.HiddenInput())


class ClientWidgetSettingsField(forms.Form):
    """
    От этой формы наследуются любые другие формы, имеющие дело с настройками виджета.
    Форма умеет:
    * автоматически получать из переданного в конструктор виджета настройки для нужных полей
      (поля формы должны именоваться так же, как именуются настройки виджета)
    * исключать из обработки поля формы, которые не должны быть добавлены в настройки(для этого
      в конструкторе формы-наследника нужно добавить имя исключаемого поля в список excluded_fields)
    """
    excluded_fields = ['settings']

    # def __init__(self, settings='', *args, **kwargs):
    def __init__(self, widget=None, *args, **kwargs):
        super(ClientWidgetSettingsField, self).__init__(*args, **kwargs)

        # if isinstance(settings, str) or isinstance(settings, NoneType) or isinstance(settings, unicode):
        if widget is not None:
            # self.fields['settings'].initial = settings if settings not in ('', None) \
            #     else widget_settings.DEFAULT_SETTINGS_JSON
            settings = widget.read_settings(self.fields, self.excluded_fields)

            for option in settings:
                self.fields[option].initial = settings[option]

            self.fields['settings'].initial = json.dumps(settings, ensure_ascii=False)

    settings = forms.CharField(max_length=Widget.SETTINGS_FIELD_MAX_LENGTH, widget=forms.HiddenInput())


class ClientWidgetOptionsForm(ClientWidgetForm):
    TIME_CHOICES_FROM = [(x, x) for x in widget_settings.SCHEDULE_TIME_CHOICES_FROM]
    TIME_CHOICES_TO = [(x, x) for x in widget_settings.SCHEDULE_TIME_CHOICES_TO]
    #
    site_url = forms.URLField()
    timezone = forms.ChoiceField(initial=3, choices=widget_settings.TIMEZONE_CHOICES)
    weekdays_have_same_schedule = forms.BooleanField(required=False)
    #
    monday_flag = forms.BooleanField(required=False, label='Понедельник')
    monday_from = forms.ChoiceField(choices=TIME_CHOICES_FROM)
    monday_to = forms.ChoiceField(choices=TIME_CHOICES_TO)
    #
    tuesday_flag = forms.BooleanField(required=False, label='Вторник')
    tuesday_from = forms.ChoiceField(choices=TIME_CHOICES_FROM)
    tuesday_to = forms.ChoiceField(choices=TIME_CHOICES_TO)
    #
    wednesday_flag = forms.BooleanField(required=False, label='Среда')
    wednesday_from = forms.ChoiceField(choices=TIME_CHOICES_FROM)
    wednesday_to = forms.ChoiceField(choices=TIME_CHOICES_TO)
    #
    thursday_flag = forms.BooleanField(required=False, label='Четверг')
    thursday_from = forms.ChoiceField(choices=TIME_CHOICES_FROM)
    thursday_to = forms.ChoiceField(choices=TIME_CHOICES_TO)
    #
    friday_flag = forms.BooleanField(required=False, label='Пятница')
    friday_from = forms.ChoiceField(choices=TIME_CHOICES_FROM)
    friday_to = forms.ChoiceField(choices=TIME_CHOICES_TO)
    #
    saturday_flag = forms.BooleanField(required=False, label='Суббота')
    saturday_from = forms.ChoiceField(choices=TIME_CHOICES_FROM)
    saturday_to = forms.ChoiceField(choices=TIME_CHOICES_TO)
    #
    sunday_flag = forms.BooleanField(required=False, label='Воскресенье')
    sunday_from = forms.ChoiceField(choices=TIME_CHOICES_FROM)
    sunday_to = forms.ChoiceField(choices=TIME_CHOICES_TO)
    #
    is_operator_shown_in_widget = forms.BooleanField(label='Показывать в виджете информацию об операторе',
                                                     required=False, initial=True)
    #
    operator_by_default_choices = forms.ChoiceField(widget=forms.RadioSelect())
    related_operators = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple())
    operators = []

    @staticmethod
    def build_operators_choices_list(client):
        operators = client.operator_set.all().order_by('id')[:]
        operators_choices_lst = []  # ('0', '-')

        for an_operator in operators:
            operators_choices_lst.append((an_operator.id, ''))

        return operators_choices_lst

    def __init__(self, client, widget, *args, **kwargs):
        super(ClientWidgetOptionsForm, self).__init__(*args, **kwargs)

        if widget is None:
            return

        operators = client.operator_set.all().order_by('id')[:]
        self.operators = operators

        widget_related_operators = widget.related_operators.all()[
                                   :] if widget.related_operators.count() > 0 else operators
        self.fields['operator_by_default_choices'].choices = self.build_operators_choices_list(client)
        if widget.default_operator is not None:
            self.fields['operator_by_default_choices'].initial = widget.default_operator.id
        self.fields['related_operators'].choices = self.build_operators_choices_list(client)
        self.fields['related_operators'].initial = [operator.id for operator in self.operators if
                                                    operator in widget_related_operators]


class ClientWidgetDesignForm(ClientWidgetForm, ClientWidgetSettingsField):
    INDENT_UNITS_PX = 'px'
    INDENT_UNITS_PERCENT = 'percent'
    INDENT_UNITS_CHOICES = [(INDENT_UNITS_PX, 'px'),
                            (INDENT_UNITS_PERCENT, '%'), ]
    #
    TEXT_COLOR_SCHEME_LIGHT = '#FFFFFF'
    TEXT_COLOR_SCHEME_DARK = '#000000'
    TEXT_COLOR_SCHEME_CHOICES = [(TEXT_COLOR_SCHEME_LIGHT, 'Светлый'),
                                 (TEXT_COLOR_SCHEME_DARK, 'Тёмный'), ]
    #
    FONT_ARIAL = 'arial'
    FONT_CHOICES = [(FONT_ARIAL, 'Arial'), ]
    #
    param_widget_position = forms.ChoiceField(choices=widget_settings.WIDGET_POSITION_CHOICES,
                                              initial=widget_settings.WIDGET_POSITION_RIGHT,
                                              label='Позиция виджета')
    param_root_position_left = forms.CharField(initial=widget_settings.DEFAULT_SETTINGS['param_root_position_left'],
                                               label='Отступ слева')
    param_root_position_right = forms.CharField(initial=widget_settings.DEFAULT_SETTINGS['param_root_position_right'],
                                                label='Отступ справа')
    param_root_position_bottom = forms.CharField(initial=widget_settings.DEFAULT_SETTINGS['param_root_position_bottom'],
                                                 label='Отступ снизу')
    param_content_border_radius = forms.IntegerField(max_value=40, min_value=0,
                                                     initial=widget_settings.DEFAULT_SETTINGS['param_content_border_radius'],
                                                     label='Радиус закругления краев виджета')
    param_main_button_border_radius = forms.IntegerField(max_value=40, min_value=0,
                                                         initial=widget_settings.DEFAULT_SETTINGS['param_main_button_border_radius'],
                                                         label='Радиус закругления плавающей кнопки')
    #
    flag_button_visible = forms.BooleanField(required=False, initial=widget_settings.DEFAULT_SETTINGS['flag_button_visible'],
                                                   label='Отображать плавающую кнопку для вызова виджета')
    flag_button_text_animated = forms.BooleanField(initial=False, required=False,
                                                   label='Текст на кнопке анимирован')
    color_background_global = forms.CharField(max_length=7,
                                              initial=widget_settings.DEFAULT_SETTINGS['color_background_global'],
                                              label='Цвет виджета')
    color_font_global = forms.ChoiceField(initial=TEXT_COLOR_SCHEME_LIGHT,
                                          label='Цвет шрифта', choices=TEXT_COLOR_SCHEME_CHOICES)
    color_font_link = forms.CharField(max_length=7, initial=widget_settings.DEFAULT_SETTINGS['color_font_link'],
                                      label='Цвет ссылок')
    color_font_scondary_global = forms.CharField(max_length=7,
                                                 initial=widget_settings.DEFAULT_SETTINGS['color_font_scondary_global'],
                                                 label='Дополнительный цвет шрифта')
    color_opacity_global = forms.IntegerField(max_value=100, min_value=10,
                                              initial=widget_settings.DEFAULT_SETTINGS['color_opacity_global'],
                                              label='Непрозрачность виджета')
    color_opacity_main_button = forms.IntegerField(max_value=100, min_value=10,
                                                   initial=widget_settings.DEFAULT_SETTINGS['color_opacity_main_button'],
                                                   label='Непрозрачность кнопки')
    color_opacity_call_panel = forms.IntegerField(max_value=100, min_value=10,
                                                  initial=widget_settings.DEFAULT_SETTINGS['color_opacity_call_panel'],
                                                  label='Непрозрачность панели дозвона')
    color_opacity_inputs = forms.IntegerField(max_value=100, min_value=10,
                                              initial=widget_settings.DEFAULT_SETTINGS['color_opacity_inputs'],
                                              label='Непрозрачность полей ввода')
    color_background_image_global = forms.CharField(label='Фоновое изображение', max_length=255, required=False)
    # text_color_scheme = forms.ChoiceField(choices=TEXT_COLOR_SCHEME_CHOICES,
    # initial=TEXT_COLOR_SCHEME_LIGHT)
    font = forms.ChoiceField(choices=FONT_CHOICES, initial=FONT_ARIAL,
                             label='Шрифт')
    background_image_global = forms.ImageField(label='Фоновое изображение', required=False)

    def clean(self):
        cleaned_data = super(ClientWidgetDesignForm, self).clean()

        # Перевод из дробного формата(например, 0.9) в проценты(90%)

        cleaned_data['color_opacity_global'] = float(cleaned_data['color_opacity_global']) / 100.0
        cleaned_data['color_opacity_main_button'] = float(cleaned_data['color_opacity_main_button']) / 100.0
        cleaned_data['color_opacity_call_panel'] = float(cleaned_data['color_opacity_call_panel']) / 100.0
        cleaned_data['color_opacity_inputs'] = float(cleaned_data['color_opacity_inputs']) / 100.0

        return cleaned_data

    def __init__(self, *args, **kwargs):
        self.excluded_fields.append('font')
        self.excluded_fields.append('background_image_global')

        super(ClientWidgetDesignForm, self).__init__(*args, **kwargs)

        # Перерод из процентов в дробный формат

        def calc_new_value(old_val):
            return int(float(old_val) * 100.0)

        self.fields['color_opacity_global'].initial = calc_new_value(self.fields['color_opacity_global'].initial)
        self.fields['color_opacity_main_button'].initial = calc_new_value(
            self.fields['color_opacity_main_button'].initial)
        self.fields['color_opacity_call_panel'].initial = calc_new_value(
            self.fields['color_opacity_call_panel'].initial)
        self.fields['color_opacity_inputs'].initial = calc_new_value(self.fields['color_opacity_inputs'].initial)


class ClientWidgetNotificationsForm(ClientWidgetForm):
    # CSS-класс 'phone-number' используется для того, чтобы делать по нему
    #  автоподстановку маски для ввода номера(+7) при получением полем
    #  фокуса; js-код в base.html
    sms_notification_number = forms.CharField(max_length=20, required=False,
                                              label='Номер телефона для SMS-уведомлений',
                                              widget=forms.TextInput(attrs={'class': 'phone-number'}))
    callback_notifications_email = forms.EmailField(required=False,
                                                    label='Email для уведомлений о звонках')
    out_of_balance_notifications_email = forms.EmailField(required=False,
                                                          label='Email для уведомлений при нулевом балансе')
    offline_message_notifications_email = forms.EmailField(required=False,
                                                           label='Email для оффлайн сообщений')


class ClientWidgetContactsFormForm(ClientWidgetForm, ClientWidgetSettingsField):
    flag_name_field = forms.BooleanField(required=False)
    flag_name_field_obligatory = forms.BooleanField(required=False)
    flag_email_field = forms.BooleanField(required=False)
    flag_email_field_obligatory = forms.BooleanField(required=False)
    flag_phone_field = forms.BooleanField(required=False)
    flag_phone_field_obligatory = forms.BooleanField(required=False)


class ClientWidgetContentForm(ClientWidgetForm, ClientWidgetSettingsField):
    text_button = forms.CharField(max_length=120, initial=widget_settings.DEFAULT_SETTINGS['text_button'],
                                  label='Текст кнопки')
    text_main = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_main'],
                                label='Текст при заказе немедленного обратного звонка', widget=forms.Textarea(attrs={'rows': '4'}))
    text_dial_ready = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_dial_ready'],
                                      label='Текст в режиме подготовки соединения', widget=forms.Textarea(attrs={'rows': '4'}))
    text_dial_start = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_dial_start'],
                                      label='Текст при установке соединения', widget=forms.Textarea(attrs={'rows': '4'}))
    text_dial_calling = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_dial_calling'],
                                        label='Текст во время звонка', widget=forms.Textarea(attrs={'rows': '4'}))
    text_dial_success = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_dial_success'],
                                        label='Текст при успешном дозвоне', widget=forms.Textarea(attrs={'rows': '4'}))
    text_dial_late = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_dial_late'],
                                     label='Текст при запоздавшем звонке', widget=forms.Textarea(attrs={'rows': '4'}))
    text_dial_failed = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_dial_failed'],
                                       label='Текст при неуспешном дозвоне', widget=forms.Textarea(attrs={'rows': '4'}))
    text_dial_finished = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_dial_finished'],
                                         label='Текст по окончанию звонка', widget=forms.Textarea(attrs={'rows': '4'}))
    text_order_start = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_order_start'],
                                       label='Текст при заказе обратного звонка', widget=forms.Textarea(attrs={'rows': '4'}))
    text_order_done = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_order_done'],
                                      label='Текст при успешном оформлении заказа звонка', widget=forms.Textarea(attrs={'rows': '4'}))
    text_order_failed = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_order_failed'],
                                        label='Текст при неуспешном заказе звонка', widget=forms.Textarea(attrs={'rows': '4'}))
    text_message_start = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_message_start'],
                                         label='Текст при отправке сообщения', widget=forms.Textarea(attrs={'rows': '4'}))
    text_message_sent = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_message_sent'],
                                        label='Текст при успешно завершённой отправке', widget=forms.Textarea(attrs={'rows': '4'}))
    text_message_failed = forms.CharField(max_length=300,
                                          initial=widget_settings.DEFAULT_SETTINGS['text_message_failed'],
                                          label='Текст при ошибке отправки сообщения', widget=forms.Textarea(attrs={'rows': '4'}))
    text_send_message_done = forms.CharField(max_length=300,
                                             initial=widget_settings.DEFAULT_SETTINGS['text_send_message_done'],
                                             label='Текст при успешной отправке сообщения', widget=forms.Textarea(attrs={'rows': '4'}))
    text_timeoff_start = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_timeoff_start'],
                                         label='Текст при заказе звонка в нерабочее время', widget=forms.Textarea(attrs={'rows': '4'}))
    text_timeoff_done = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_timeoff_done'],
                                        label='Текст при успешном принятии заказа на звонок в нерабочее время',
                                        widget=forms.Textarea(attrs={'rows': '4'}))
    text_free_start = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_free_start'],
                                      label='Текст в бесплатной версии', widget=forms.Textarea(attrs={'rows': '4'}))
    text_free_done = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_free_done'],
                                     label='Текст в бесплатной версии, заказ принят', widget=forms.Textarea(attrs={'rows': '4'}))
    text_link_order = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_link_order'],
                                      label='Текст ссылки заказа')
    text_link_send_message = forms.CharField(max_length=300,
                                             initial=widget_settings.DEFAULT_SETTINGS['text_link_send_message'],
                                             label='Текст ссылки отправки сообщения')
    text_link_go_back = forms.CharField(max_length=300, initial=widget_settings.DEFAULT_SETTINGS['text_link_go_back'],
                                        label='Текст ссылки, шаг назад')
    text_link_message_go_back = forms.CharField(max_length=300,
                                                initial=widget_settings.DEFAULT_SETTINGS['text_link_message_go_back'],
                                                label='Текст ссылки, шаг назад из сценария отправки сообщений')


class ClientWidgetParametersForm(ClientWidgetForm):
    INCOMING_NUMBER_CALLFEED = 'callfeed'
    INCOMING_NUMBER_CLIENT = 'client'
    INCOMING_NUMBER_CHOICES = [(INCOMING_NUMBER_CALLFEED, _('Callfeed')),
                               (INCOMING_NUMBER_CLIENT, 'Клиент')]
    #
    GEO_FILTER_ALL = 'all'
    GEO_FILTER_CHOICES = [(GEO_FILTER_ALL, 'Все'), ]
    #
    popup_time_sec = forms.IntegerField(max_value=9999, min_value=0, initial=7,
                                                  label='Время автоматического показа виджета')
    time_before_callback_sec = forms.IntegerField(max_value=60, min_value=8, initial=15,
                                                  label='Время до звонка в секундах')
    # delay_before_callback_from_a_to_b = forms.IntegerField(max_value=60, min_value=0, initial=0,
    #                                                       label='Задержка между дозвоном от оператора клиенту')
    # delay_before_callback_to_additional_number = forms.IntegerField(max_value=60, min_value=0, initial=0,
    #                                                                label='Задержка перед набором добавочного номера')
    operator_incoming_number = forms.ChoiceField(choices=INCOMING_NUMBER_CHOICES,
                                                 initial=INCOMING_NUMBER_CALLFEED,
                                                 label='Отображаемый входящий номер на стороне оператора')
    callback_type = forms.ChoiceField(choices=Widget.CALLBACK_TYPES, initial=Widget.CALLBACK_TYPE_RING_ALL,
                                      label='Порядок дозвона')
    speak_site_name = forms.BooleanField(required=False,
                                         label='Проговаривать имя сайта')
    geo_filter = forms.ChoiceField(choices=GEO_FILTER_CHOICES, initial=GEO_FILTER_ALL,
                                   label='Геофильтр')
    disable_on_mobiles = forms.BooleanField(required=False,
                                            label='Отключить на мобильных телефонах')
    blacklist_phones = forms.CharField(max_length=3000, widget=forms.Textarea(attrs={'rows': '4'}), required=False,
                                       label='Чёрный список номеров телефонов')
    blacklist_ip = forms.CharField(max_length=3000, widget=forms.Textarea(attrs={'rows': '4'}), required=False,
                                   label='Чёрный список IP-адресов')


class ClientInfoPersonalForm(forms.ModelForm):
    class Meta:
        model = Client
        fields = ['name', 'email', 'phone_number', 'receive_email_notifications_flag',
                  'receive_sms_notifications_flag']
        # CSS-класс 'phone-number' используется для того, чтобы делать по нему
        #  автоподстановку маски для ввода номера(+7) при получением полем
        #  фокуса; js-код в base.html
        widgets = {'phone_number': forms.TextInput(attrs={'class': 'phone-number'})}


class ClientInfoSecurityForm(forms.Form):
    old_password = forms.CharField(widget=forms.PasswordInput(),
                                   label='Старый пароль')  # , min_length=6)
    new_password = forms.CharField(widget=forms.PasswordInput(),
                                   label='Новый пароль')  # , min_length=6)
    new_password_confirmation = forms.CharField(widget=forms.PasswordInput(),
                                                label='Подтверждение нового пароля')  # , min_length=6)


class ClientPaymentChooseTariffForm(forms.Form):
    minutes = 0
    price_per_minute = 0

    tariff_id = forms.IntegerField(widget=forms.HiddenInput())

    def __init__(self, minutes=0, price_per_minute=0, *args, **kwargs):
        super(ClientPaymentChooseTariffForm, self).__init__(*args, **kwargs)

        self.minutes = minutes
        self.price_per_minute = price_per_minute


class ClientPaymentChooseMethodForm(forms.Form):
    tariff_id = forms.IntegerField(widget=forms.HiddenInput())
    payment_method = forms.ChoiceField(choices=Bill.PAYMENT_METHODS,
                                       initial=Bill.PAYMENT_METHOD_ELECTRON,
                                       label='Способ оплаты')


class ClientPaymentBillIdField(forms.Form):
    bill_id = forms.IntegerField(widget=forms.HiddenInput())


class ClientPaymentRequestCashlessForm(ClientPaymentBillIdField):
    target = '/profile/client/payment/request_cashless'


class ClientPaymentRequestElectronForm(RobokassaForm, ClientPaymentBillIdField):
    pass


class ClientOperatorsEditOperatorForm(ModelForm):
    operator_id = forms.IntegerField(widget=forms.HiddenInput(), required=False)
    photo = forms.ImageField(required=False)

    class Meta:
        model = Operator
        fields = ['name', 'position', 'phone_number', 'email', 'photo_url']
        # CSS-класс 'phone-number' используется для того, чтобы делать по нему
        #  автоподстановку маски для ввода номера(+7) при получением полем
        #  фокуса; js-код в base.html
        widgets = {'phone_number': forms.TextInput(attrs={'class': 'phone-number'})}

##
