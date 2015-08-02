# coding=utf-8
"""
Модуль содержит прокси-класс для взаимодействия с API провайдера услуг телефонии.
Описание API лежит здесь: http://wiki.mtt.ru; login: Guest, password: cb_test
"""

__author__ = 'max'

import sys
import pprint
import jsonrpc2

test_customer_name = '883140505709005'
test_login = 'cb_test'
test_password = 'rlap0wCcoejXoK'
api_url = 'https://webapicommon.mtt.ru/index.php'

CUSTOMER_NAME = '883140779001051'
LOGIN = 'CallBack_1'
PASSWORD = 'jUvey8YujudaprAb'


class MTTProxy(object):
    class CallbackFollowMeStruct(object):
        """
        callBackFollowmeStruct:
                "order" - Порядок при обзвоне(начиная с 1)
                "timeout" - Время между звонком первому менеджеру или группе менеджеров
                    и второму менеджеру или группе менеджеров
                "redirect_number" - Номер для перенаправления вызоваа
                "type": "lineral" - Тип очереди(?линейная? какие ещё бывают?)
                "name": "chief"
                "side": Плечо для проигрывания файла или сообщения (А или В)
                "value": Информация для проигрывания или имя файла                
        """

        @staticmethod
        def make(order, timeout, redirect_number,
                 type, name, side=None, value=None):
            params = {'order': order, 
                      'timeout': timeout, 
                      'redirect_number': redirect_number,
                      'type': type, 
                      'name': name}

            if side is not None: 
                params['side'] = side
            if value is not None: 
                params['value'] = value

            return params

    def __init__(self, customer_name, login, password, url):
        self.customer_name = customer_name
        self.login = login
        self.password = password
        self.url = url
        self.server = jsonrpc2.jsonrpc2(url, {
            'username': login,
            'password': password,
        })

    def setCallBackFollowme(self, customer_name, callback_follow_me_struct,
                            caller_id=None, default_b_number=None):
        """setCallBackFollowme:
                     parameters:
                          {"customer_name","optional":false},
                          {"callBackFollowmeStruct","optional":false},
                          {"caller_id","optional":true,"type":"null","default":null}, - Номер, который будет показан
                            абоненту плеча B. 2 плеча: A - номера менеджеров, B - номер клиента,
                            который оставляет номер на сайте
                          {"defaultBNumber","optional":true,"type":"null","default":null} - Номер для дозвона на плечо B
                     returns:
                          {"type":"array|bool|null"}
        """
        structures = []

        if isinstance(callback_follow_me_struct, dict):
            structures.append(callback_follow_me_struct)

        if isinstance(callback_follow_me_struct, list):
            structures.extend(structures)

        params = {'customer_name': customer_name,
                  'callBackFollowmeStruct': structures,
                  }

        if caller_id is not None: 
            params['caller_id'] = caller_id
        if default_b_number is not None: 
            params['defaultBNumber'] = default_b_number

        return self.server.setCallBackFollowme(params)

    def setCallBackPrompt(self, customer_name, file_name):
        """setCallBackPrompt:
                 parameters:
                        {"customer_name","optional":false},
                        {"file_name","optional":false}
                 returns: {"type":"array"},
        """
        return self.server.setCallBackPrompt({'customer_name': customer_name,
                                              'file_name': file_name})

    def getCallBackFollowme(self, customer_name):
        """getCallBackFollowme:
                 parameters:
                      {"customer_name","optional":false}
                 returns: {"type":"array"}
        """
        return self.server.getCallBackFollowme({'customer_name': customer_name})

    def getCallBackFollowmeCallInfo(self, customer_name, callback_call_id):
        """getCallBackFollowmeCallInfo:
                 parameters:
                        {"customer_name","optional":false},
                        {"callBackCall_id","optional":false}
                 returns: {"type":"array"}
        """
        return self.server.getCallBackFollowmeCallInfo({'customer_name': customer_name,
                                                        'callBackCall_id': callback_call_id})

    def registerCustomerWithFullData(self, a):
        pass
    
    def getCustomerBalance(self, customer_name):
        """getCustomerBalance:
                parameters:
                        {"customer_name","optional":false}
                returns: {"type":"array"}
        """
        return self.server.getCustomerBalance({'customer_name': customer_name}) 
        
    def deleteCallBackFollowme(self, customer_name):
        """deleteCallBackFollowme:
                 parameters:
                      {"customer_name","optional":false}
                 returns: {"type":"array"},
        """
        return self.server.deleteCallBackFollowme({'customer_name': customer_name})

    def makeCallBackCallFollowme(self, customer_name, b_number, caller_id=None,
                                 callback_url=None, callback_follow_me_struct=None,
                                 record_enable=1, duration=None, client_caller_id=None,
                                 direction=None, caller_description=None):
        """makeCallBackCallFollowme:
                 parameters:
                       {"customer_name","optional":false},
                       {"b_number","optional":true,"default":null},
                       {"caller_id","optional":true,"type":"null","default":null},
                       {"callBackURL","optional":true,"type":"null","default":null},
                       {"simpleCallBackFollowmeStruct","optional":true,"type":"null","default":null},
                       {"recordEnable","optional":true,"type":"number","default":1},
                       {"duration","optional":true,"type":"null","default":null},
                       {"client_caller_id","optional":true,"type":"null","default":null},
                       {"direction","optional":true,"type":"null","default":null},
                       {"callDescription","optional":true,"type":"null","default":null}]
                 returns:{"type":"array|bool|null"},
        """
        structures = []
        params = {'customer_name': customer_name, }

        if isinstance(callback_follow_me_struct, dict):
            structures.append(callback_follow_me_struct)

        if isinstance(callback_follow_me_struct, list):
            for s in callback_follow_me_struct:
                structures.append(s)
        
        if len(structures):
            params['simpleCallBackFollowmeStruct'] = structures
        if b_number is not None: 
            params['b_number'] = b_number
        if caller_id is not None: 
            params['caller_id'] = caller_id
        if callback_url is not None: 
            params['callBackURL'] = callback_url
        if record_enable is not None: 
            params['recordEnable'] = record_enable
        if duration is not None: 
            params['duration'] = duration
        if client_caller_id is not None: 
            params['client_caller_id'] = client_caller_id
        if direction is not None: 
            params['direction'] = direction
        if caller_description is not None: 
            params['callDescription'] = caller_description

        return self.server.makeCallBackCallFollowme(params)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print 'use:'
        print 'python mtt.py clear'
        print 'python mtt.py call [phoneA] [phoneB] [duration] [timeout]'
        print 'python mtt.py info [call_id]'        
        sys.exit()
    
    cmd = sys.argv[1]
    
    mttproxy = MTTProxy(CUSTOMER_NAME, LOGIN, PASSWORD, api_url)

    if cmd == 'clear':
        r = mttproxy.deleteCallBackFollowme(CUSTOMER_NAME)
        pprint.pprint(r)

    elif cmd == 'call':
        phoneA = sys.argv[2]
        phoneB = sys.argv[3]
        my_struct = MTTProxy.CallbackFollowMeStruct.make(
            1, int(sys.argv[5]), phoneA, 'ringall', 'john')
        pprint.pprint(my_struct)
        r = mttproxy.makeCallBackCallFollowme(
            CUSTOMER_NAME,
            b_number=phoneB, 
            caller_id=phoneA,
            callback_url='http://callfeed.net/tracking',
            record_enable=1,
            client_caller_id=phoneB,
            duration=int(sys.argv[4]),
            direction=0,
            caller_description='Test Call',
            callback_follow_me_struct=my_struct,)
        pprint.pprint(r)
        
    elif cmd == 'info':
        callback_call_id = sys.argv[2]
        r = mttproxy.getCallBackFollowmeCallInfo(CUSTOMER_NAME, callback_call_id)
        pprint.pprint(r)
        
    elif cmd == 'balance':
        r = mttproxy.getCustomerBalance(CUSTOMER_NAME)
        pprint.pprint(r)
    
    else:
        print 'use:'
        print 'python mtt.py clear'
        print 'python mtt.py call [phoneA] [phoneB] [duration] [timeout]'
        print 'python mtt.py info [call_id]'
