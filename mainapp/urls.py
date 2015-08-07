from django.conf.urls import patterns, url, include
from django.contrib.auth.views import password_reset, password_reset_done
from django.views.generic import TemplateView, RedirectView

from mainapp.views import LoginAccount, TestEverything, EditSetupRequest, ClientCallbacks, \
    ClientWidgetOptions, ClientWidgetParameters, ClientWidgetContactsForm, ClientWidgets, ClientWidgetDesign, \
    ClientWidgetDepartments, ClientOperators, ClientOperatorsEdit, ClientOperatorsDelete, ClientWidgetCode, \
    ClientWidgetNotifications, ClientWidgetContent, ClientInfoPersonal, ClientInfoSecurity, ClientInfoBills, \
    ClientPaymentChooseTariff, ClientInfoBillsRequestAct, ClientPaymentChooseMethod, ClientPaymentRequestCashless, \
    ClientPaymentMake, ClientPaymentCancel, ClientWidgetDelete, ClientWidgetNew, ClientWidgetActions, \
    ClientWidgetToggleActivity, ClientWidgetCheck, PasswordReset, PasswordResetConfirmation, RobokassaResultReceived, \
    RobokassaSuccess, RobokassaFail, ResellerWidgetCheck
from mainapp.views import AccountsClientRegister
from mainapp.views import Robokassa
from mainapp.views import RegisterResellerAccount
from mainapp.views import LogoutAccount
from mainapp.views import ProfileAccountAdministrativeManager
from mainapp.views import ProfileReseller
from mainapp.views import AdministrativeManagerEditResellers
from mainapp.views import ResellerEditClients
from mainapp.jsonpserver import JSONPEntryPoint
from mainapp.trackingserver import track_by_id

__author__ = 'max'

urlpatterns = patterns(
    #
    url(r'^fuck_you_stupid_django/?$', TestEverything.as_view()),
    # BackEnd servers
    url(r'^input', JSONPEntryPoint.as_view()), 
    url(r'^tracking/(?P<id>[0-9]+)/event.php$', track_by_id),
    # Accounts related staff
    url(r'^accounts/login/?$', LoginAccount.as_view()),
    url(r'^accounts/logout/?$', LogoutAccount.as_view()),
    url(r'^accounts/password/reset/?$', PasswordReset.as_view()),
    url(r'^accounts/password/reset/confirmation/?$', PasswordResetConfirmation.as_view()),
    url(r'^accounts/disabled/?$', TemplateView.as_view(template_name='pages/accounts/disabled.html')),
    url(r'^accounts/client/register/?$', AccountsClientRegister.as_view()),
    url(r'^accounts/reseller/register/?$', RegisterResellerAccount.as_view()),
    # Administrative manager related staff
    url(r'^profile/administrative_manager/?$', ProfileAccountAdministrativeManager.as_view()),
    url(r'^profile/administrative_manager/edit_resellers/?$',
        AdministrativeManagerEditResellers.as_view()),
    # Reseller related staff
    url(r'^profile/reseller/?$', ProfileReseller.as_view()),
    url(r'^profile/reseller/edit_clients/?$', ResellerEditClients.as_view()),
    url(r'^profile/reseller/widget_check/?$', ResellerWidgetCheck.as_view()),
    # Client related staff
    url(r'^profile/client/?$', RedirectView.as_view(url='/profile/client/widgets')),
    url(r'^profile/client/info/personal/?$', ClientInfoPersonal.as_view()),
    url(r'^profile/client/info/security/?$', ClientInfoSecurity.as_view()),
    url(r'^profile/client/info/bills/?$', ClientInfoBills.as_view()),
    url(r'^profile/client/info/bills/request_act/?$', ClientInfoBillsRequestAct.as_view()),
    url(r'^profile/client/payment/choose_tariff/?$', ClientPaymentChooseTariff.as_view()),
    url(r'^profile/client/payment/choose_method/?$', ClientPaymentChooseMethod.as_view()),
    url(r'^profile/client/payment/make/?$', ClientPaymentMake.as_view()),
    url(r'^profile/client/payment/request_cashless/?$', ClientPaymentRequestCashless.as_view()),
    url(r'^profile/client/payment/cancel/?$', ClientPaymentCancel.as_view()),
    url(r'^profile/client/callbacks/?$', ClientCallbacks.as_view()),
    url(r'^profile/client/widgets/?$', ClientWidgets.as_view()),
    url(r'^profile/client/operators/?$', ClientOperators.as_view()),
    url(r'^profile/client/operators/edit/?$', ClientOperatorsEdit.as_view()),
    url(r'^profile/client/operators/delete/?$', ClientOperatorsDelete.as_view()),
    url(r'^profile/client/widget/new/?$', ClientWidgetNew.as_view()),
    url(r'^profile/client/widget/delete/?$', ClientWidgetDelete.as_view()),
    url(r'^profile/client/widget/check/?$', ClientWidgetCheck.as_view()),
    url(r'^profile/client/widget/options/?$', ClientWidgetOptions.as_view()),
    url(r'^profile/client/widget/design/?$', ClientWidgetDesign.as_view()),
    url(r'^profile/client/widget/notifications/?$', ClientWidgetNotifications.as_view()),
    url(r'^profile/client/widget/actions/?$', ClientWidgetActions.as_view()),
    url(r'^profile/client/widget/parameters/?$', ClientWidgetParameters.as_view()),
    url(r'^profile/client/widget/departments/?$', ClientWidgetDepartments.as_view()),
    url(r'^profile/client/widget/contact_form/?$', ClientWidgetContactsForm.as_view()),
    url(r'^profile/client/widget/content/?$', ClientWidgetContent.as_view()),
    url(r'^profile/client/widget/code/?$', ClientWidgetCode.as_view()),
    url(r'^profile/client/widget/toggle_activity/?$', ClientWidgetToggleActivity.as_view()),
    #
    # Client management
    url(r'^profile/manager/setup_requests/?$', EditSetupRequest.as_view()),
    # Robokassa
    # url(r'^payment/', include('robokassa.urls')),
    url(r'^payment/result/?$', RobokassaResultReceived.as_view()),
    url(r'^payment/success/?$', RobokassaSuccess.as_view()),
    url(r'^payment/fail/?$', RobokassaFail.as_view()),
    url(r'^robokassa_test$', Robokassa.as_view()),
    # Test page
    url(r'^index_test/?$', TemplateView.as_view(template_name='pages/index_test.html')),
    # The main page
    url(r'^$', TemplateView.as_view(template_name='pages/index.html')),
    # FAQ page
    url(r'^faq/?$', TemplateView.as_view(template_name='pages/faq.html')),
    # Technologies page
    url(r'^technologies/?$', TemplateView.as_view(template_name='pages/technologies.html')),
    # Test
    url(r'^test/?$', TestEverything.as_view()),
)
