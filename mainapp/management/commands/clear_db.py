from django.core.management import BaseCommand
from mainapp.models import Client, Reseller, AdministrativeManager, Operator, Tariff, Widget, CallbackInfo, Schedule

__author__ = 'max'


class Command(BaseCommand):
    def handle(self, *args, **options):
        Client.objects.all().delete()
        Reseller.objects.all().delete()
        AdministrativeManager.objects.all().delete()
        Operator.objects.all().delete()
        Tariff.objects.all().delete()
        Widget.objects.all().delete()
        CallbackInfo.objects.all().delete()
        Schedule.objects.all().delete()