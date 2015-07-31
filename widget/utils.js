
if (typeof String.prototype.trimLeft !== 'function') {
	String.prototype.trimLeft = function(charlist) {
	  if (charlist === undefined)
	    charlist = "\s";
	 
	  return this.replace(new RegExp("^[" + charlist + "]+"), "");
	};
}

if (typeof String.prototype.trimRight !== 'function') {
	String.prototype.trimRight = function(charlist) {
		  if (charlist === undefined)
		    charlist = "\s";
		 
		  return this.replace(new RegExp("[" + charlist + "]+$"), "");
	};
}

if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function(charlist) {
		  return this.trimLeft(charlist).trimRight(charlist);
	};
}

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

function isValidEmailAddress(emailAddress) {
	if (!emailAddress) return false;
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}


function isValidPhoneNumber(phoneNumber) {
	if (!phoneNumber) return false;
    var pattern = new RegExp(/^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/);
    return pattern.test(phoneNumber);
}


function isTouchDevice() {
	var msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture;
	var ret = (( "ontouchstart" in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch);
	debug.log('isTouchDevice() result:', window, document, msGesture, ret);
	return ret;
}


function weekdays() {
	return ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
}


function weekday2index() {
	return {
		'Понедельник': 1,
		'Вторник': 2,
		'Среда': 3,
		'Четверг': 4,
		'Пятница': 5,
		'Суббота': 6,
		'Воскресенье': 7
	};
}


function conver_weekday_to_number(weekday_or_day_label) {
	var result = weekday2index()[weekday_or_day_label];
	if (result)
		return result;
	var date = new Date;
	var day = date.getDay();
	if (day == 0)
		day = 7;
	if (weekday_or_day_label == 'Сегодня') {
		result = day;
	} else if (weekday_or_day_label == 'Завтра') {
		result = day + 1;
	} else if (weekday_or_day_label == 'Послезавтра') {
		result = day + 2;
	}
	if (result > 7)
		result -= 7;
	return result;
}


function convert_weekday_to_delta_days(weekday_or_day_label) {
	var date = new Date;
	var day = date.getDay();
	if (day == 0)
		day = 7;
	var newday = weekday2index()[weekday_or_day_label];
	var result = 0;
	if (newday) {
		result = newday - day;
		if (result < 0)
			result += 7;
	} else {
		if (weekday_or_day_label == 'Сегодня') {
			result = 0;
		} else if (weekday_or_day_label == 'Завтра') {
			result = 1;
		} else if (weekday_or_day_label == 'Послезавтра') {
			result = 2;
		}
	}
	return result;
}


