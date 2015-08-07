__name__ = 'jsonrpc2'
__author__ = 'Max <qiwi360@gmail.com>'
__version__ = 1, 0
__detail__ = 'Based on https://github.com/subutux/json-rpc2php'

import logging
logger = logging.getLogger(__name__)

import json
import requests
import pprint


class jsonrpc2(object):
    '''jsonrpc2 client'''
    host = ''
    default_options = {
        'username': '',
        'password': '',
    }
    currId = 0
    apiMethods = []
    headers = {'Content-Type': 'application/json',
               'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:38.0) Gecko/20100101 Firefox/38.0'}
    cookies = {}

    def __init__(self, api_url, options=None):
        self.host = api_url

        if options is not None:
            for i in options:
                self.default_options[i] = options[i]

        returned = self.rpc_list_available_commands()
        self.apiMethods = returned['services']

    def rpc_list_available_commands(self):
        response = requests.get(self.host, auth=(self.default_options['username'],
                                                 self.default_options['password']),
                                headers=self.headers, data='')
        self.cookies = response.cookies
        return json.loads(response.content)

    def rpc_call(self, method, params=None, notification=False):
        """main function to call the rpc api"""
        request = {
            'jsonrpc': '2.0',
            'method': method,
            'params': '',
        }

        if notification is False:
            self.currId += 1
            request['id'] = self.currId

        if isinstance(params, str):
            request['params'] = [params]
        elif isinstance(params, dict):
            request['params'] = params
        elif isinstance(params, list):
            request['params'] = params

        jsonrequest = json.dumps(request)
        response = requests.post(self.host, auth=(self.default_options['username'],
                                                  self.default_options['password']),
                                 headers=self.headers,
                                 data=jsonrequest)
        
        print 'rpc_call', method
        pprint.pprint(params)

        if notification is False:
            f_obj = json.loads(response.content)

            if 'error' in f_obj.keys():
                raise rpcException(f_obj['error'])
            else:
                return f_obj

    def __getattr__(self, method):
        """Magic!"""
        arg = ['', False]
        if method in self.apiMethods:
            def function(*args):
                # Get the method arguments. If there are none provided, use the default.
                try:
                    arg[0] = args[0]
                except IndexError:
                    pass
                # check if notification param is set. If not, use default (False)
                try:
                    arg[1] = args[1]
                except IndexError:
                    pass

                return self.rpc_call(method, arg[0], arg[1])

            return function
        else:
            raise rpcException("Unknown method: %s" % method)


class rpcException(Exception):
    def __init__(self, jsonrpc2Error):
        if type(jsonrpc2Error) is not str:
            print jsonrpc2Error
            message = str(jsonrpc2Error["code"]) + " :: " + jsonrpc2Error["message"]
            self.errorCode = jsonrpc2Error["code"]
            self.message = jsonrpc2Error["message"]
            self.fullMessage = jsonrpc2Error['data']
        else:
            message = jsonrpc2Error
        Exception.__init__(self, message)
