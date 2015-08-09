# -*- coding: utf8 -*-
"""
Модуль, ответственный за отправку сообщений. Содержит прокси-класс, реализующий функционал отправки SMS-сообщения
"""

import sys
import traceback

from urllib2 import urlopen, URLError
from urllib import quote

#------------------------------------------------------------------------------ 

APP_ID = '45f01f7d-0419-0074-09a3-888efdaff811' # '1014c2de-780a-ce64-8d0d-2d8c61d62bb0'
PARTNER_ID = 122353 # 117208

DEBUG = False

#------------------------------------------------------------------------------ 

class SMS:
    def __init__(self, app_id, debug):
        self.app_id = app_id
        self.http_timeout = 10  # Timeout for http connection default is 10
        self.debug = debug
        self.service_codes = {
            # На следующих строчках вы найдете идентификаторы
            # отправленных сообщений
            # в том же порядке, в котором вы указали номера,
            # на которых совершалась отправка.
            100: "Сообщение принято к отправке.",
            200: "Неправильный api_id",
            201: "Не хватает средств на лицевом счету",
            202: "Неправильно указан получатель",
            203: "Нет текста сообщения",
            204: "Имя отправителя не согласовано с администрацией",
            205: "Сообщение слишком длинное (превышает 8 СМС)",
            206: "Будет превышен или уже превышен дневной лимит на отправку сообщений",
            207: "На этот номер (или один из номеров) нельзя отправлять сообщения, либо указано более 100 номеров в списке получателей",
            208: "Параметр time указан неправильно",
            209: "Вы добавили этот номер (или один из номеров) в стоп-лист",
            210: "Используется GET, где необходимо использовать POST",
            211: "Метод не найден",
            220: "Сервис временно недоступен, попробуйте чуть позже.",
            300: "Неправильный token (возможно истек срок действия, либо ваш IP изменился)",
            301: "Неправильный пароль, либо пользователь не найден",
            302: "Пользователь авторизован, но аккаунт не подтвержден (пользователь не ввел код, присланный в регистрационной смс)",
        }
        self.url = "http://sms.ru/sms/send?api_id=%s&to=%s&text=%s&partner_id=%s"

    def send(self, to, message):
        app_id = self.app_id
        debug = self.debug
        service_codes = self.service_codes

        url = self.url % (app_id, to.lstrip('+'), quote(message), PARTNER_ID)

        if debug:
            url += "&test=1"

        try:
            res = urlopen(url, timeout=self.http_timeout)
            print("GET: {} {}\nReply:\n{}".format(
                res.geturl(), res.msg, res.info()))
        except URLError as err_str:
            print('sms sender[debug]: {} '.format(err_str))
            return '{}'.format(err_str)

        try:
            result = res.read()
            service_result = result.splitlines()
            
            if not result.strip() or not service_result:
                print("sms send[debug]: Empty response from SMS.RU")
                return "Empty response from SMS.RU"
    
            if int(service_result[0]) != 100:
                print("sms send[debug]: Unable send sms message to %s when service has returned code: %s " % (
                    to, service_codes[int(service_result[0])]))
                return service_codes[int(service_result[0])]
    
            if int(service_result[0]) == 100:
                print("sms send[debug]: Message send ok. ID: %s" % (service_result[1]))
                
        except:
            traceback.print_exc()
            return traceback.format_exc()  
        
        return service_result[1]

#------------------------------------------------------------------------------ 

class ProxySMS:
    def __init__(self, app_id=APP_ID, debug=DEBUG):
        self.__sms = SMS(app_id=app_id, debug=debug)

    def __getattr__(self, name):
        return getattr(self.__sms, name)

#------------------------------------------------------------------------------ 

def send(to, sms):
    print '[SMS]', to, sms
    # proxy = ProxySMS()
    # return proxy.send(to, sms)

#------------------------------------------------------------------------------ 

if __name__ == '__main__':
    print 'sending...'
    print send(sys.argv[1], sys.argv[2])
