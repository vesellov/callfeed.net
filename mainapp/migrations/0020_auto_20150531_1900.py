# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0019_bill_payment_method'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reseller',
            name='tariff',
        ),
        migrations.AddField(
            model_name='reseller',
            name='price_per_minute',
            field=models.DecimalField(default=11, max_digits=12, decimal_places=2),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='reseller',
            name='tariff_web',
            field=models.ManyToManyField(to='mainapp.Tariff', null=True, blank=True),
            preserve_default=True,
        ),
    ]
