function CallFeedBuildHTML(settings) {
    var o = "";
    o+="&lt;div id=&quot;callfeed_root&quot; style=&quot;z-index:%(param_z_index_global)s;&quot;&gt;\n";
    o+="  &lt;div id=&quot;cf_main_button&quot;&gt;\n";
    o+="    &lt;div id=&quot;cf_main_button_content&quot;&gt;\n";
    o+="      &lt;span id=&quot;cf_main_button_label&quot; class=&quot;cf__span&quot;&gt;%(text_button)s&lt;/span&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="  &lt;/div&gt;\n";
    o+="  &lt;div id=&quot;cf_widget&quot;&gt;\n";
    o+="    &lt;div id=&quot;cf_widget_triangle_img&quot;&gt;&lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_main_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="     &lt;div id=&quot;cf_main_background&quot; class=&quot;cf_background cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_manager_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_manager_face cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/transparent.gif&quot;&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_name cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_name_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_role cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_role_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_time_select_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_order)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_main_call_panel&quot; class=&quot;cf_call_panel cf__divpanel cf__valid&quot;&gt;\n";
    o+="        &lt;input id=&quot;cf_main_call_input&quot; class=&quot;cf_call_input cf__input&quot; placeholder=&quot;Ваш номер телефона&quot; type=&quot;text&quot; pattern=&quot;[0-9]*&quot; /&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_main_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_main_custom_text_value&quot; class=&quot;cf__p&quot;&gt;%(text_main)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="     &lt;div id=&quot;cf_main_call_button&quot; class=&quot;cf_call_button cf__divimg&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_main_call_button_bg_img&quot; class=&quot;cf_call_button_bg_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u38.png&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_main_call_button_phone_img&quot; class=&quot;cf_call_button_phone_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u40.png&quot;&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_dial_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_manager_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_manager_face cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/transparent.gif&quot;&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_name cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_name_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_role cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_role_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_dial_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_dial_custom_text_value&quot; class=&quot;cf__p&quot;&gt;%(text_dial_ready)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_dial_countdown_panel&quot; class=&quot;cf__divpanel&quot;&gt;\n";
    o+="        &lt;span id=&quot;cf_dial_countdown_text&quot; class=&quot;cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_free_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="     &lt;div id=&quot;cf_free_background&quot; class=&quot;cf_background cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_manager_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_manager_face cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/transparent.gif&quot;&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_name cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_name_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_role cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_role_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_free_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_free_custom_text_value&quot; class=&quot;cf__p&quot;&gt;%(text_order_start)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_free_call_panel&quot; class=&quot;cf_call_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;input id=&quot;cf_free_call_input&quot; class=&quot;cf_call_input cf__input cf__valid&quot; value=&quot;&quot; placeholder=&quot;Ваш номер телефона&quot; maxlength=&quot;12&quot; type=&quot;tel&quot; /&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_free_daytime_panel&quot; class=&quot;cf__divpanel&quot;&gt;\n";
    o+="        &lt;select id=&quot;cf_free_day_select&quot; class=&quot;cf_day_select cf__select&quot;&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Сегодня'&gt;Сегодня&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Завтра'&gt;Завтра&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Послезавтра'&gt;Послезавтра&lt;/option&gt;\n";
    o+="        &lt;/select&gt;\n";
    o+="        &lt;p class=&quot;cf_daytime_at_text cf__p&quot;&gt;в&lt;/p&gt;\n";
    o+="        &lt;select id=&quot;cf_free_time_select&quot; class=&quot;cf_time_select cf__select&quot;&gt;\n";
    o+="        &lt;/select&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="     &lt;div id=&quot;cf_free_call_button&quot; class=&quot;cf_call_button cf__divimg&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_free_call_button_bg_img&quot; class=&quot;cf_call_button_bg_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u38.png&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_free_call_button_phone_img&quot; class=&quot;cf_call_button_phone_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u40.png&quot;&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_free_sent_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_free_sent_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_free_sent_custom_text_value&quot; class=&quot;cf_custom_text_value cf__p&quot;&gt;%(text_timeoff_done)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_timeoff_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="     &lt;div id=&quot;cf_timeoff_background&quot; class=&quot;cf_background cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_timeoff_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_timeoff_custom_text_value&quot; class=&quot;cf__p&quot;&gt;%(text_timeoff_start)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_timeoff_daytime_panel&quot; class=&quot;cf__divpanel&quot;&gt;\n";
    o+="        &lt;select id=&quot;cf_timeoff_day_select&quot; class=&quot;cf_day_select cf__select&quot;&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Сегодня'&gt;Сегодня&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Завтра'&gt;Завтра&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Послезавтра'&gt;Послезавтра&lt;/option&gt;\n";
    o+="        &lt;/select&gt;\n";
    o+="        &lt;p class=&quot;cf_daytime_at_text cf__p&quot;&gt;в&lt;/p&gt;\n";
    o+="        &lt;select id=&quot;cf_timeoff_time_select&quot; class=&quot;cf_time_select cf__select&quot;&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='10:00'&gt;10:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='11:00'&gt;11:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='12:00'&gt;12:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='13:00'&gt;13:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='14:00'&gt;14:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='15:00'&gt;15:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='16:00'&gt;16:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='17:00'&gt;17:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='18:00'&gt;18:00&lt;/option&gt;\n";
    o+="        &lt;/select&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_timeoff_call_panel&quot; class=&quot;cf_call_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;input id=&quot;cf_timeoff_call_input&quot; class=&quot;cf_call_input cf__input cf__valid&quot; value=&quot;&quot; placeholder=&quot;Ваш номер телефона&quot; maxlength=&quot;12&quot; type=&quot;tel&quot; /&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="     &lt;div id=&quot;cf_timeoff_call_button&quot; class=&quot;cf_call_button cf__divimg&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_timeoff_call_button_bg_img&quot; class=&quot;cf_call_button_bg_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u38.png&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_timeoff_call_button_phone_img&quot; class=&quot;cf_call_button_phone_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u40.png&quot;&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_timeoff_sent_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_timeoff_sent_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_timeoff_sent_custom_text_value&quot; class=&quot;cf_custom_text_value cf__p&quot;&gt;%(text_timeoff_done)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_message_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="     &lt;div id=&quot;cf_message_background&quot; class=&quot;cf_background cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_message_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_message_custom_text_value&quot; class=&quot;cf__p&quot;&gt;%(text_message_start)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;textarea id=&quot;cf_message_message_textarea&quot; class=&quot;cf__textarea&quot; placeholder=&quot;Напишите ваш вопрос&quot; &gt;&lt;/textarea&gt;\n";
    o+="      &lt;input id=&quot;cf_message_name_input&quot; class=&quot;cf__input cf__valid&quot; value=&quot;&quot; placeholder=&quot;Ваше имя&quot; type=&quot;text&quot; /&gt;\n";
    o+="      &lt;input id=&quot;cf_message_email_input&quot; class=&quot;cf__input cf__valid&quot; value=&quot;&quot; placeholder=&quot;E-mail&quot; type=&quot;email&quot; /&gt;\n";
    o+="      &lt;input id=&quot;cf_message_phone_input&quot; class=&quot;cf__input cf__valid&quot; value=&quot;&quot; placeholder=&quot;Телефон&quot; type=&quot;tel&quot; /&gt;\n";
    o+="      &lt;div class=&quot;cf_message_go_back_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_message_go_back)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="     &lt;div id=&quot;cf_message_send_button&quot; class=&quot;cf_button&quot;&gt;\n";
    o+="       &lt;span class=&quot;cf__span&quot;&gt;Отправить&lt;/span&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_message_sent_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_message_sent_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_message_sent_custom_text_value&quot; class=&quot;cf__p&quot;&gt;%(text_message_sent)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_message_go_back_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_message_go_back)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_order_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="     &lt;div id=&quot;cf_order_background&quot; class=&quot;cf_background cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_manager_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_manager_face cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/transparent.gif&quot;&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_name cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_name_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_role cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_role_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_order_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_order_custom_text_value&quot; class=&quot;cf_custom_text_value cf__p&quot;&gt;%(text_order_start)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_order_call_panel&quot; class=&quot;cf_call_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;input id=&quot;cf_order_call_input&quot; class=&quot;cf_call_input cf__input cf__valid&quot; value=&quot;&quot; placeholder=&quot;Ваш номер телефона&quot; maxlength=&quot;12&quot; type=&quot;tel&quot; /&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_order_daytime_panel&quot; class=&quot;cf__divpanel&quot;&gt;\n";
    o+="        &lt;select id=&quot;cf_order_day_select&quot; class=&quot;cf_day_select cf__select&quot;&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Сегодня'&gt;Сегодня&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Завтра'&gt;Завтра&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Послезавтра'&gt;Послезавтра&lt;/option&gt;\n";
    o+="        &lt;/select&gt;\n";
    o+="        &lt;p class=&quot;cf_daytime_at_text cf__p&quot;&gt;в&lt;/p&gt;\n";
    o+="        &lt;select id=&quot;cf_order_time_select&quot; class=&quot;cf_time_select cf__select&quot;&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='10:00'&gt;10:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='11:00'&gt;11:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='12:00'&gt;12:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='13:00'&gt;13:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='14:00'&gt;14:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='15:00'&gt;15:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='16:00'&gt;16:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='17:00'&gt;17:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='18:00'&gt;18:00&lt;/option&gt;\n";
    o+="        &lt;/select&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_order_go_back_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_go_back)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="     &lt;div id=&quot;cf_order_call_button&quot; class=&quot;cf_call_button cf__divimg&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_order_call_button_bg_img&quot; class=&quot;cf_call_button_bg_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u38.png&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_order_call_button_phone_img&quot; class=&quot;cf_call_button_phone_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u40.png&quot;&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_order_sent_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_manager_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_manager_face cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/transparent.gif&quot;&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_name cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_name_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_role cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_role_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_order_sent_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_order_sent_custom_text_value&quot; class=&quot;cf_custom_text_value cf__p&quot;&gt;%(text_order_done)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_copyright_link&quot; class=&quot;cf__divlink&quot;&gt;\n";
    o+="      &lt;a id=&quot;cf_copyright_link_content&quot; class=&quot;cf__link&quot; href=&quot;http://callfeed.net&quot; target=_blank&gt;callfeed.net&lt;/a&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="  &lt;/div&gt;\n";
    o+="&lt;/div&gt;\n";
    for (var key in settings) if (settings.hasOwnProperty(key))
        if ((key.indexOf("flag_")==0)||(key.indexOf("text_")==0)||(key.indexOf("param_")==0)||(key.indexOf("color_")==0))
            o = o.replace(new RegExp("%\\("+key+"\\)s", "g"), settings[key]);
    return o;
}