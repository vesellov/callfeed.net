# coding=utf-8
"""
Место для централизованного хранения настроек виджета, которые
потенциально подлежат изменениям.
"""
import json

__author__ = 'max'

SCHEDULE_TIME_CHOICES_FROM = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00',
                              '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
                              '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
                              '21:00', '22:00', '23:00']
SCHEDULE_TIME_CHOICES_TO = ['00:59', '01:59', '02:59', '03:59', '04:59', '05:59', '06:59',
                            '07:59', '08:59', '09:59', '10:59', '11:59', '12:59', '13:59',
                            '14:59', '15:59', '16:59', '17:59', '18:59', '19:59', '20:59',
                            '21:59', '22:59', '23:59']
DEFAULT_WEEKDAY_SCHEDULE = '-'.join((SCHEDULE_TIME_CHOICES_FROM[10], SCHEDULE_TIME_CHOICES_TO[17]))
DEFAULT_WEEKEND_SCHEDULE = '-'
TIMEZONE_CHOICES = [(2, u'UTC+02:00 - Калининград'),
                    (3, u'UTC+03:00 - Москва'),
                    (4, u'UTC+04:00 - Самара'),
                    (5, u'UTC+05:00 - Екатеринбург'),
                    (6, u'UTC+06:00 - Омск'),
                    (7, u'UTC+07:00 - Красноярск'),
                    (8, u'UTC+08:00 - Иркутск'),
                    (9, u'UTC+09:00 - Якутск'),
                    (10, u'UTC+10:00 - Владивосток'),
                    (11, u'UTC+11:00 - Сахалинская'),
                    (12, u'UTC+12:00 - Камчатка')]
DEFAULT_TIMEZONE = 3

WIDGET_POSITION_LEFT = 'left'
WIDGET_POSITION_RIGHT = 'right'
WIDGET_POSITION_CHOICES = [(WIDGET_POSITION_LEFT, u'Слева'),
                           (WIDGET_POSITION_RIGHT, u'Справа'), ]
FREE_MINUTES = 10
DEFAULT_OPERATOR_POSITION = u'Консультант'  # used to set a new Operator's model instance position
CALLFEED_PHONE_NUMBER = '+78123092803'
SETUP_CODE_TEMPLATE = '<script type="text/javascript">var CallFeedToken = "%(widget_id)s";</script>\n<script type="text/javascript" charset="UTF-8" src="http://callfeed.net/static/cf.min.js"></script>'

DEFAULT_SETTINGS = {
    # MAIN
    # not configurable by client at all
    'position': 'fixed',
    'cookie_ttl_seconds': 1 * 60 * 60,  # 1 hour
    'countdown_from': 15,
    'controllers': {
        'delayed_popup': {
            'delay': 7000
        },
        'hash_checker': {
            'keyword': 'callfeed'
        }
    },

    # FONTS  # can be configurable automatically by client from admin panel
    # probably he can just set family and size and all values here will be generated
    # 'font_family1': 'CallFeedFont1, Arial, sans-serif',
    # 'font_url1': "http:#callfeed.net/static/fonts/MuseoSansCyrl-300.otf",  # font_family1: 'Arial',
    # font_url1: "",
	'param_font1': 'Arial',
	'font_family1': '',
	'font_url1': '',
	'param_font_size_inputs': '14px',
    'fonts': [{'Name': 'Arial', 'Family': 'Arial', 'URL': 'http://.../'},
              {'Name': 'Times New Roman', 'Family': 'TNR', 'URL': 'http://.../'}],
    'font_global_index': 0,  # соответственно - это будет Arial
    'font_global_size': '12px',

    # PARAMS
    # this values can be adjusted from admin panel, default values are preferred
    # probably, client may need to choose one of several predefined templates
    # this values can be calculated depend on that template for good looking of the widget
    # say, if user set too big or too small font - the total size of the widget should fit
    'param_root_position_left': 'initial',  # callfeed_root   this is the global position of the button and widget
    'param_root_position_right': '20px',  # callfeed_root     here is a full css value - with "px"
    'param_root_position_bottom': '10px',  # callfeed_root    because we need to set left or right offset
    'param_total_max_width': 290,  # callfeed_root
    'param_total_max_height': 448,  # callfeed_root, this is full height with button(38px) and triangle(10px)
    'param_button_width': 230,  # cf_main_button
    'param_button_height': 38,  # cf_main_button
    'param_manager_panel_height': 50,  # cf_manager_panel
    'param_main_height': 340,  # cf_main_content
    'param_dial_height': 270,  # cf_dial_content
    'param_free_height': 300,  # cf_free_content
    'param_free_sent_height': 170,  # cf_free_sent_content
    'param_timeoff_height': 280,  # cf_timeoff_content
    'param_timeoff_sent_height': 170,  # cf_timeoff_sent_content
    'param_message_height': 400,  # cf_message_content
    'param_message_sent_height': 170,  # cf_message_sent_content
    'param_order_height': 320,  # cf_order_content
    'param_order_sent_height': 210,  # cf_order_sent_content
	'param_z_index_global': 9999, # callfeed_root
    'param_content_border_radius': 15, # cf_content
    'param_main_button_border_radius': 19, # cf_main_button

    # TEXT VALUES
    # client should be able to set any text value directly from admin panel
    'text_button': 'обратный звонок',
    'text_main': '<span style="color: #FAD468;">Здравствуйте!</span><br/>Получить 25% скидку на любой товар на нашем сайте очень легко!<br/>Просто закажите обратный звонок прямо сейчас.',
    'text_dial_ready': 'Подготовка соединения...',
    'text_dial_start': 'Ожидайте звонка!<br/>Производится соединение с оператором.',
    'text_dial_calling': 'Ожидайте звонка!<br/>Производится соединение с оператором.',
    'text_dial_success': 'Соединение установлено!<br/>Возьмите трубку.',
    'text_dial_late': 'Оператор не успел поднять трубку.',
    'text_dial_failed': 'Извините, сервис в данной момент не доступен.<br/>Просим прощение за доставленные неудобства.',
    'text_dial_finished': 'Соединение завершено.',
    'text_order_start': 'Выберите удобное время звонка',
    'text_order_done': 'Спасибо!<br/>Мы обязательно перезвоним Вам в указанное время.',
    'text_order_failed': 'Извините, сервис в данной момент не доступен.<br/>Просим прощение за доставленные неудобства.',
    'text_message_start': 'Постараемся ответить на Ваш вопрос как можно скорее',
    'text_message_sent': 'Спасибо за ваше сообщение!<br/>Мы обязательно свяжемся с вами в ближайшее время.',
    'text_message_failed': 'Извините, сервис в данной момент не доступен.<br/>Просим прощение за доставленные неудобства.',
    'text_send_message_done': 'Спасибо за Ваше сообщение!<br/>Мы обязательно свяжемся с Вами в ближайшее время.',
    'text_timeoff_start': '<span style="color: #FAD468;">Здравствуйте!</span><br/>К сожалению наш рабочий день уже закончился. Пожалуйста оставьте Ваш номер телефона и выберите удобное время звонка.',
    'text_timeoff_done': 'Спасибо!<br/>Мы обязательно перезвоним Вам в указанное время.',
    'text_free_start': '<span style="color: #FAD468;">Здравствуйте!</span><br/>Оставьте Ваш номер телефона и выберитcolor_background_image_globalе удобное время звонка. Мы перезвоним и проконсультируем по всем вопросам.',
    'text_free_done': 'Спасибо!<br/>Мы обязательно перезвоним Вам в указанное время.',
    'text_link_order': 'Выбрать удобное время звонка',
    'text_link_send_message': 'Написать сообщение',
    'text_link_go_back': 'Назад',
    'text_link_message_go_back': 'Заказать звонок',

    # COLORS
    # client should be able to set several colors and be able to customize the widget
    # probably he can set some background picture here, border colors, etc.
    'color_background_global': '#4e5a5d',
    'color_background_inputs': '#ccc',
    'color_background_image_global': '',
    'color_font_global': '#fff',
    'color_font_link': '#BCBCAC',
    'color_font_scondary_global': '#CCDCDC',
    'color_opacity_global': '.9',
    'color_opacity_main_button': '.9',
    'color_opacity_call_panel': '1',
    'color_opacity_inputs': '1',
    'color_opacity_call_button': '1',

    # FLAGS
    'flag_name_field': False,
    'flag_name_field_obligatory': False,
    'flag_email_field': False,
    'flag_email_field_obligatory': True,
    'flag_phone_field': True,
    'flag_phone_field_obligatory': True,
    'flag_button_visible': True,
    'flag_button_text_animated': False,
    'flag_is_operator_shown_in_widget': True,
    'flag_disable_on_mobiles': False,
}

DEFAULT_SETTINGS_JSON = json.dumps(DEFAULT_SETTINGS, ensure_ascii=False)

