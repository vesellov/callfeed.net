function CallFeedBuildCSS(settings) {
    var o = "";
    o+="&lt;style type=&quot;text/css&quot;&gt;\n";
    o+="#callfeed_root {\n";
    o+="    position: fixed!important;\n";
    o+="    left: %(param_root_position_left)s!important;\n";
    o+="    right: %(param_root_position_right)s!important;\n";
    o+="    bottom: %(param_root_position_bottom)s!important;\n";
    o+="    width: %(param_total_max_width)spx!important;\n";
    o+="    /*height: %(param_total_max_height)spx!important;*/\n";
    o+="    /*-webkit-touch-callout: none;\n";
    o+="    -webkit-user-select: none;\n";
    o+="    -khtml-user-select: none;\n";
    o+="    -moz-user-select: none;\n";
    o+="    -ms-user-select: none;\n";
    o+="    user-select: none; */\n";
    o+="    overflow: hidden!important;\n";
    o+="}\n";
    o+="#cf_widget {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 0px!important;\n";
    o+="    bottom: %(param_button_height)spx!important;\n";
    o+="    width: %(param_total_max_width)spx!important;\n";
    o+="    height: 100%!important;\n";
    o+="    overflow: hidden!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    display: none;\n";
    o+="}\n";
    o+="#cf_widget_triangle_img {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 134px!important;\n";
    o+="    bottom: -1px!important;\n";
    o+="    width: 0px!important;\n";
    o+="    height: 0px!important;\n";
    o+="    border-left: 10px solid rgba(0, 0, 0, 0)!important;\n";
    o+="    border-right: 10px solid rgba(0, 0, 0, 0)!important;\n";
    o+="    border-top: 11px solid %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="}\n";
    o+=".cf_content {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 0px!important;\n";
    o+="    bottom: 10px!important;\n";
    o+="    width: %(param_total_max_width)spx!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    /* background: none!important; */\n";
    o+="    border-radius: %(param_content_border_radius)px!important;\n";
    o+="    overflow: hidden!important;\n";
    o+="}\n";
    o+=".cf_background {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 0px!important;\n";
    o+="    top: 0px!important;\n";
    o+="    width: 100%!important;\n";
    o+="    height: 100%!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    border-radius: %(param_content_border_radius)pxpx!important;\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="    -webkit-background-size: cover;\n";
    o+="    -moz-background-size: cover;\n";
    o+="    -o-background-size: cover;\n";
    o+="    background-size: cover;\n";
    o+="}\n";
    o+="#cf_main_button {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 30px!important;\n";
    o+="    bottom: 0px!important;\n";
    o+="    width: %(param_button_width)spx!important;\n";
    o+="    height: %(param_button_height)spx!important;\n";
    o+="    cursor: pointer!important;\n";
    o+="    font-size: 17px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_main_button)s!important;\n";
    o+="    border-radius: %(param_main_button_border_radius)pxpx!important;\n";
    o+="    -webkit-touch-callout: none;\n";
    o+="    -webkit-user-select: none;\n";
    o+="    -khtml-user-select: none;\n";
    o+="    -moz-user-select: none;\n";
    o+="    -ms-user-select: none;\n";
    o+="    user-select: none;\n";
    o+="}\n";
    o+="#cf_main_button:hover {\n";
    o+="	opacity: 1!important;\n";
    o+="}\n";
    o+="#cf_main_button_content {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 0px!important;\n";
    o+="    top: 0px!important;\n";
    o+="    width: %(param_button_width)spx!important;\n";
    o+="    word-wrap: break-word!important;\n";
    o+="    text-align: center!important;\n";
    o+="    height: %(param_button_height)spx!important;\n";
    o+="    line-height: 38px!important;\n";
    o+="    vertical-align: middle;\n";
    o+="}\n";
    o+="#cf_main_button_label {\n";
    o+="    font-family: Arial!important;\n";
    o+="}\n";
    o+="#cf_copyright_link {\n";
    o+="    position: absolute!important;\n";
    o+="    bottom: 12px!important;\n";
    o+="    right: 12px!important;\n";
    o+="}\n";
    o+="#cf_copyright_link_content {\n";
    o+="    color: %(color_font_link)s!important;\n";
    o+="/*  color: %(color_font_global)s!important;\n";
    o+="    opacity: .7!important; */\n";
    o+="    font-size: 10px!important;\n";
    o+="    font-family: %(param_font1)s!important;\n";
    o+="    font-weight: 400!important;\n";
    o+="    text-decoration: none!important;\n";
    o+="}\n";
    o+=".cf_manager_panel {\n";
    o+="    position: absolute!important;\n";
    o+="    top: 24px!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    height: %(param_manager_panel_height)spx!important;\n";
    o+="}\n";
    o+=".cf_manager_face {\n";
    o+="    position: absolute!important;\n";
    o+="    top: 0px!important;\n";
    o+="    left: 0px!important;\n";
    o+="    width: 50px!important;\n";
    o+="    height: %(param_manager_panel_height)spx!important;\n";
    o+="    border-radius: 50px!important;\n";
    o+="}\n";
    o+=".cf_manager_name {\n";
    o+="    position: absolute!important;\n";
    o+="    top: 5px!important;\n";
    o+="    left: 65px!important;\n";
    o+="    right: 0px!important;\n";
    o+="    height: 25px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    font-size: 14px!important;\n";
    o+="}\n";
    o+=".cf_manager_role {\n";
    o+="    position: absolute!important;\n";
    o+="    top: 30px!important;\n";
    o+="    left: 65px!important;\n";
    o+="    right: 0px!important;\n";
    o+="    height: 20px!important;\n";
    o+="    color: %(color_font_scondary_global)s!important;\n";
    o+="    font-size: 12px!important;\n";
    o+="}\n";
    o+=".cf_close_button {\n";
    o+="    position: absolute!important;\n";
    o+="    right: 10px!important;\n";
    o+="    top: 10px!important;\n";
    o+="    width: 12px!important;\n";
    o+="    height: 12px!important;\n";
    o+="    cursor: pointer!important;\n";
    o+="}\n";
    o+=".cf_close_button_img {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 0px!important;\n";
    o+="    top: 0px!important;\n";
    o+="    width: 12px!important;\n";
    o+="    height: 12px!important;\n";
    o+="}\n";
    o+=".cf_send_message_link {\n";
    o+="    position: absolute!important;\n";
    o+="    text-align: center!important;\n";
    o+="    left: 0px!important;\n";
    o+="    right: 0px!important;\n";
    o+="    bottom: 26px!important;\n";
    o+="    height: 16px!important;\n";
    o+="    color: %(color_font_link)s!important;\n";
    o+="    /* color: %(color_font_global)s!important;\n";
    o+="    opacity: .7!important; */\n";
    o+="    white-space: nowrap!important;\n";
    o+="    font-size: 13px!important;\n";
    o+="}\n";
    o+=".cf_time_select_link {\n";
    o+="    position: absolute!important;\n";
    o+="    text-align: center!important;\n";
    o+="    left: 0px!important;\n";
    o+="    right: 0px!important;\n";
    o+="    bottom: 52px!important;\n";
    o+="    height: 16px!important;\n";
    o+="    color: %(color_font_link)s!important;\n";
    o+="    /* color: %(color_font_global)s!important;\n";
    o+="    opacity: .7!important; */\n";
    o+="    white-space: nowrap!important;\n";
    o+="    font-size: 13px!important;\n";
    o+="}\n";
    o+=".cf_call_panel {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    height: 38px!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    background-color: %(color_background_inputs)s!important;\n";
    o+="    opacity: %(color_opacity_call_panel)s!important;\n";
    o+="    border-radius: 19px!important;\n";
    o+="    border: 1px solid %(color_background_inputs)s;\n";
    o+="    box-sizing: border-box!important;\n";
    o+="}\n";
    o+=".cf_call_input {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 18px!important;\n";
    o+="    top: 0px!important;\n";
    o+="    width: 190px!important;\n";
    o+="    height: 36px!important;\n";
    o+="    font-size: 16px!important;\n";
    o+="    border: 0px!important;\n";
    o+="}\n";
    o+=".cf_call_button {\n";
    o+="    position: absolute!important;\n";
    o+="    width: 36px!important;\n";
    o+="    height: 36px!important;\n";
    o+="    cursor: pointer!important;\n";
    o+="    opacity: %(color_opacity_call_button)s!important;\n";
    o+="}\n";
    o+=".cf_call_button_bg_img {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 0px!important;\n";
    o+="    top: 0px!important;\n";
    o+="    width: 36px!important;\n";
    o+="    height: 36px!important;\n";
    o+="    opacity: %(color_opacity_call_button)s!important;\n";
    o+="}\n";
    o+=".cf_call_button_phone_img {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 8px!important;\n";
    o+="    top: 8px!important;\n";
    o+="    width: 20px!important;\n";
    o+="    height: 20px!important;\n";
    o+="    opacity: %(color_opacity_call_button)s!important;\n";
    o+="}\n";
    o+=".cf_day_select {\n";
    o+="    position: absolute!important;\n";
    o+="    top: 0px!important;\n";
    o+="    left: 0px!important;\n";
    o+="    width: 130px!important;\n";
    o+="    height: 38px!important;\n";
    o+="    font-size: %(param_font_size_inputs)s!important;\n";
    o+="    color: #000!important;\n";
    o+="    border-radius: 19px!important;\n";
    o+="    cursor: pointer!important;\n";
    o+="    padding-left: 10px!important;\n";
    o+="}\n";
    o+=".cf_time_select {\n";
    o+="    position: absolute!important;\n";
    o+="    top: 0px!important;\n";
    o+="    right: 0px!important;\n";
    o+="    width: 80px!important;\n";
    o+="    height: 38px!important;\n";
    o+="    font-size: %(param_font_size_inputs)s!important;\n";
    o+="    color: #000!important;\n";
    o+="    border-radius: 19px!important;\n";
    o+="    cursor: pointer!important;\n";
    o+="    padding-left: 14px!important;\n";
    o+="}\n";
    o+=".cf_daytime_at_text {\n";
    o+="    position: absolute!important;\n";
    o+="    top: 10px!important;\n";
    o+="    left: 145px!important;\n";
    o+="    width: 16px!important;\n";
    o+="    height: 16px!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    font-size: 16px!important;\n";
    o+="}\n";
    o+=".cf_custom_text {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    overflow: hidden!important;\n";
    o+="    /* cursor: default!important; */\n";
    o+="}\n";
    o+=".cf_custom_text_value {\n";
    o+="    font-family: %(param_font1)s!important;\n";
    o+="    font-weight: 400!important;\n";
    o+="    white-space: normal!important;\n";
    o+="    word-wrap:  break-word!important;\n";
    o+="}\n";
    o+="#cf_main_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_main_height)spx;\n";
    o+="}\n";
    o+="#cf_main_call_panel {\n";
    o+="    bottom: 87px!important;\n";
    o+="}\n";
    o+="#cf_main_custom_text {\n";
    o+="    top: 90px!important;\n";
    o+="    /* bottom: 130px!important; */\n";
    o+="}\n";
    o+="#cf_main_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 20px!important;\n";
    o+="}\n";
    o+="#cf_main_call_button {\n";
    o+="    position: absolute!important;\n";
    o+="    right: 21px!important;\n";
    o+="    bottom: 88px!important;\n";
    o+="}\n";
    o+="#cf_dial_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_dial_height)spx;\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="}\n";
    o+="#cf_dial_custom_text {\n";
    o+="    top: 90px!important;\n";
    o+="    /* bottom: 110px!important; */\n";
    o+="}\n";
    o+="#cf_dial_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 20px!important;\n";
    o+="}\n";
    o+="#cf_dial_countdown_panel {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    bottom: 52px!important;\n";
    o+="    height: 50px!important;\n";
    o+="    text-align: center!important;\n";
    o+="}\n";
    o+="#cf_dial_countdown_text {\n";
    o+="    font-family: &quot;Courier Обычный&quot;,&quot;Courier&quot;!important;\n";
    o+="    font-weight: 600!important;\n";
    o+="    font-size: 50px!important;\n";
    o+="    line-height: 50px!important;\n";
    o+="}\n";
    o+="#cf_free_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_free_height)spx;\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="}\n";
    o+="#cf_free_call_button {\n";
    o+="    position: absolute!important;\n";
    o+="    right: 21px!important;\n";
    o+="    bottom: 51px!important;\n";
    o+="}\n";
    o+="#cf_free_call_panel {\n";
    o+="    bottom: 50px!important;\n";
    o+="}\n";
    o+="#cf_free_daytime_panel {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    bottom: 100px!important;\n";
    o+="    height: 38px!important;\n";
    o+="}\n";
    o+="#cf_free_custom_text {\n";
    o+="    top: 90px!important;\n";
    o+="    /* bottom: 148px!important; */\n";
    o+="}\n";
    o+="#cf_free_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+="#cf_free_sent_custom_text {\n";
    o+="    top: 24px!important;\n";
    o+="    /* bottom: 52px!important; */\n";
    o+="}\n";
    o+="#cf_free_sent_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+="#cf_free_sent_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_free_sent_height)spx;\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="}\n";
    o+="#cf_timeoff_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_timeoff_height)spx;\n";
    o+="}\n";
    o+="#cf_timeoff_call_button {\n";
    o+="    position: absolute!important;\n";
    o+="    right: 21px!important;\n";
    o+="    bottom: 61px!important;\n";
    o+="}\n";
    o+="#cf_timeoff_custom_text {\n";
    o+="    top: 24px!important;\n";
    o+="    /* height: 140px!important; */\n";
    o+="    /* right: 40px!important; */\n";
    o+="}\n";
    o+="#cf_timeoff_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+="#cf_timeoff_call_panel {\n";
    o+="    bottom: 60px!important;\n";
    o+="}\n";
    o+="#cf_timeoff_daytime_panel {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    bottom: 110px!important;\n";
    o+="    height: 38px!important;\n";
    o+="}\n";
    o+="#cf_timeoff_sent_custom_text {\n";
    o+="    top: 24px!important;\n";
    o+="    /* bottom: 52px!important; */\n";
    o+="}\n";
    o+="#cf_timeoff_sent_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+="#cf_timeoff_sent_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_timeoff_sent_height)spx;\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="}\n";
    o+="#cf_message_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_message_height)spx;\n";
    o+="}\n";
    o+="#cf_message_custom_text {\n";
    o+="    top: 24px!important;\n";
    o+="    right: 40px!important;\n";
    o+="    /* height: 60px!important; */\n";
    o+="}\n";
    o+="#cf_message_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+="#cf_message_message_textarea {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    width: 250px!important;\n";
    o+="    bottom: 260px;\n";
    o+="    height: 74px!important;\n";
    o+="    color: #000!important;\n";
    o+="    resize: none!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    background-color: %(color_background_inputs)s!important;\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="    border-radius: 12px!important;\n";
    o+="    padding: 14px!important;\n";
    o+="}\n";
    o+="#cf_message_name_input {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    width: 236px!important;\n";
    o+="    height: 36px!important;\n";
    o+="    bottom: 210px;\n";
    o+="    color: #000!important;\n";
    o+="    border-radius: 12px!important;\n";
    o+="    padding-left: 14px!important;\n";
    o+="}\n";
    o+="#cf_message_email_input {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    width: 236px!important;\n";
    o+="    height: 38px!important;\n";
    o+="    bottom: 160px;\n";
    o+="    color: #000!important;\n";
    o+="    border-radius: 12px!important;\n";
    o+="    padding-left: 14px!important;\n";
    o+="}\n";
    o+="#cf_message_phone_input {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    width: 236px!important;\n";
    o+="    height: 38px!important;\n";
    o+="    bottom: 110px;\n";
    o+="    color: #000!important;\n";
    o+="    border-radius: 12px!important;\n";
    o+="    padding-left: 14px!important;\n";
    o+="}\n";
    o+="#cf_message_send_button {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    height: 38px!important;\n";
    o+="    bottom: 60px!important;\n";
    o+="    text-align: center!important;\n";
    o+="    cursor: pointer!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    line-height: 38px!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    background-color: #3BB767!important;\n";
    o+="    opacity: %(color_opacity_call_button)s!important;\n";
    o+="    border-radius: 19px!important;\n";
    o+="}\n";
    o+=".cf_message_go_back_link {\n";
    o+="    position: absolute!important;\n";
    o+="    text-align: center!important;\n";
    o+="    left: 0px!important;\n";
    o+="    right: 0px!important;\n";
    o+="    bottom: 26px!important;\n";
    o+="    height: 16px!important;\n";
    o+="    color: %(color_font_link)s!important;\n";
    o+="    /* color: %(color_font_global)s!important;\n";
    o+="    opacity: .7!important; */\n";
    o+="    white-space: nowrap!important;\n";
    o+="    font-size: 13px!important;\n";
    o+="}\n";
    o+="#cf_message_sent_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_message_sent_height)spx;\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="}\n";
    o+="#cf_message_sent_custom_text {\n";
    o+="    top: 24px!important;\n";
    o+="    /* bottom: 52px!important; */\n";
    o+="}\n";
    o+="#cf_message_sent_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+="#cf_order_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_order_height)spx;\n";
    o+="}\n";
    o+="#cf_order_call_button {\n";
    o+="    position: absolute!important;\n";
    o+="    right: 21px!important;\n";
    o+="    bottom: 88px!important;\n";
    o+="}\n";
    o+="#cf_order_call_panel {\n";
    o+="    bottom: 87px!important;\n";
    o+="}\n";
    o+="#cf_order_daytime_panel {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    bottom: 137px!important;\n";
    o+="    height: 38px!important;\n";
    o+="}\n";
    o+="#cf_order_custom_text {\n";
    o+="    top: 90px!important;\n";
    o+="    /* bottom: 185px!important; */\n";
    o+="}\n";
    o+="#cf_order_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+=".cf_order_go_back_link {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 0px!important;\n";
    o+="    right: 0px!important;\n";
    o+="    text-align: center!important;\n";
    o+="    bottom: 52px!important;\n";
    o+="    height: 16px!important;\n";
    o+="    color: %(color_font_link)s!important;\n";
    o+="    /* color: %(color_font_global)s!important;\n";
    o+="    opacity: .7!important; */\n";
    o+="    white-space: nowrap!important;\n";
    o+="    font-size: 13px!important;\n";
    o+="}\n";
    o+="#cf_order_sent_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_order_sent_height)spx;\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="}\n";
    o+="#cf_order_sent_custom_text {\n";
    o+="    top: 90px!important;\n";
    o+="    /* bottom: 52px!important; */\n";
    o+="}\n";
    o+="#cf_order_sent_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+=".cf__divimg { }\n";
    o+=".cf__divtext { }\n";
    o+=".cf__divpanel { }\n";
    o+=".cf__div0height {\n";
    o+="	height: 0px!important;\n";
    o+="}\n";
    o+=".cf__divhidden {\n";
    o+="	display: none!important;\n";
    o+="}\n";
    o+=".cf__divinput { }\n";
    o+=".cf__divlink {\n";
    o+="    cursor: pointer!important;\n";
    o+="}\n";
    o+=".cf__img { }\n";
    o+=".cf__u { text-decoration: underline!important; }\n";
    o+=".cf__span {\n";
    o+="    font-family: %(param_font1)s!important;\n";
    o+="    font-weight: 400!important;\n";
    o+="    font-style: normal!important;\n";
    o+="}\n";
    o+=".cf__p {\n";
    o+="    font-family: %(param_font1)s!important;\n";
    o+="    font-weight: 400!important;\n";
    o+="    font-style: normal!important;\n";
    o+="}\n";
    o+=".cf__disabled {\n";
    o+="    background-color: #aaa!important;\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="    color: #ccc!important;\n";
    o+="}\n";
    o+=".cf__valid {\n";
    o+="	border-color: %(color_background_inputs)s!important;\n";
    o+="    background-color: %(color_background_inputs)s!important;\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="}\n";
    o+=".cf__notvalid {\n";
    o+="    border: 1px solid #f00!important;\n";
    o+="    background-color: %(color_background_inputs)s!important;\n";
    o+="    /* background-color: #ecc!important; */\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="}\n";
    o+=".cf__input {\n";
    o+="    margin:0!important;\n";
    o+="    border: 1px solid %(color_background_inputs)s;\n";
    o+="    padding:0!important;\n";
    o+="    outline:0!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    background: %(color_background_inputs)s;\n";
    o+="    background-color: %(color_background_inputs)s;\n";
    o+="    /* background: none!important; */\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="    -webkit-box-shadow: none!important;\n";
    o+="    -moz-box-shadow: none!important;\n";
    o+="    box-shadow:none!important;\n";
    o+="    display:inline-block;\n";
    o+="    vertical-align:middle!important;\n";
    o+="    white-space:normal!important;\n";
    o+="    color: #000!important;\n";
    o+="    line-height: 34px!important;\n";
    o+="    font-family: %(param_font1)s!important;\n";
    o+="    font-size: %(param_font_size_inputs)s!important;\n";
    o+="    -webkit-box-sizing:content-box!important;\n";
    o+="    -moz-box-sizing:content-box!important;\n";
    o+="    box-sizing:content-box!important;\n";
    o+="    -webkit-appearance: none!important;\n";
    o+="    -moz-appearance: none!important;\n";
    o+="    appearance: none!important;\n";
    o+="}\n";
    o+=".cf__input:focus, .cf__input:hover {\n";
    o+="	/* border: 0!important; */\n";
    o+="    border: 1px solid %(color_background_inputs)s;\n";
    o+="    outline:0!important;\n";
    o+="    -webkit-box-shadow: none!important;\n";
    o+="    -moz-box-shadow: none!important;\n";
    o+="    box-shadow:none!important;\n";
    o+="    background-color: %(color_background_inputs)s!important;\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="}\n";
    o+=".cf_call_panel input:-webkit-autofill {\n";
    o+="    -webkit-box-shadow: 0 0 0 1000px #ccc inset !important;\n";
    o+="    /* border: 0!important; */\n";
    o+="    /* border: 1px solid %(color_background_inputs)s; */\n";
    o+="}\n";
    o+=".cf_content input:-webkit-autofill {\n";
    o+="    -webkit-box-shadow: 0 0 0 1000px #ccc inset !important;\n";
    o+="    /* border: 0!important; */\n";
    o+="    border: 1px solid %(color_background_inputs)s;\n";
    o+="}\n";
    o+=".cf_call_panel input {\n";
    o+="    border: 0!important;\n";
    o+="    background: %(color_background_inputs)s;\n";
    o+="}\n";
    o+=".cf__select {\n";
    o+="    margin:0!important;\n";
    o+="    border: 0!important;\n";
    o+="    padding:0;\n";
    o+="    outline:0!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    background: #F2F2F2 url(&quot;http://callfeed.net/static/img/widget/up_down_arrow.png&quot;) no-repeat right center ;\n";
    o+="    background-color: %(color_background_inputs)s!important;\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="    -webkit-box-shadow: none!important;\n";
    o+="    -moz-box-shadow: none!important;\n";
    o+="    box-shadow:none!important;\n";
    o+="    display:inline-block;\n";
    o+="    vertical-align:middle!important;\n";
    o+="    white-space:normal!important;\n";
    o+="    font-family:%(param_font1)s!important;\n";
    o+="    font-size: %(param_font_size_inputs)s!important;\n";
    o+="    -webkit-box-sizing:border-box!important;\n";
    o+="    -moz-box-sizing:border-box!important;\n";
    o+="    box-sizing:border-box!important;\n";
    o+="    cursor: pointer!important;\n";
    o+="    -webkit-appearance: none!important;\n";
    o+="    -moz-appearance: none!important;\n";
    o+="    appearance: none!important;\n";
    o+="}\n";
    o+=".cf__select:focus, .cf__select:hover {\n";
    o+="    outline:0!important;\n";
    o+="    -webkit-box-shadow: none!important;\n";
    o+="    -moz-box-shadow: none!important;\n";
    o+="    box-shadow:none!important;\n";
    o+="    border-color:transparent!important;\n";
    o+="}\n";
    o+=".cf__select [disabled] {\n";
    o+="    background-color: %(color_background_inputs)s!important;\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="    color: #ccc!important;\n";
    o+="}\n";
    o+=".cf__select [multiple] {\n";
    o+="    vertical-align:middle!important;\n";
    o+="}\n";
    o+=".cf__textarea {\n";
    o+="    margin:0!important;\n";
    o+="    padding:0;\n";
    o+="    border: 0!important;\n";
    o+="    outline:0!important;\n";
    o+="    overflow: auto!important;\n";
    o+="    line-height: 1!important;\n";
    o+="    font-family: %(param_font1)s!important;\n";
    o+="    font-size: %(param_font_size_inputs)s!important;\n";
    o+="    -webkit-box-shadow: none!important;\n";
    o+="    -moz-box-shadow: none!important;\n";
    o+="    box-shadow: none!important;\n";
    o+="    -moz-box-sizing:border-box!important;\n";
    o+="    -webkit-box-sizing:border-box!important;\n";
    o+="    box-sizing:border-box!important;\n";
    o+="    -webkit-appearance: none!important;\n";
    o+="    -moz-appearance: none!important;\n";
    o+="    appearance: none!important;\n";
    o+="}\n";
    o+="&lt;/style&gt;\n";
    for (var key in settings) if (settings.hasOwnProperty(key))
        if ((key.indexOf("flag_")==0)||(key.indexOf("text_")==0)||(key.indexOf("param_")==0)||(key.indexOf("color_")==0))
            o = o.replace(new RegExp("%\\("+key+"\\)s", "g"), settings[key]);
    return o;
}
