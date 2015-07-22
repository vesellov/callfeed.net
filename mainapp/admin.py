from django.contrib import admin

# Register your models here.
from mainapp import models

admin.site.register(models.AdministrativeManager)
admin.site.register(models.CallbackInfo)
admin.site.register(models.Client)
admin.site.register(models.Operator)
admin.site.register(models.Reseller)
admin.site.register(models.Schedule)
admin.site.register(models.Tariff)
admin.site.register(models.Widget)
admin.site.register(models.Bill)
admin.site.register(models.PendingCallback)
