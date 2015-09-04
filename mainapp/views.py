# coding=utf-8

import traceback
import pprint

from collections import OrderedDict
from datetime import date, datetime, timedelta
import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User, Group
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View


# Create your views here.
from robokassa.conf import USE_POST
from robokassa.forms import RobokassaForm, ResultURLForm, SuccessRedirectForm, FailRedirectForm
from robokassa.models import SuccessNotification
from robokassa.signals import result_received, success_page_visited, fail_page_visited

from callfeed import settings

from functools import wraps

from mainapp import widget_settings
from mainapp.forms import AddResellerForm, EditClientForm, EditSetupRequestForm, EditSetupRequestHistoryForm, \
    ClientCallbacksFilterForm, ClientWidgetOptionsForm, \
    ClientWidgetContactsFormForm, ClientWidgetParametersForm, ClientWidgetDesignForm, ClientOperatorsEditOperatorForm, \
    ClientWidgetNotificationsForm, ClientWidgetContentForm, ClientInfoPersonalForm, ClientInfoSecurityForm, \
    ClientPaymentChooseTariffForm, ClientPaymentChooseMethodForm, ClientPaymentRequestCashlessForm, \
    ClientPaymentRequestElectronForm, ClientPaymentBillIdField, ClientRegisterForm, LoginForm, PasswordResetForm, \
    PasswordResetConfirmationForm
from mainapp.models import AdministrativeManager, Reseller, Client, Widget, Operator, SetupRequest, \
    SetupRequestHistory, CallbackInfo, Bill, ResetPasswordStorage
from mainapp.utils.common import save_media_file, random_delay, rand_string
from mainapp.utils.mail import send_email_act_request, send_email_widget_setup_code, send_email_request_cashless_payment, \
    send_email_password_reset_request, send_email_new_user_registered

from models import CALLBACK_STATUS_PLANNED

#------------------------------------------------------------------------------ 

def method_decorator_adaptor(adapt_to, *decorator_args, **decorator_kwargs):
    def decorator_outer(func):
        @wraps(func)
        def decorator(self, *args, **kwargs):
            @adapt_to(*decorator_args, **decorator_kwargs)
            def adaptor(*args, **kwargs):
                return func(self, *args, **kwargs)

            return adaptor(*args, **kwargs)

        return decorator

    return decorator_outer

#------------------------------------------------------------------------------
 
class ProtectedViewLoginRequired(View):
    @method_decorator(login_required)
    @method_decorator(never_cache)
    def dispatch(self, *args, **kwargs):
        return super(ProtectedViewLoginRequired, self).dispatch(*args, **kwargs)


class ProtectedResellerView(ProtectedViewLoginRequired):
    @method_decorator_adaptor(user_passes_test,
                              lambda u: u.groups.filter(name=settings.USER_GROUP_RESELLER).exists(),
                              redirect_field_name=None)
    @method_decorator_adaptor(user_passes_test,
                              lambda u: Reseller.objects.filter(user=u).exists())
    def dispatch(self, *args, **kwargs):
        return super(ProtectedResellerView, self).dispatch(*args, **kwargs)


# ## Client


class ProtectedClientView(ProtectedViewLoginRequired):
    @method_decorator_adaptor(user_passes_test,
                              lambda u: u.groups.filter(name=settings.USER_GROUP_CLIENT).exists(),
                              redirect_field_name=None)
    @method_decorator_adaptor(user_passes_test,
                              lambda u: Client.objects.filter(user=u).exists())
    def dispatch(self, request, *args, **kwargs):
        try:
            self.client = Client.objects.get(user=request.user)
            if self.client is None:
                raise Exception()
        except:
            traceback.print_exc()
            return HttpResponseRedirect('/')

        if hasattr(self, 'widget_id'):
            # from ProtectedClientWidgetView
            try:
                self.widget = self.client.widget_set.get(id=self.widget_id)
            except:
                traceback.print_exc()
                return HttpResponseRedirect('/profile/client/widgets')

        return super(ProtectedClientView, self).dispatch(request, *args, **kwargs)


class ProtectedClientWidgetView(ProtectedClientView):
    def dispatch(self, request, *args, **kwargs):
        self.widget_id = request.GET.get('widget_id', '')

        if self.widget_id in ('', None):
            return HttpResponseRedirect('/profile/client/widgets')

        return super(ProtectedClientWidgetView, self).dispatch(request, *args, **kwargs)


# ##


class ProtectedAdministrativeManagerView(ProtectedViewLoginRequired):
    @method_decorator_adaptor(user_passes_test,
                              lambda u: u.groups.filter(name=settings.USER_GROUP_ADMINISTRATIVE_MANAGER).exists(),
                              redirect_field_name=None)
    @method_decorator_adaptor(user_passes_test,
                              lambda u: AdministrativeManager.objects.filter(user=u).exists())
    def dispatch(self, *args, **kwargs):
        return super(ProtectedAdministrativeManagerView, self).dispatch(*args, **kwargs)


class ProtectedAdminView(ProtectedViewLoginRequired):
    @method_decorator_adaptor(user_passes_test,
                              lambda u: u.groups.filter(name=settings.USER_GROUP_ADMIN).exists(),
                              redirect_field_name=None)
    def dispatch(self, *args, **kwargs):
        return super(ProtectedAdminView, self).dispatch(*args, **kwargs)


class LandingIndex(View):
    def get(self, req):
        return render(req, 'pages/index_old.html', {})


# ## Accounts related staff


class LoginAccount(View):
    def get(self, request, initial_login_form=None):
        login_form = LoginForm() if initial_login_form is None else initial_login_form
        return render(request, 'pages/login.html', {
            'login_form': login_form,
        })

    def post(self, request):
        login_form = LoginForm(request.POST)

        if not login_form.is_valid():
            print('FAIL: FORM IS NOT VALID: %s' % login_form.errors)
            return self.get(request, login_form)

        user = login_form.login()
        login(request, user)

        if user.groups.filter(name=settings.USER_GROUP_ADMINISTRATIVE_MANAGER).exists():
            return HttpResponseRedirect('/profile/administrative_manager')

        if user.groups.filter(name=settings.USER_GROUP_RESELLER).exists():
            return HttpResponseRedirect('/profile/reseller')

        if user.groups.filter(name=settings.USER_GROUP_CLIENT).exists():
            return HttpResponseRedirect('/profile/client')

        return HttpResponseRedirect('/')


class LogoutAccount(View):
    # SOMETIMES DOESN'T WORK :(
    def get(self, request):
        logout(request)
        return HttpResponseRedirect('/')

    def post(self, request):
        logout(request)
        return HttpResponse('OK')


class PasswordReset(View):
    def post(self, request):
        password_reset_form = PasswordResetForm(request.POST)

        if not password_reset_form.is_valid():
            print('FAIL: FORM IS NOT VALID')
            password_reset_form.has_errors = True
            random_delay()  # prevents from time attacks
            return self.get(request, password_reset_form)

        try:
            user = User.objects.get(username=password_reset_form.cleaned_data['email'])
            client = user.client

            if client is None:
                raise ObjectDoesNotExist()

            notification_email = client.email
            confirmation_code = ResetPasswordStorage.gen_unique_confirmation_code()

            reset_password_storage_filter = ResetPasswordStorage.objects.filter(user=user)

            if reset_password_storage_filter.count() > 0:
                reset_password_storage = reset_password_storage_filter.first()
                reset_password_storage.when_reset_requested = datetime.now()
                reset_password_storage.confirmation_code = confirmation_code
            else:
                reset_password_storage = ResetPasswordStorage(user=user, confirmation_code=confirmation_code,
                                                              when_requested=datetime.now())
            reset_password_storage.save()

            send_email_password_reset_request(notification_email, confirmation_code)
        except ObjectDoesNotExist:
            password_reset_form.has_errors = True
            random_delay(finishing_with=0.7)  # prevents from time attacks
            return self.get(request, password_reset_form)

        # #ResetPasswordStorage()

        return render(request, 'pages/accounts/password_reset_accepted.html')

    def get(self, request, form=None):
        password_reset_form = PasswordResetForm() if form is None else form
        return render(request, 'pages/accounts/password_reset.html', {
            'password_reset_form': password_reset_form,
        })


class PasswordResetConfirmation(View):
    def post(self, request):
        password_confirmation_form = PasswordResetConfirmationForm(request.POST)

        if not password_confirmation_form.is_valid():
            print('FAIL: FORM IS NOT VALID')
            return render(request, 'pages/accounts/password_reset_confirmation.html', {
                'password_confirmation_form': password_confirmation_form,
            })

        reset_password_storage_id = password_confirmation_form.cleaned_data['reset_password_storage_id']

        try:
            reset_password_storage = ResetPasswordStorage.objects.get(id=reset_password_storage_id)

            if reset_password_storage.is_outdated():
                raise ObjectDoesNotExist()

            reset_password_storage.user.set_password(password_confirmation_form.cleaned_data['new_password'])
            reset_password_storage.user.save()

            reset_password_storage.delete()
        except ObjectDoesNotExist:
            return HttpResponseRedirect('/accounts/password/reset')

        return render(request, 'pages/accounts/password_reset_done.html')

    def get(self, request):
        confirmation_code = request.GET.get('code', None)

        if confirmation_code is None:
            random_delay()  # to prevent time attacks
            return HttpResponseRedirect('/accounts/password/reset')

        try:
            reset_password_storage = ResetPasswordStorage.objects.get(confirmation_code=confirmation_code)

            if reset_password_storage.is_outdated():
                reset_password_storage.delete()
                raise ObjectDoesNotExist()
        except ObjectDoesNotExist:
            random_delay(finishing_with=0.7)  # to prevent time attacks

            return HttpResponseRedirect('/accounts/password/reset')

        password_confirmation_form = PasswordResetConfirmationForm(initial={'reset_password_storage_id':
                                                                   reset_password_storage.id})

        return render(request, 'pages/accounts/password_reset_confirmation.html', {
            'password_confirmation_form': password_confirmation_form,
        })


class AccountsClientRegister(View):
    def post(self, request):
        client_register_form = ClientRegisterForm(data=request.POST)

        if not client_register_form.is_valid():
            print 'FAIL: FORM IS NOT VALID'
            return self.get(request, client_register_form)

        email, password = client_register_form.cleaned_data['email'], client_register_form.cleaned_data['password']
        name, phone_number = client_register_form.cleaned_data['name'], client_register_form.cleaned_data[
            'phone_number']

        client = Client.register_new_client(email, password, name, phone_number)

        if client is None:
            return self.get(request, client_register_form)

        user = authenticate(username=email, password=password)
        if not user:
            print 'FAIL: authenticate failed'
            random_delay(finishing_with=1.5)  # prevents from time attacks
            return self.get(request, client_register_form)
            
        login(request, user)

        try:
            send_email_new_user_registered(client.email, password, name, phone_number)
        except ObjectDoesNotExist:
            traceback.print_exc()
            random_delay(finishing_with=1.5)  # prevents from time attacks
            return self.get(request, client_register_form)

        return HttpResponseRedirect('/profile/client')

    def get(self, request, client_reg_form=None):
        client_register_form = ClientRegisterForm() if client_reg_form is None else client_reg_form
        return render(request, 'pages/accounts/client/register.html', {
            'client_register_form': client_register_form
        })


class RegisterAdministrativeManagerAccount(ProtectedAdministrativeManagerView):
    def post(self, request):
        pass


class RegisterResellerAccount(ProtectedResellerView):
    def post(self, _):
        return HttpResponse('CongratsPOST!')


# ## Profile pages ##


class ProfileAccountAdministrativeManager(ProtectedAdministrativeManagerView):
    def get(self, request):
        resellers = AdministrativeManager.objects.get(user=request.user).reseller_set.all()
        return render(request, 'pages/profile/administrative_manager/profile_administrative_manager.html',
                      {'resellers': resellers})


class ProfileReseller(ProtectedResellerView):
    def get(self, request):
        reseller = None
        try:
            reseller = Reseller.objects.get(user=request.user)
        except ObjectDoesNotExist:
            print 'FAIL: RESELLER OBJECT DOES NOT EXIST'
            return HttpResponseRedirect('/')
        filt = request.GET.get('filter', '')
        clients_list = []
        if filt == 'active':
            for client in reseller.client_set.all():
                widgets_list = []
                for widget in client.widget_set.all():
                    if widget.is_active:
                        widgets_list.append(widget)
                clients_list.append((client, widgets_list))
                del widgets_list
        elif filt == 'not-active':
            for client in reseller.client_set.all():
                widgets_list = []
                for widget in client.widget_set.all():
                    if not widget.is_active:
                        widgets_list.append(widget)
                clients_list.append((client, widgets_list))
                del widgets_list
        elif filt == 'installed':
            for client in reseller.client_set.all():
                widgets_list = []
                for widget in client.widget_set.all():
                    if widget.is_installed:
                        widgets_list.append(widget)
                clients_list.append((client, widgets_list))
                del widgets_list
        elif filt == 'not-installed':
            for client in reseller.client_set.all():
                widgets_list = []
                for widget in client.widget_set.all():
                    if not widget.is_installed:
                        widgets_list.append(widget)
                clients_list.append((client, widgets_list))
                del widgets_list
        elif filt == 'executed':
            for client in reseller.client_set.all():
                widgets_list = []
                for widget in client.widget_set.all():
                    if widget.last_executed:
                        widgets_list.append(widget)
                clients_list.append((client, widgets_list))
                del widgets_list
        else:
            for client in reseller.client_set.all():
                widgets_list = []
                for widget in client.widget_set.all():
                    widgets_list.append(widget)
                clients_list.append((client, widgets_list))
                del widgets_list
            
        pprint.pprint(clients_list)
        
        return render(request, 'pages/profile/reseller/profile_reseller.html',
                      {'reseller': reseller,
                       'clients_list': clients_list,})


# ## Administrative manager pages


class AdministrativeManagerEditResellers(ProtectedAdministrativeManagerView):
    def post(self, request):
        add_reseller_form = AddResellerForm(request.POST)

        if not add_reseller_form.is_valid():
            print 'FAIL: FORM ISNT VALID'
            return HttpResponseRedirect('/')

        email = add_reseller_form.cleaned_data['email']
        password = add_reseller_form.cleaned_data['password']
        name = add_reseller_form.cleaned_data['name']
        tariff = add_reseller_form.cleaned_data['tariff']

        group = None

        try:
            group = Group.objects.get(name=settings.USER_GROUP_RESELLER)
        except ObjectDoesNotExist:
            print 'FAIL: GROUP IS NONE'
            return HttpResponseRedirect('/')

        user = None

        try:
            user = User.objects.create_user(email, email, password)
        except ObjectDoesNotExist:
            print 'FAIL: USER IS NONE'
            return HttpResponseRedirect('/')

        user.save()

        administrative_manager = None

        try:
            administrative_manager = AdministrativeManager.objects.get(user=request.user)
        except ObjectDoesNotExist:
            print 'FAIL: ADMINISTRATIVE MANAGER IS NONE'
            return HttpResponseRedirect('/')

        reseller = Reseller(name=name, user=user, administrative_manager=administrative_manager,
                            tariff=tariff)

        if reseller is None:
            print 'FAIL: RESELLER IS NONE'
            return HttpResponseRedirect('/')

        user.groups.add(group)
        reseller.save()

        return HttpResponseRedirect(request.path)

    def get(self, request):
        add_reseller_form = AddResellerForm()

        try:
            resellers_list = AdministrativeManager.objects.get(user=request.user).reseller_set.all()
        except ObjectDoesNotExist:
            print 'FAIL: CANT GET RESELLERS LIST'
            return HttpResponseRedirect('/')

        return render(request, 'pages/profile/administrative_manager/administrative_manager_edit_resellers.html',
                      {'add_reseller_form': add_reseller_form,
                       'resellers_list': resellers_list})


# ## Reseller related staff


class ResellerEditClients(ProtectedResellerView):
    def post(self, request):
        add_client_form = EditClientForm(request.POST)

        if not add_client_form.is_valid():
            print 'FAIL: FORM ISNT VALID %s ' % add_client_form.errors
            return HttpResponseRedirect('/')

        name = add_client_form.cleaned_data['name']
        email = add_client_form.cleaned_data['email']
        phone_number = add_client_form.cleaned_data['phone_number']
        password = add_client_form.cleaned_data['password']
        client_id = add_client_form.cleaned_data['client_id']

        try:
            if client_id == '':
                print 'if client_id == '':'
                raise KeyError()

            client = Client.objects.get(id=client_id)
            reseller = Reseller.objects.get(user=request.user)

            if client.reseller != reseller:
                print 'if client.user.reseller != reseller:'
                raise KeyError()
        except (ObjectDoesNotExist, KeyError):
            if password == '':
                print 'FAIL: PASSWORD FIELD CANT BE EMPTY'
                return HttpResponseRedirect('/')

            group = None

            try:
                group = Group.objects.get(name=settings.USER_GROUP_CLIENT)
            except ObjectDoesNotExist:
                print 'FAIL: GROUP IS NONE'
                return HttpResponseRedirect('/')

            user = None

            try:
                user = User.objects.create_user(email, email, password)
            except ObjectDoesNotExist:
                print 'FAIL: USER IS NONE'
                return HttpResponseRedirect('/')

            user.save()

            reseller = None

            try:
                reseller = Reseller.objects.get(user=request.user)
            except ObjectDoesNotExist:
                print 'FAIL: RESELLER IS NONE'
                return HttpResponseRedirect('/')

            client = Client(user=user, reseller=reseller, name=name,
                            email=email, phone_number=phone_number,
                            free_minutes=reseller.tariff.free_minutes)

            if client is None:
                print 'FAIL: CLIENT IS NONE'
                return HttpResponseRedirect('/')

            user.groups.add(group)
            
        else:
            client.name = name
            client.email = email
            client.phone_number = phone_number

            if password != '':
                user = client.user
                user.set_password(password)
                user.save()

        client.save()

        return HttpResponseRedirect('/profile/reseller')

    def get(self, request):
        edit_client_form = None

        try:
            client_id = request.GET['client_id']
            client = Client.objects.get(id=client_id)
            reseller = Reseller.objects.get(user=request.user)

            if client.reseller != reseller:
                raise KeyError()
        except (ObjectDoesNotExist, KeyError):
            edit_client_form = EditClientForm(initial={'password': ''})
        else:
            edit_client_form = EditClientForm(instance=client, initial={'client_id': client.id})

        reseller = None

        try:
            reseller = Reseller.objects.get(user=request.user)
        except ObjectDoesNotExist:
            return HttpResponseRedirect('/')

        return render(request, 'pages/profile/reseller/reseller_edit_clients.html',
                      {'add_client_form': edit_client_form,
                       'reseller': reseller,
                       })


class ResellerWidgetCheck(ProtectedResellerView):
    def get(self, request):
        try:
            widget_id = request.GET.get('widget_id')
            widget = Widget.objects.get(id=widget_id)
            widget.check_if_installed()
        except:
            import traceback
            traceback.print_exc()
        return HttpResponse(str(widget.is_installed))


# ## Client related staff


class ClientCallbacks(ProtectedClientView):
    @staticmethod
    def build_callbacks_report(request, date_choices, from_date, to_date, planned, site):
        callbacks = {}
        callbacks_count = 0
        callbacks_total_time_sec = 0
        callbacks_average_time_sec = 0

        try:
            client = Client.objects.get(user=request.user)

            widgets = []

            if site != ClientCallbacksFilterForm.SITE_CHOICES_ALL:
                widgets = client.widget_set.filter(site_url=site)[:]
            else:
                widgets = client.widget_set.all()[:]

            start_datetime = datetime.combine(from_date, datetime.min.time())
            end_datetime = datetime.combine(to_date, datetime.max.time())

            filter_args = {'when__range': [start_datetime, end_datetime]}

            if planned:
                filter_args['callback_status'] = CALLBACK_STATUS_PLANNED

            for widgt in widgets:
                widget_callbacks = widgt.callbacks.filter(**filter_args)[:]

                for widget_callback in widget_callbacks:
                    if widgt.schedule is not None:
                        widget_callback.when += timedelta(hours=widgt.schedule.timezone)

                    widget_callback_pure_date = widget_callback.when.date()

                    if widget_callback_pure_date not in callbacks.keys():
                        callbacks[widget_callback_pure_date] = []

                    callbacks[widget_callback_pure_date].append(widget_callback)
                    callbacks_count += 1
                    callbacks_total_time_sec += \
                        (widget_callback.charged_length_a_sec + widget_callback.charged_length_b_sec)
        except Exception as e:
            traceback.print_exc()

        callbacks_average_time_sec = (callbacks_total_time_sec / callbacks_count) if callbacks_count > 0 else 0

        callbacks = OrderedDict(sorted(callbacks.items(), key=lambda x: x[0], reverse=True))

        return callbacks, callbacks_count, int(callbacks_total_time_sec / 60), int(
            callbacks_average_time_sec / 60)

    @staticmethod
    def build_site_urls_list(request):
        client = Client.objects.get(user=request.user)
        widgets = client.widget_set.all()[:]
        site_urls = [(widget.site_url, widget.site_url.lstrip('http://').lstrip('www.')) for widget in widgets]
        return site_urls

    def post(self, request):
        callbacks_filter_form = ClientCallbacksFilterForm(self.build_site_urls_list(request), request.POST)

        if not callbacks_filter_form.is_valid():
            print 'FAIL: FORM ISNT VALID %s ' % callbacks_filter_form.errors
            return self.get(request)

        date_choices = callbacks_filter_form.cleaned_data['date_choices']
        from_date = callbacks_filter_form.cleaned_data['from_date']
        to_date = callbacks_filter_form.cleaned_data['to_date']
        planned = callbacks_filter_form.cleaned_data['planned']
        site_choices = callbacks_filter_form.cleaned_data['site_choices']

        callbacks, callbacks_count, callbacks_total_time_min, callbacks_average_time_min \
            = self.build_callbacks_report(request, date_choices, from_date, to_date, planned,
                                          site_choices)

        return render(request, 
                      'pages/profile/client/client_callbacks.html',
                      {'callbacks': callbacks,
                       'callbacks_count': callbacks_count,
                       'callbacks_total_time_min': callbacks_total_time_min,
                       'callbacks_average_time_min': callbacks_average_time_min,
                       'filter_form': callbacks_filter_form,
                       'client': self.client})

    def get(self, request):
        callbacks = []
        site_urls = []
        callbacks_count = 0
        callbacks_total_time_min = 0
        callbacks_average_time_min = 0

        try:
            callbacks, callbacks_count, callbacks_total_time_min, callbacks_average_time_min \
                = self.build_callbacks_report(request, ClientCallbacksFilterForm.DATE_CHOICES_TODAY,
                                              date.today(), date.today(), False,
                                              ClientCallbacksFilterForm.SITE_CHOICES_ALL)
            site_urls = self.build_site_urls_list(request)
        except Exception as e:
            traceback.print_exc()

        filter_form = ClientCallbacksFilterForm(site_urls,
                                                initial={'date_choices': ClientCallbacksFilterForm.DATE_CHOICES_TODAY})

        return render(request, 'pages/profile/client/client_callbacks.html',
                      {'callbacks': callbacks,
                       'callbacks_count': callbacks_count,
                       'callbacks_total_time_min': callbacks_total_time_min,
                       'callbacks_average_time_min': callbacks_average_time_min,
                       'filter_form': filter_form,
                       'client': self.client})


class ClientWidgets(ProtectedClientView):
    def post(self, request):
        return self.get(request)

    def get(self, request):
        return render(request, 'pages/profile/client/client_widgets.html',
                      {'client': self.client})


class ClientOperators(ProtectedClientView):
    def post(self, request):
        return self.get(request)

    def get(self, request):
        operators = Operator.objects.filter(client=self.client).all()
        return render(request, 'pages/profile/client/client_operators.html', {
            'client': self.client,
            'operators': operators})


class ClientOperatorsEdit(ProtectedClientView):
    def post(self, request):
        operator_form = ClientOperatorsEditOperatorForm(request.POST, request.FILES)

        if not operator_form.is_valid():
            print 'FAIL: FORM IS NOT VALID %s' % operator_form.errors
            return self.get(request, errors=operator_form.errors)

        operator = None
        operator_params = {
            'client': self.client,
            'name': operator_form.cleaned_data['name'],
            'position': operator_form.cleaned_data['position'],
            'phone_number': operator_form.cleaned_data['phone_number'],
            'email': operator_form.cleaned_data['email']
        }

        try:
            operator = self.client.operator_set.get(id=operator_form.cleaned_data['operator_id'])
        except ObjectDoesNotExist:
            operator = Operator(**operator_params)
        else:
            operator.name = operator_params['name']
            operator.position = operator_params['position']
            operator.phone_number = operator_params['phone_number']
            operator.email = operator_params['email']

        if 'photo' in request.FILES.keys():
            photo_url = save_media_file(request.FILES['photo'])
            operator.photo_url = photo_url

        operator.save()

        return HttpResponseRedirect('/profile/client/operators/edit?operator_id=%s' % operator.id)

    def get(self, request, errors=None):
        operator_id = request.GET.get('operator_id')

        operator_form = None

        try:
            operator = self.client.operator_set.get(id=operator_id)
        except ObjectDoesNotExist:
            operator_form = ClientOperatorsEditOperatorForm()
            print('OPERATOR DOES NOT EXIST')
        else:
            operator_form = ClientOperatorsEditOperatorForm(instance=operator,
                                                            initial={'operator_id': operator_id})

        if errors:
            operator_form.has_errors = True
            operator_form.errors = errors

        return render(request, 'pages/profile/client/client_operators_edit.html', {
            'client': self.client,
            'operator_form': operator_form
            })


class ClientOperatorsDelete(ProtectedClientView):
    def post(self, request):
        return self.get(request)

    def get(self, request):
        operator_id = request.GET.get('operator_id')

        if operator_id not in ('', None):
            try:
                operator = self.client.operator_set.get(id=operator_id)
                operator.delete()
                self.client.save()
            except ObjectDoesNotExist:
                pass

        return HttpResponseRedirect('/profile/client/operators')


class ClientWidgetCheck(ProtectedClientView):
    def get(self, request):
        try:
            widget_id = request.GET.get('widget_id')
            widget = self.client.widget_set.get(id=widget_id)
            widget.check_if_installed()
        except:
            pass

        return HttpResponseRedirect('/profile/client/widgets')


class ClientWidgetNew(ProtectedClientView):
    def post(self, request):
        return self.get(request)

    def get(self, request):
        widget = Widget.create_or_get_raw(None, request.user, site_url=request.GET.get('site_url', None))
        # widget.is_raw = False
        # widget.is_active = True
        # widget.save()
        return HttpResponseRedirect('/profile/client/widgets')


class ClientWidgetDelete(ProtectedClientWidgetView):
    def post(self, request):
        return self.get(request)

    def get(self, request):
        self.widget.delete()
        return HttpResponseRedirect('/profile/client/widgets')


class ClientWidgetOptions(ProtectedClientWidgetView):
    DEFAULT_DAY_SCHEDULE = (widget_settings.SCHEDULE_TIME_CHOICES_FROM[10],
                            widget_settings.SCHEDULE_TIME_CHOICES_TO[17])

    def post(self, request):
        try:
            widget = self.widget
            options_form = ClientWidgetOptionsForm(self.client, widget, data=request.POST)
        except ObjectDoesNotExist:
            return HttpResponseRedirect('/profile/client/widgets')

        if not options_form.is_valid():
            print 'FAIL: FORM IS NOT VALID "%s; %s"' % (options_form.errors, options_form.non_field_errors())
            options_form.has_errors = True
            return render(request, 'pages/profile/client/client_widget_options.html',
                          {'client': self.client,
                           'widget_id': widget.id,
                           'options_form': options_form})

        try:
            new_default_operator = self.client.operator_set.get(
                id=options_form.cleaned_data['operator_by_default_choices'])
            widget.default_operator = new_default_operator
            widget.save()
        except ObjectDoesNotExist:
            print 'FAIL: OPERATOR DOES NOT EXIST'
            return self.get(request, errors=['OPERATOR DOES NOT EXIST'])

        widget.related_operators.clear()

        for related_operator_id in options_form.cleaned_data['related_operators']:
            try:
                related_operator = self.client.operator_set.get(id=related_operator_id)
            except ObjectDoesNotExist:
                continue

            widget.related_operators.add(related_operator)

        widget.site_url = options_form.cleaned_data['site_url']
        widget.is_operator_shown_in_widget = options_form.cleaned_data['is_operator_shown_in_widget']
        widget.save()

        schedule = widget.schedule
        schedule.timezone = options_form.cleaned_data['timezone']
        schedule.monday = '-' if not options_form.cleaned_data['monday_flag'] else '-'.join(
            (options_form.cleaned_data['monday_from'], options_form.cleaned_data['monday_to']))
        schedule.tuesday = '-' if not options_form.cleaned_data['tuesday_flag'] else '-'.join(
            (options_form.cleaned_data['tuesday_from'], options_form.cleaned_data['tuesday_to']))
        schedule.wednesday = '-' if not options_form.cleaned_data['wednesday_flag'] else '-'.join(
            (options_form.cleaned_data['wednesday_from'],
             options_form.cleaned_data['wednesday_to']))
        schedule.thursday = '-' if not options_form.cleaned_data['thursday_flag'] else '-'.join(
            (options_form.cleaned_data['thursday_from'],
             options_form.cleaned_data['thursday_to']))
        schedule.friday = '-' if not options_form.cleaned_data['friday_flag'] else '-'.join(
            (options_form.cleaned_data['friday_from'], options_form.cleaned_data['friday_to']))
        schedule.saturday = '-' if not options_form.cleaned_data['saturday_flag'] else '-'.join(
            (options_form.cleaned_data['saturday_from'], options_form.cleaned_data['saturday_to']))
        schedule.sunday = '-' if not options_form.cleaned_data['sunday_flag'] else '-'.join(
            (options_form.cleaned_data['sunday_from'], options_form.cleaned_data['sunday_to']))

        schedule.save()
        widget.save()
        
        options_form.message = u'Изменения успешно сохранены'

        return render(request, 'pages/profile/client/client_widget_options.html',
                      {'client': self.client,
                       'widget_id': widget.id,
                       'options_form': options_form})

    def get(self, request, errors=None, message=None):
        widget = self.widget
        schedule = widget.schedule

        def actual_or_default(day_schedule):
            if day_schedule is None:
                return self.DEFAULT_DAY_SCHEDULE

            try:
                time_from, time_to = day_schedule.split('-')

                if time_from is '' or time_to is '':
                    raise ValueError()
            except ValueError:
                return self.DEFAULT_DAY_SCHEDULE

            if time_from not in widget_settings.SCHEDULE_TIME_CHOICES_FROM:
                time_from = self.DEFAULT_DAY_SCHEDULE[0]

            if time_to not in widget_settings.SCHEDULE_TIME_CHOICES_TO:
                time_to = self.DEFAULT_DAY_SCHEDULE[1]

            return time_from, time_to

        initial = {'site_url': widget.site_url, 'timezone': schedule.timezone, 'widget_id': widget.id,
                   'is_operator_shown_in_widget': widget.is_operator_shown_in_widget}
        initial['monday_from'], initial['monday_to'] = actual_or_default(schedule.monday)
        initial['monday_flag'] = schedule.monday is not None and len(schedule.monday) > 1
        initial['tuesday_from'], initial['tuesday_to'] = actual_or_default(schedule.tuesday)
        initial['tuesday_flag'] = schedule.tuesday is not None and len(schedule.tuesday) > 1
        initial['wednesday_from'], initial['wednesday_to'] = actual_or_default(schedule.wednesday)
        initial['wednesday_flag'] = schedule.wednesday is not None and len(schedule.wednesday) > 1
        initial['thursday_from'], initial['thursday_to'] = actual_or_default(schedule.thursday)
        initial['thursday_flag'] = schedule.thursday is not None and len(schedule.thursday) > 1
        initial['friday_from'], initial['friday_to'] = actual_or_default(schedule.friday)
        initial['friday_flag'] = schedule.friday is not None and len(schedule.friday) > 1
        initial['saturday_from'], initial['saturday_to'] = actual_or_default(schedule.saturday)
        initial['saturday_flag'] = schedule.saturday is not None and len(schedule.saturday) > 1
        initial['sunday_from'], initial['sunday_to'] = actual_or_default(schedule.sunday)
        initial['sunday_flag'] = schedule.sunday is not None and len(schedule.sunday) > 1

        options_form = ClientWidgetOptionsForm(client=self.client, widget=widget, initial=initial)

        if errors:
            options_form.has_errors = True
            options_form.errors = errors

        if message:
            options_form.message = message

        return render(request, 'pages/profile/client/client_widget_options.html',
                      {'client': self.client,
                       'widget_id': widget.id,
                       'options_form': options_form})


class ClientWidgetDesign(ProtectedClientWidgetView):
    def post(self, request):
        design_form = ClientWidgetDesignForm(data=request.POST, files=request.FILES)

        if not design_form.is_valid():
            print 'FAIL: FORM IS NOT VALID %s' % design_form.errors
            return self.get(request, errors=design_form.errors)

        if 'background_image_global' in request.FILES.keys():
            background_image_global_url = save_media_file(request.FILES['background_image_global'])
            design_form.cleaned_data['color_background_image_global'] = background_image_global_url
        else:
            del design_form.cleaned_data['color_background_image_global']

        self.widget.update_settings(design_form.cleaned_data, design_form.excluded_fields)

        return self.get(request, message = u'Изменения успешно сохранены')

    def get(self, request, errors=None, message=None):
        widget = self.widget

        initial = {'widget_id': widget.id}

        design_form = ClientWidgetDesignForm(widget=widget,
                                             initial=initial)

        if errors:
            design_form.has_errors = True
            design_form.errors = errors
            
        if message:
            design_form.message = message

        return render(request, 'pages/profile/client/client_widget_design.html',
                      {'client': self.client,
                       'widget_id': widget.id,
                       'design_form': design_form})


class ClientWidgetNotifications(ProtectedClientWidgetView):
    def post(self, request):
        notifications_form = ClientWidgetNotificationsForm(request.POST)

        if not notifications_form.is_valid():
            print 'FAIL: FORM IS NOT VALID %s' % notifications_form.errors
            return self.get(request, errors=notifications_form.errors)

        widget = None

        try:
            widget = Widget.objects.get(id=notifications_form.cleaned_data['widget_id'])
        except (ObjectDoesNotExist, KeyError):
            print 'FAIL: WIDGET DOES NOT EXIST'
            return self.get(request, errors=['WIDGET DOES NOT EXIST'])

        widget.is_email_notification_on = notifications_form.cleaned_data['is_email_notification_on']
        widget.is_sms_notification_on = notifications_form.cleaned_data['is_sms_notification_on']
        widget.sms_notification_number = notifications_form.cleaned_data['sms_notification_number']
        widget.callback_notifications_email = notifications_form.cleaned_data['callback_notifications_email']
        widget.out_of_balance_notifications_email = notifications_form.cleaned_data[
            'out_of_balance_notifications_email']
        widget.offline_message_notifications_email = notifications_form.cleaned_data[
            'offline_message_notifications_email']
        widget.save()
        # return HttpResponseRedirect('/profile/client/widget/notifications?widget_id=%d' % notifications_form.cleaned_data['widget_id'])
        return self.get(request, message=u'Изменения успешно сохранены')

    def get(self, request, errors=None, message=None):
        try:
            widget = Widget.objects.get(id=request.GET.get('widget_id', ''))
        except (ObjectDoesNotExist, KeyError):
            traceback.print_exc()
            return HttpResponseRedirect('/profile/client/widgets')
        # widget = self.widget

        initial = {'widget_id': widget.id,
                   'is_email_notification_on': widget.is_email_notification_on,
                   'is_sms_notification_on': widget.is_sms_notification_on,
                   'sms_notification_number': widget.sms_notification_number,
                   'callback_notifications_email': widget.callback_notifications_email,
                   'out_of_balance_notifications_email': widget.out_of_balance_notifications_email,
                   'offline_message_notifications_email': widget.offline_message_notifications_email}
        
        notifications_form = ClientWidgetNotificationsForm(initial=initial)

        if errors:
            notifications_form.has_errors = True
            notifications_form.errors = errors
            
        if message:
            notifications_form.message = message

        return render(request, 'pages/profile/client/client_widget_notifications.html', {
            'client': self.client,
            'widget_id': widget.id,
            'notifications_form': notifications_form
            })


class ClientWidgetActions(ProtectedClientWidgetView):
    def post(self, request):
        return self.get(request)

    def get(self, request):
        return render(request, 'pages/profile/client/client_widget_actions.html', {
            'client': self.client,
            'widget_id': self.widget_id,
            })


class ClientWidgetParameters(ProtectedClientWidgetView):
    def post(self, request):
        parameters_form = ClientWidgetParametersForm(request.POST)

        if not parameters_form.is_valid():
            print 'FAIL: FORM IS NOT VALID %s' % parameters_form.errors
            return self.get(request, errors=parameters_form.errors)

        widget = None

        try:
            widget = Widget.objects.get(id=parameters_form.cleaned_data['widget_id'])
        except (ObjectDoesNotExist, KeyError):
            print 'FAIL: WIDGET DOES NOT EXIST'
            return self.get(request, errors=['WIDGET DOES NOT EXIST'])
        # widget.popup_time_sec = parameters_form.cleaned_data['popup_time_sec']
        widget.time_before_callback_sec = parameters_form.cleaned_data['time_before_callback_sec']
        # widget.delay_before_callback_from_a_to_b = parameters_form.cleaned_data['delay_before_callback_from_a_to_b']
        # widget.delay_before_callback_to_additional_number = parameters_form.cleaned_data[
        #    'delay_before_callback_to_additional_number']
        widget.operator_incoming_number = parameters_form.cleaned_data['operator_incoming_number']
        widget.callback_type = parameters_form.cleaned_data['callback_type']
        widget.speak_site_name = parameters_form.cleaned_data['speak_site_name']
        widget.geo_filter = parameters_form.cleaned_data['geo_filter']
        widget.disable_on_mobiles = parameters_form.cleaned_data['disable_on_mobiles']
        widget.blacklist_phones = parameters_form.cleaned_data['blacklist_phones']
        widget.blacklist_ip = parameters_form.cleaned_data['blacklist_ip']
        try:
            current_settings = json.loads(widget.settings)
            current_settings['controllers']['delayed_popup']['delay'] = 1000*int(parameters_form.cleaned_data['popup_time_sec'])
            widget.settings = json.dumps(current_settings, ensure_ascii=False)
        except Exception as e:    
            traceback.print_exc()
            return self.get(request, errors=['ERROR WRITING SETTINGS'])
        widget.save()
        
        parameters_form.message = u'Изменения успешно сохранены'

        return render(request, 'pages/profile/client/client_widget_parameters.html',
                      {'client': self.client,
                       'widget_id': widget.id,
                       'parameters_form': parameters_form})

    def get(self, request, errors=None):
        widget = self.widget

        initial = {'widget_id': widget.id,
                   'time_before_callback_sec': widget.time_before_callback_sec,
                   # 'delay_before_callback_from_a_to_b': widget.delay_before_callback_from_a_to_b,
                   # 'delay_before_callback_to_additional_number': widget.delay_before_callback_to_additional_number,
                   'operator_incoming_number': widget.operator_incoming_number,
                   'callback_type': widget.callback_type,
                   'speak_site_name': widget.speak_site_name,
                   'geo_filter': widget.geo_filter,
                   'disable_on_mobiles': widget.disable_on_mobiles,
                   'blacklist_phones': widget.blacklist_phones,
                   'blacklist_ip': widget.blacklist_ip}

        parameters_form = ClientWidgetParametersForm(initial=initial)

        if errors:
            parameters_form.has_errors = True
            parameters_form.errors = errors

        return render(request, 'pages/profile/client/client_widget_parameters.html',
                      {'client': self.client,
                       'widget_id': widget.id,
                       'parameters_form': parameters_form})


class ClientWidgetDepartments(ProtectedClientWidgetView):
    def post(self, request):
        return self.get(request)

    def get(self, request):
        return render(request, 'pages/profile/client/client_widget_departments.html', {
            'client': self.client,
            'widget_id': self.widget_id,
        })


class ClientWidgetContactsForm(ProtectedClientWidgetView):
    def post(self, request):
        contacts_form = ClientWidgetContactsFormForm(data=request.POST)

        if not contacts_form.is_valid():
            print 'FAIL: FORM IS NOT VALID %s' % contacts_form.errors
            return self.get(request, errors=contacts_form.errors)

        self.widget.update_settings(contacts_form.cleaned_data, contacts_form.excluded_fields)
        
        return self.get(request, message=u'Изменения успешно сохранены')

    def get(self, request, errors=None, message=None):
        widget = self.widget

        initial = {'widget_id': widget.id}
        contacts_form = ClientWidgetContactsFormForm(widget=widget, initial=initial)

        if errors:
            contacts_form.has_errors = True
            contacts_form.errors = errors
            
        if message:
            contacts_form.message = message

        return render(request, 'pages/profile/client/client_widget_contacts_form.html',
                      {'client': self.client,
                       'widget_id': widget.id,
                       'contacts_form': contacts_form})


class ClientWidgetContent(ProtectedClientWidgetView):
    def post(self, request):
        content_form = ClientWidgetContentForm(data=request.POST)

        if not content_form.is_valid():
            print 'FAIL: FORM IS NOT VALID %s' % content_form.errors
            return self.get(request, errors=content_form.errors)

        self.widget.update_settings(content_form.cleaned_data, content_form.excluded_fields)

        return self.get(request, message=u'Изменения успешно сохранены')

    def get(self, request, errors=None, message=None):
        widget = self.widget

        initial = {'widget_id': widget.id}

        content_form = ClientWidgetContentForm(widget=widget, initial=initial)

        if errors:
            content_form.has_errors = True
            content_form.errors = errors

        if message:
            content_form.message = message

        return render(request, 'pages/profile/client/client_widget_content.html',
                      {'client': self.client,
                       'widget_id': widget.id,
                       'content_form': content_form})


class ClientWidgetCode(ProtectedClientWidgetView):
    def post(self, request):
        widget_code = request.POST.get('widget_code')
        web_master_notification_email = request.POST.get('notification_email')

        message = None
        if widget_code != '' and widget_code is not None \
                and web_master_notification_email != '' and web_master_notification_email is not None:
            send_email_widget_setup_code(web_master_notification_email, widget_code)
            message = u"Письмо с инструкциями по установке виджета было отправлено по адресу %s" % web_master_notification_email
            
        return self.get(request, message=message)

    def get(self, request, message=''):
        site_url = self.widget.site_url

        if site_url in ('', None):
            site_url = 'http://example.com/'

        site_url = site_url.rstrip('/')

        return render(request, 'pages/profile/client/client_widget_code.html', {
            'client': self.client,
            'widget': self.widget,
            'widget_id': self.widget.id,
            'message': message,
            'site_url': site_url
        })


class ClientWidgetToggleActivity(ProtectedClientView):
    def get(self, request):
        widget_id = request.GET.get('widget_id')

        try:
            widget = self.client.widget_set.get(id=widget_id)
            widget.is_active = not widget.is_active
            widget.save()
        except ObjectDoesNotExist:
            pass

        return HttpResponseRedirect('/profile/client/widgets')


class ClientInfoPersonal(ProtectedClientView):
    def post(self, request):
        personal_form = ClientInfoPersonalForm(request.POST)

        if not personal_form.is_valid():
            print 'FAIL: FORM IS NOT VALID %s' % personal_form.errors
            return self.get(request, errors=personal_form.errors)

        update_dict = {'name': personal_form.cleaned_data['name'],  # client
                       'first_name': personal_form.cleaned_data['name'],  # user
                       'username': personal_form.cleaned_data['email'],  # user
                       'email': personal_form.cleaned_data['email'],  # user, client
                       'phone_number': personal_form.cleaned_data['phone_number'],  # client
                       'receive_email_notifications_flag': personal_form.cleaned_data[
                           'receive_email_notifications_flag'],  # client
                       'receive_sms_notifications_flag':
                           personal_form.cleaned_data['receive_sms_notifications_flag'],  # client
                       }

        self.client.update_registration_data(update_dict)
        
        personal_form.message = u'Изменения успешно сохранены'

        return render(request, 'pages/profile/client/client_info_personal.html',
                      {'client': self.client,
                       'personal_form': personal_form})

    def get(self, request, errors=None):
        personal_form = ClientInfoPersonalForm(instance=self.client)

        if errors:
            personal_form.has_errors = errors
            personal_form.errors = errors

        return render(request, 'pages/profile/client/client_info_personal.html',
                      {'client': self.client,
                       'personal_form': personal_form})


class ClientInfoSecurity(ProtectedClientView):
    def post(self, request):
        security_form = ClientInfoSecurityForm(request.POST)

        if not security_form.is_valid():
            print 'FAIL: FORM IS NOT VALID %s' % security_form.errors
            return self.get(request, errors=security_form.errors)

        success = self.client.user.check_password(security_form.cleaned_data['old_password']) and \
                  security_form.cleaned_data['new_password'] == security_form.cleaned_data['new_password_confirmation']

        if not success:
            print 'FAIL: OLD PASSWORD DO NOT MATCH OR PASSWORDS ARE DIFFERENT'
            return self.get(request, errors=['OLD PASSWORD DO NOT MATCH OR PASSWORDS ARE DIFFERENT'])

        self.client.user.set_password(security_form.cleaned_data['new_password'])
        self.client.user.save()

        user = authenticate(username=self.client.user.username, password=security_form.cleaned_data['new_password'])
        login(request, user)

        return self.get(request, message=u'Ваш новый пароль был успешно записан')

    def get(self, request, errors=None, message=None):
        security_form = ClientInfoSecurityForm()

        if errors:
            security_form.has_errors = True
            security_form.errors = errors
            
        if message:
            security_form.message = message

        return render(request, 'pages/profile/client/client_info_security.html', {
            'client': self.client,
            'security_form': security_form,
        })


class ClientInfoBills(ProtectedClientView):
    def post(self, request):
        return self.get(request)

    def get(self, request):
        bills = sorted(self.client.bill_set.all()[:], reverse=True, key=lambda x: x.id)

        return render(request, 'pages/profile/client/client_info_bills.html', {
            'client': self.client,
            'bills': bills
        })


class ClientInfoBillsRequestAct(ProtectedClientView):
    def post(self, request):
        return self.get(request)

    def get(self, request):
        bill_id = request.GET.get('bill_id')

        if bill_id is None or bill_id == '':
            # fail; mail wasn't not sent
            return HttpResponseRedirect('/profile/client/info/bills')

        send_email_act_request(bill_id, self.client.id, self.client.name)

        return HttpResponseRedirect('/profile/client/info/bills')


class ClientPaymentChooseTariff(ProtectedClientView):
    def post(self, request):
        return self.get(request)

    def get(self, request):
        choose_tariff_forms = [ClientPaymentChooseTariffForm(tariff.minutes, tariff.price_per_minute,
                                                             initial={'tariff_id': tariff.id})
                               for tariff in self.client.reseller.tariff_web.all().order_by('minutes')]

        return render(request, 'pages/profile/client/client_payment_choose_tariff.html', {
            'client': self.client,
            'choose_tariff_forms': choose_tariff_forms,
        })


class ClientPaymentChooseMethod(ProtectedClientView):
    def post(self, request):
        choose_tariff_form = ClientPaymentChooseTariffForm(data=request.POST)

        if not choose_tariff_form.is_valid():
            print 'FAIL: FORM IS NOT VALID %s' % choose_tariff_form.errors
            return HttpResponseRedirect('/profile/client/payment/choose_tariff')

        tariff = self.client.reseller.tariff_web.get(id=choose_tariff_form.cleaned_data['tariff_id'])

        if tariff is None:
            print 'FAIL: TARIFF IS NONE'
            return HttpResponseRedirect('/profile/client/payment/choose_tariff')

        choose_payment_method_form = ClientPaymentChooseMethodForm(initial={
            'tariff_id': tariff.id,
            'choose_payment_method_form': Bill.PAYMENT_METHOD_ELECTRON,
        })

        return render(request, 'pages/profile/client/client_payment_choose_method.html', {
            'client': self.client,
            'tariff': tariff,
            'sum': tariff.price_per_minute * tariff.minutes,
            'choose_payment_method_form': choose_payment_method_form,
        })


class ClientPaymentMake(ProtectedClientView):
    def post(self, request):
        choose_payment_method_form = ClientPaymentChooseMethodForm(data=request.POST)

        if not choose_payment_method_form.is_valid():
            print 'FAIL: FORM IS NOT VALID %s' % choose_payment_method_form.errors
            return HttpResponseRedirect('/profile/client/payment/choose_method')

        tariff = self.client.reseller.tariff_web.get(id=choose_payment_method_form.cleaned_data['tariff_id'])

        if tariff is None:
            print 'FAIL: TARIFF IS NONE'
            return HttpResponseRedirect('/profile/client/payment/choose_method')

        bill = Bill(client=self.client, when=datetime.now(), minutes=tariff.minutes,
                    sum=tariff.minutes * tariff.price_per_minute, price_per_minute=tariff.price_per_minute,
                    payment_method=choose_payment_method_form.cleaned_data['payment_method'])
        bill.save()

        make_payment_form = None

        if bill.payment_method == Bill.PAYMENT_METHOD_CASHLESS:
            make_payment_form = ClientPaymentRequestCashlessForm(initial={'bill_id': bill.id})
        else:
            make_payment_form = ClientPaymentRequestElectronForm(initial={
                'OutSum': bill.sum,
                'InvId': bill.id,
                'Desc': 'Bill #%d; %d minutes, %s RUB per minute' %
                        (bill.id, bill.minutes, str(bill.price_per_minute)),
                'Email': self.client.email,
                'bill_id': bill.id,
            })

        return render(request, 'pages/profile/client/client_payment_make.html', {
            'client': self.client,
            'bill': bill,
            'make_payment_form': make_payment_form,
        })


class ClientPaymentRequestCashless(ProtectedClientView):
    def post(self, request):
        payment_request_cashless_form = ClientPaymentRequestCashlessForm(request.POST)

        if not payment_request_cashless_form.is_valid():
            print 'FAIL: FORM IS NOT VALID %s' % payment_request_cashless_form.errors
            return HttpResponseRedirect('/profile/client/payment/choose_tariff')

        try:
            bill = self.client.bill_set.get(id=payment_request_cashless_form.cleaned_data['bill_id'])
        except ObjectDoesNotExist:
            print 'FAIL: BILL #%s DOES NOT EXIST' % str(payment_request_cashless_form.cleaned_data['bill_id'])
            return HttpResponseRedirect('/profile/client/payment/choose_tariff')

        send_email_request_cashless_payment(bill.id, self.client.id, self.client.name)

        return HttpResponseRedirect('/profile/client/info/bills?cashless_payment_request_received')
        # return render(request, 'pages/profile/client/client_payment_request_cash.html', {
        #     'client': self.client,
        #     'bill': bill,
        # })

    def get(self, _):
        return HttpResponseRedirect('/profile/client/payment/choose_tariff')


class ClientPaymentCancel(ProtectedClientView):
    def post(self, request):
        bill_id_field = ClientPaymentBillIdField(request.POST)

        if not bill_id_field.is_valid():
            print 'FAIL: FORM IS NOT VALID %s' % bill_id_field.errors
            return HttpResponseRedirect('/profile/client/payment/choose_tariff')

        try:
            bill = self.client.bill_set.get(id=bill_id_field.cleaned_data['bill_id'])
        except ObjectDoesNotExist:
            return HttpResponseRedirect('/profile/client/payment/choose_tariff')

        if bill.status != Bill.BILL_STATUS_PAID:
            bill.delete()
            bill.save()
        else:
            # don't allow to remove arbitrary bills
            return HttpResponseRedirect('/profile/client/payment/choose_tariff')

        return render(request, 'pages/profile/client/client_payment_cancel.html', {
            'client': self.client,
            'bill_id': bill_id_field.cleaned_data['bill_id'],
            })

    def get(self, _):
        return HttpResponseRedirect('/profile/client/payment/choose_tariff')


# ## Robokassa ##

class RobokassaResultReceived(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, extra_context=None, *args, **kwargs):
        """ обработчик для ResultURL. """
        data = request.POST if USE_POST else request.GET
        form = ResultURLForm(data)
        if form.is_valid():
            id, sum = form.cleaned_data['InvId'], form.cleaned_data['OutSum']

            # сохраняем данные об успешном уведомлении в базе, чтобы
            # можно было выполнить дополнительную проверку на странице успешного
            # заказа
            notification = SuccessNotification.objects.create(InvId=id, OutSum=sum)

            # дополнительные действия с заказом (например, смену его статуса) можно
            # осуществить в обработчике сигнала robokassa.signals.result_received
            result_received.send(sender=notification, InvId=id, OutSum=sum,
                                 extra=form.extra_params())

            return HttpResponse('OK%s' % id)
        return HttpResponse('error: bad signature')


class RobokassaSuccess(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, extra_context=None, *args, **kwargs):
        """ обработчик для SuccessURL """

        data = request.POST if USE_POST else request.GET
        form = SuccessRedirectForm(data)
        if form.is_valid():
            id, sum = form.cleaned_data['InvId'], form.cleaned_data['OutSum']

            # в случае, когда не используется строгая проверка, действия с заказом
            # можно осуществлять в обработчике сигнала robokassa.signals.success_page_visited
            success_page_visited.send(sender=form, InvId=id, OutSum=sum,
                                      extra=form.extra_params())

            context = {'InvId': id, 'OutSum': sum, 'form': form}
            context.update(form.extra_params())
            context.update(extra_context or {})
            #return TemplateResponse(request, template_name, context)
            return HttpResponseRedirect('/profile/client/info/bills?electron_payment_accepted')

        # return TemplateResponse(request, error_template_name, {'form': form})
        return HttpResponseRedirect('/profile/client/info/bills')
        # return HttpResponse('OK')


class RobokassaFail(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, extra_context=None, *args, **kwargs):
        """ обработчик для FailURL """

        data = request.POST if USE_POST else request.GET
        form = FailRedirectForm(data)

        if form.is_valid():
            id, sum = form.cleaned_data['InvId'], form.cleaned_data['OutSum']

            # дополнительные действия с заказом (например, смену его статуса для
            # разблокировки товара на складе) можно осуществить в обработчике
            # сигнала robokassa.signals.fail_page_visited
            fail_page_visited.send(sender=form, InvId=id, OutSum=sum,
                                   extra=form.extra_params())

            context = {'InvId': id, 'OutSum': sum, 'form': form}
            context.update(form.extra_params())
            context.update(extra_context or {})
            #return TemplateResponse(request, template_name, context)
            return HttpResponseRedirect('/profile/client/info/bills?payment_failed')#TemplateResponse(request, 'robokassa/fail.html', context)

        #return TemplateResponse(request, error_template_name, {'form': form})
        return HttpResponseRedirect('/profile/client/info/bills')#TemplateResponse(request, 'robokassa/error.html', {'form': form})


class Robokassa(View):
    def get(self, request):
        form = RobokassaForm(initial={
            'OutSum': 10.0,
            'InvId': 1,
            'Desc': 'Name',
            'Email': 'qq@m.ru',
        })
        return render(request, 'pages/robokassa_test.html', {'form': form})


# ## Client management


class EditSetupRequest(View):
    def post(self, request):
        edit_setup_request_form = EditSetupRequestForm(request.POST)

        if not edit_setup_request_form.is_valid():
            print('FAIL: edit_setup_request_form ISNT VALID: %s' % edit_setup_request_form.errors)
            return HttpResponse('FAIL')

        setup_request = None

        try:
            setup_request_id = edit_setup_request_form.cleaned_data['setup_request_id']

            if setup_request_id == '':
                raise KeyError()

            setup_request = SetupRequest.objects.get(id=setup_request_id)
        except (KeyError, ObjectDoesNotExist):
            setup_request = SetupRequest()

        setup_request.organization_name = edit_setup_request_form.cleaned_data['organization_name']
        setup_request.site = edit_setup_request_form.cleaned_data['site']
        setup_request.head_fio = edit_setup_request_form.cleaned_data['head_fio']
        setup_request.head_position = edit_setup_request_form.cleaned_data['head_position']
        setup_request.head_phone_number = edit_setup_request_form.cleaned_data['head_phone_number']
        setup_request.head_email = edit_setup_request_form.cleaned_data['head_email']
        setup_request.tech_fio = edit_setup_request_form.cleaned_data['tech_fio']
        setup_request.tech_phone_number = edit_setup_request_form.cleaned_data['tech_phone_number']
        setup_request.tech_email = edit_setup_request_form.cleaned_data['tech_email']
        setup_request.advanced_info = edit_setup_request_form.cleaned_data['advanced_info']
        # setup_request.status = edit_setup_request_form.cleaned_data['status']

        setup_request.save()

        if request.POST['text'] == '':
            return HttpResponseRedirect(request.path)

        edit_setup_request_history_form = EditSetupRequestHistoryForm(request.POST)

        if not edit_setup_request_history_form.is_valid():
            print 'FAIL: edit_setup_request_history_form ISNT VALID: %s' % edit_setup_request_history_form.errors
            return HttpResponse('FAIL')

        setup_request_history = SetupRequestHistory(setup_request=setup_request,
                                                    text=edit_setup_request_history_form.cleaned_data['text'])
        setup_request_history.save()

        return HttpResponseRedirect(request.path)

    def get(self, request):
        edit_setup_request_form = None
        setup_request_history = []

        try:
            setup_request_id = request.GET['setup_request_id']
            setup_request = SetupRequest.objects.get(id=setup_request_id)

            edit_setup_request_form = EditSetupRequestForm(instance=setup_request,
                                                           initial={'setup_request_id': setup_request.id})

            setup_request_history = SetupRequestHistory.objects.filter(setup_request=setup_request).all()
        except (KeyError, ObjectDoesNotExist):
            edit_setup_request_form = EditSetupRequestForm()

        edit_setup_request_history_form = EditSetupRequestHistoryForm()
        setup_requests = SetupRequest.objects.all()

        return render(request, 'pages/setup_requests_management/edit_setup_requests.html',
                      {'setup_request_form': edit_setup_request_form,
                       'setup_request_history_form': edit_setup_request_history_form,
                       'setup_request_history': setup_request_history,
                       'setup_requests': setup_requests})


# ## Test


class TestEverything(View):
    def get(self, request):
        # jep = JSONPEntryPoint()
        # jep.order_deferred_callback(Widget.objects.first(), '', '-', '--',
        #                             datetime.now() + timedelta(seconds=30))
        return render(request, 'pages/test.html')
        #
