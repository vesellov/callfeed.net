// widget_visualizer() machine
//
// EVENTS:
//

//   `hide`
//   `init`
//   `on-resize`
//   `on-scroll`
//   `show`

var WidgetVisualizer = Automat.extend({

    construct: function(begin_state, parent) {
    	this.debug = true;
    	this.log_events = false;
        this.state = begin_state;
        this.name = "widget_visualizer";
        this.parent = parent;
        this.is_touch = this._is_touch_device();
        debug.log('CREATED AUTOMAT ' + this.name, "TOUCH DEVICE:", this.is_touch);
    },

    kill: function() {
        debug.log('DESTROY AUTOMAT ' + this.name);
    	this.parent = null;
    	delete this.parent;
    },
    
    state_changed: function (old_state, new_state, event, args) {
    },

    A: function(event, args) {
        // Access method to interact with widget_visualizer() machine.
        switch (this.state) {
            //---AT_STARTUP---
            case 'AT_STARTUP': {
                if ( event === 'init' && this.isStaticWindow(event, args) ) {
                    this.state = 'STATIC_WINDOW';
                    this.doInit(event, args);
                    this.doSetUpStaticWindow(event, args);
                }
                break;
            }
            //---STATIC_WINDOW---
            case 'STATIC_WINDOW': {
                if ( event === 'show' ) {
                    this.doShow(event, args);
                } else if ( event === 'hide' ) {
                    this.doHide(event, args);
                }
                break;
            }
        }
    },


    isStaticWindow: function(event, args) {
        // Condition method.
        debug.log(this.name+".isStaticWindow('"+event+"', "+args+")");
        return (CallFeedOptions.position == "fixed"); 
    },

    doInit: function(event, args) {
        // Action method.
        debug.log(this.name+".doInit('"+event+"', "+args+")");
        this._apply_main_button();
        this._apply_background();
        this._apply_managers();
        this._apply_text_color();
        this._bind_events();
        this._size_off_pages();
    	// Setup logo animation
    	//this._bind_mouse_over_logo();
    	//this._start_loop_animate_logo();
    },
    
    doSetUpStaticWindow: function(event, args) {
        // Action method.
        debug.log(this.name+".doSetUpStaticWindow('"+event+"', "+args+")");
    },

    doShow: function(event, args) {
        // Action method.
        debug.log(this.name+".doShow('"+event+"', "+args+")");
        this._widget_show();
    },

    doHide: function(event, args) {
        // Action method.
        debug.log(this.name+".doHide('"+event+"', "+args+")");
        this._widget_hide();
    },

    // EVENTS BINDING //////////////////////////////////////////////////////// 
    
	_bind_events: function() {
    	// Disable "Enter" pressed on input field 
    	$('.cf_call_input').on('keypress', function (e) {
            var event = e || window.event;
            var charCode = event.which || event.keyCode;
            if ( charCode == '13' ) {
                event.preventDefault();
              	return false;
            }
            return true;
    	});
    	// Catch moment when user want to enter phone number and put "+7"
    	$('.cf_call_input,#cf_message_phone_input').focus(function() {
    		if ($(this).val() == "")
    			$(this).val("+7");
    	});
    	// Make "valid" input for phone number
    	$(".cf_call_input, #cf_message_phone_input").keydown(function (e) {
            // Allow: +, backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [43, 46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                 // Allow: Ctrl+A, Command+A
                (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) || 
                 // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                     // let it happen, don't do anything
                     return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
	},    
    
    // SHOW & HIDE ////////////////////////////////////////////////////////////
    
    _widget_show: function() {
    	// this._start_loop_animate_logo();
    	this._size_on_pages();
        return $("#cf_widget").show();
    },
    
    _widget_hide: function() {
    	// this._stop_loop_animate_logo();
        ret = $("#cf_widget").hide();
    	this._size_off_pages();
        return ret;
    },
    
    _size_on_pages: function() {
    	$('#callfeed_root').css('height', CallFeedOptions.param_total_max_height+'px');
    	$('#cf_main_content').removeClass('cf__div0height');
    	$('#cf_dial_content').removeClass('cf__div0height');
    	$('#cf_free_content').removeClass('cf__div0height');
    	$('#cf_free_sent_content').removeClass('cf__div0height');
    	$('#cf_timeoff_content').removeClass('cf__div0height');
    	$('#cf_timeoff_sent_content').removeClass('cf__div0height');
    	$('#cf_message_content').removeClass('cf__div0height');
    	$('#cf_message_sent_content').removeClass('cf__div0height');
    	$('#cf_order_content').removeClass('cf__div0height');
    	$('#cf_order_sent_content').removeClass('cf__div0height');
    },
    
    _size_off_pages: function() {
    	$('#callfeed_root').css('height', CallFeedOptions.param_button_height+'px');
    	$('#cf_main_content').addClass('cf__div0height');
    	$('#cf_dial_content').addClass('cf__div0height');
    	$('#cf_free_content').addClass('cf__div0height');
    	$('#cf_free_sent_content').addClass('cf__div0height');
    	$('#cf_timeoff_content').addClass('cf__div0height');
    	$('#cf_timeoff_sent_content').addClass('cf__div0height');
    	$('#cf_message_content').addClass('cf__div0height');
    	$('#cf_message_sent_content').addClass('cf__div0height');
    	$('#cf_order_content').addClass('cf__div0height');
    	$('#cf_order_sent_content').addClass('cf__div0height');
    },
    
    // DETECT MOBILE PLATFORMS /////////////////////////////////////////////////
    
    _is_touch_device: function() {
    	var msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture;
    	return (( "ontouchstart" in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch);    	
    },
    
	// LOAD PARAMS ///////////////////////////////////////////////////

    _apply_main_button: function() {
    	if (!CallFeedOptions.flag_button_visible) {
    		//CallFeedOptions.
    		$('#cf_main_button').hide();
    		$('#cf_widget_triangle_img').hide();
    		$('#cf_widget').css('bottom': '0px');
    	}
    },
    
    _apply_text_color: function() {
    	if (CallFeedOptions.color_font_global.toLowerCase() != '#fff' && 
    	    CallFeedOptions.color_font_global.toLowerCase() != '#ffffff') {
    		$('.cf_close_button_img').attr('src', 'http://callfeed.net/static/img/widget/u42_black.png');
    	}
    },
    
    _apply_background: function() {
    	if (CallFeedOptions.color_background_image_global) {
    		debug.log('Add Background image:', CallFeedOptions.color_background_image_global);
    		$('.cf_background').css('background', 'url('+CallFeedOptions.color_background_image_global+') no-repeat left bottom');
    		$('.cf_background').css('background-size', 'cover');
    	}
    },
    
    _apply_managers: function() {
    	// Update picture and name - set to the first manager
    	var skip = true;
    	if (CallFeedOptions['managers'] && (CallFeedOptions['managers'].length > 0) && (CallFeedOptions['managers'][0]['photo_url']))
    		skip = false;
    	if (!skip && !CallFeedOptions.flag_is_operator_shown_in_widget)
    		skip = true;
		if (skip) {
    		debug.log('_apply_managers SKIP', $('#cf_main_content').height(), CallFeedOptions.param_manager_panel_height, CallFeedOptions['managers']);
    		$('.cf_manager_panel').hide();
    		$('#cf_main_content').css({'height':(parseInt($('#cf_main_content').height()-CallFeedOptions.param_manager_panel_height))+'px'});
    		$('#cf_dial_content').css({'height':(parseInt($('#cf_dial_content').height()-CallFeedOptions.param_manager_panel_height))+'px'});
    		$('#cf_free_content').css({'height':(parseInt($('#cf_free_content').height()-CallFeedOptions.param_manager_panel_height))+'px'});
    		$('#cf_order_content').css({'height':(parseInt($('#cf_order_content').height()-CallFeedOptions.param_manager_panel_height))+'px'});
    		$('#cf_order_sent_content').css({'height':(parseInt($('#cf_order_sent_content').height()-CallFeedOptions.param_manager_panel_height))+'px'});
    		$('#cf_main_custom_text').css({'margin-top':'-'+parseInt(CallFeedOptions.param_manager_panel_height)+'px'});
    		$('#cf_dial_custom_text').css({'margin-top':'-'+parseInt(CallFeedOptions.param_manager_panel_height)+'px'});
    		$('#cf_order_custom_text').css({'margin-top':'-'+parseInt(CallFeedOptions.param_manager_panel_height)+'px'});
    		$('#cf_order_sent_custom_text').css({'margin-top':'-'+parseInt(CallFeedOptions.param_manager_panel_height)+'px'});
    		$('#cf_free_custom_text').css({'margin-top':'-'+parseInt(CallFeedOptions.param_manager_panel_height)+'px'});
    	} else {
    		var man = CallFeedOptions['managers'][0];
    		debug.log('_apply_managers', man, CallFeedOptions.flag_is_operator_shown_in_widget);
    		$('.cf_manager_face').attr('src', man['photo_url']);
			$('.cf_manager_name_value').html(man['name']);
			$('.cf_manager_role_value').html(man['role']);
    	}
    },
    
    _prepare_day_time: function(day_tag_id) {
    	var date = new Date;
    	var hour = date.getHours();
    	var day = date.getDay();
    	if (day == 0) day = 7;
    	var sched = CallFeedOptions.schedule;
    	var sched_days = [];
    	var sched_ok = false;
    	var work_days = [1,2,3,4,5,6,7];
    	var good_days = [];
    	//debug.log('_prepare_day_time', sched, good_days, work_days, sched_days);
    	try {
	    	for (var sched_day = 1; sched_day <= 7; sched_day++) {
	    		if (sched[sched_day] != '-') {
	    			sched_ok = true;
	    			var from_to = sched[sched_day].split('-');
	    			var to = parseInt(from_to[1].split(':')[0])+1;
	    			if (sched_day == day) {
				    	if (hour >= to) {
		    				work_days[sched_day-1] = 0;
				    	}
	    				sched_days.push('Сегодня');
	    			} else if (sched_day == day+1) {
	    				sched_days.push('Завтра');
	    			} else if (sched_day == day+2) {
	    				sched_days.push('Послезавтра');
	    			} else {
	    				sched_days.push(weekdays()[sched_day-1]);
	    			}
	    		} else {
    				sched_days.push('');
    				work_days[sched_day-1] = 0;
	    		}
	    	}
    		for (var i=0; i<= work_days.length; i++) {
    			var gd = work_days[(i+day-1) % 7];
    			if (gd>0 && good_days.indexOf(gd) < 0)
    				good_days.push(gd);
    		} 
    	} catch (e) {
    		debug.log(e);
    	}
    	//debug.log('_prepare_day_time', sched, good_days, work_days, sched_days);
    	if (sched_ok) {
    		$('#'+day_tag_id+' option[value="Сегодня"]').remove();
    		$('#'+day_tag_id+' option[value="Завтра"]').remove();
    		$('#'+day_tag_id+' option[value="Послезавтра"]').remove();
    		$('#'+day_tag_id+' option[value="Понедельник"]').remove();
    		$('#'+day_tag_id+' option[value="Вторник"]').remove();
    		$('#'+day_tag_id+' option[value="Среда"]').remove();
    		$('#'+day_tag_id+' option[value="Четверг"]').remove();
    		$('#'+day_tag_id+' option[value="Пятница"]').remove();
    		$('#'+day_tag_id+' option[value="Суббота"]').remove();
    		$('#'+day_tag_id+' option[value="Воскресенье"]').remove();
    		for (var good_day=0; good_day<good_days.length; good_day++) {
    			var work_day = good_days[good_day];
    			var work_day_label = sched_days[work_day-1];
	    		$('#'+day_tag_id).append('<option class="cf__option" value="'+work_day_label+'">'+work_day_label+'</option>');
	    		//debug.log(good_day, work_day, work_day_label);
    		}
    	}
    },
        
    _update_from_to_time: function(day_tag_id, time_tag_id) {
    	var date = new Date;
    	var day = date.getDay();
    	if (day == 0) day = 7;
    	var hour = date.getHours();
    	var selected_day = null;
		if ($("#"+day_tag_id).val() == 'Сегодня') {
			selected_day = day;
		} else if ($("#"+day_tag_id).val() == 'Завтра') {
			selected_day = day + 1;
		} else if ($("#"+day_tag_id).val() == 'Послезавтра') {
			selected_day = day + 2;
		} else {
			selected_day = weekday2index()[$("#"+day_tag_id).val()];
		}
		if (selected_day > 7)
			selected_day -= 7;
		//debug.log('_update_from_to_time', CallFeedOptions.schedule, selected_day, day);
		try {
			var from_to = CallFeedOptions.schedule[selected_day].split('-');
			var from = parseInt(from_to[0].split(':')[0]);
			var to = parseInt(from_to[1].split(':')[0])+1;
			if (selected_day == day && hour > from) 
				from = hour+1;
			for (var h=0; h<=23; h++) {
				var zeros = String(h);
			    while (zeros.length < 2)
			    	zeros = "0" + zeros;
	    		$('#'+time_tag_id+' option[value="'+zeros+':00"]').remove();
			}
			for (var h=from; h<=to; h++) {
				var zeros = String(h);
			    while (zeros.length < 2)
			    	zeros = "0" + zeros;
	    		$('#'+time_tag_id).append('<option class="cf__option" value="'+zeros+':00">'+zeros+':00</option>');
			}
		} catch (e) {
			debug.log(e);
		}
    }    
    
});
