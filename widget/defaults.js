function CallFeedDefaultSettings(my_token) {
  return {
	// MAIN
    // not configurable by client at all
	position: 'fixed',
	cookie_ttl_seconds: 1*60*60, // 1 hour
	countdown_from: 15,
	controllers: {
	    delayed_popup: {
	        delay: 7000
	    },
	    hash_checker: {
	    	keyword: 'callfeed'
	    }
	},
	
	// FONTS
	// can be configurable automatically by client from admin panel
	// probably he can just set family and size and all values here will be generated
	// this is a custom font
	//param_font1: 'CallFeedFont1',
	//font_family1: 'CallFeedFont1',
	//font_url1: 'http://callfeed.net/static/fonts/MuseoSansCyrl-300.otf',
	// this is standart web font
	param_font1: 'Arial',
	font_family1: '',
	font_url1: '',
	param_font_size_inputs: '14px',
	
	// PARAMS
	// this values can be adjusted from admin panel, default values are preferred
	// probably, client may need to choose one of several predefined templates  
	// this values can be calculated depend on that template for good looking of the widget
	// say, if user set too big or too small font - the total size of the widget should fit
	param_root_position_left: 'initial', //callfeed_root   this is the global position of the button and widget
	param_root_position_right: '20px', //callfeed_root     here is a full css value - with "px" 
	param_root_position_bottom: '10px', //callfeed_root    because we need to set left or right offset
	param_total_max_width:290, // callfeed_root
	param_total_max_height: 458, // callfeed_root, this is full height with button(38px) and triangle(10px)
	param_button_width: 230, // cf_main_button
	param_button_height: 38, // cf_main_button
	param_manager_panel_height: 50, // cf_manager_panel
	param_main_height: 340, // cf_main_content
	param_dial_height: 270, // cf_dial_content
	param_free_height: 280, // ccf_free_content
	param_free_sent_height: 170, // cf_free_sent_content
	param_timeoff_height: 280, // cf_timeoff_content
	param_timeoff_sent_height: 170, // cf_timeoff_sent_content
	param_message_height: 400, // cf_message_content
	param_message_sent_height: 170, // cf_message_sent_content
	param_order_height: 320, // cf_order_content
	param_order_sent_height: 210, // cf_order_sent_content
	param_z_index_global: 9999, // callfeed_root
    param_content_border_radius: 15, // cf_content
    param_main_button_border_radius: 19, // cf_main_button
	
	// TEXT VALUES
	// client should be able to set any text value directly from admin panel
	text_button: 'обратный звонок',
	text_main: '<span style="color: #FAD468;">Здравствуйте!</span><br/>Получить 25% скидку на любой товар на нашем сайте очень легко!<br/>Просто закажите обратный звонок прямо сейчас.',
	text_dial_ready: 'Подготовка соединения...',
	text_dial_start: 'Ожидайте звонка!<br/>Производится соединение с сервером...',
	text_dial_connected: 'Ожидайте звонка!<br/>Идет набор номера оператора...',
	text_dial_calling: 'Ожидайте звонка!<br/>Оператор на связи, производится набор введенного номера телефона.',
	text_dial_success: 'Соединение установлено!<br/>Возьмите трубку.',
	text_dial_refused: 'Оператор не доступен, или занят в данный момент.<br/>Попробуйте чуть позже.',
	text_dial_dropped: 'Похоже что вы не подняли трубку или сбросили вызов.',
	text_dial_out_of_balance: 'Извините, сервис в данной момент не доступен.<br/>Просим прощение за доставленные неудобства.',
	text_dial_late: 'Оператор не успел поднять трубку.',
	text_dial_failed: 'Извините, сервис в данной момент не доступен.<br/>Просим прощение за доставленные неудобства.',
	text_dial_finished: 'Соединение завершено.',
	text_order_start: 'Выберите удобное время звонка',
	text_order_done: 'Спасибо!<br/>Мы обязательно перезвоним Вам в указанное время.',
	text_order_failed: 'Извините, сервис в данной момент не доступен.<br/>Просим прощение за доставленные неудобства.',
	text_message_start: 'Постараемся ответить на Ваш вопрос как можно скорее',
	text_message_sent: 'Спасибо за ваше сообщение!<br/>Мы обязательно свяжемся с вами в ближайшее время.',
	text_message_failed: 'Извините, сервис в данной момент не доступен.<br/>Просим прощение за доставленные неудобства.',
	text_send_message_done: 'Спасибо за Ваше сообщение!<br/>Мы обязательно свяжемся с Вами в ближайшее время.',
	text_timeoff_start: '<span style="color: #FAD468;">Здравствуйте!</span><br/>К сожалению наш рабочий день уже закончился. Пожалуйста оставьте Ваш номер телефона и выберите удобное время звонка.',
	text_timeoff_start_morning: '<span style="color: #FAD468;">Доброе утро!</span><br/>Наш рабочий день еще не начался. Пожалуйста оставьте Ваш номер телефона и выберите удобное время звонка.',
	text_timeoff_start_weekend: '<span style="color: #FAD468;">Привет!</span><br/>Сегодня у нас выходной. Пожалуйста оставьте Ваш номер телефона и выберите удобное время звонка.',
	text_timeoff_done: 'Спасибо!<br/>Мы обязательно перезвоним Вам в указанное время.',
	text_timeoff_failed: 'Извините, сервис в данной момент не доступен.<br/>Просим прощение за доставленные неудобства.',
	text_free_start: '<span style="color: #FAD468;">Здравствуйте!</span><br/>Оставьте Ваш номер телефона и выберите удобное время звонка. Мы перезвоним и проконсультируем по всем вопросам.',
	text_free_sent: 'Спасибо!<br/>Мы обязательно перезвоним Вам в указанное время.',
	text_free_failed: 'Извините, сервис в данной момент не доступен.<br/>Просим прощение за доставленные неудобства.',
	text_link_order: 'Выбрать удобное время звонка',
	text_link_send_message: 'Написать сообщение',
	text_link_go_back: 'Назад',
	text_link_message_go_back: 'Заказать звонок',
	
	// COLORS
	// client should be able to set several colors and be able to customize the widget
	// probably he can set some background picture here, border colors, etc.
	color_background_global: '#4e5a5d', // '#A66857', 
	color_background_inputs: '#ccc', 
	color_font_global: '#fff', 
	color_font_link: '#BCBCAC', 
	color_font_secondary_global: '#CCDCDC',
	color_opacity_global: '.9',
	color_opacity_main_button: '.9',
	color_opacity_call_panel: '1',
	color_opacity_inputs: '1',
	color_opacity_call_button: '1',
	color_background_image_global: '',
	
    // FLAGS
    flag_name_field: false,
    flag_name_field_obligatory: false,
    flag_email_field: false,
    flag_email_field_obligatory: true,
    flag_phone_field: true,
    flag_phone_field_obligatory: true,
    flag_button_visible: true,	
    flag_button_text_animated: false,	
    flag_is_operator_shown_in_widget: true,
    flag_disable_on_mobiles: false
    
  };
}
