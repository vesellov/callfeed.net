# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0022_bill_price_per_minute'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='widget',
            name='email_field_flag',
        ),
        migrations.RemoveField(
            model_name='widget',
            name='email_field_is_obligatory_flag',
        ),
        migrations.RemoveField(
            model_name='widget',
            name='name_field_flag',
        ),
        migrations.RemoveField(
            model_name='widget',
            name='name_field_is_obligatory_flag',
        ),
        migrations.RemoveField(
            model_name='widget',
            name='phone_field_flag',
        ),
        migrations.RemoveField(
            model_name='widget',
            name='phone_field_is_obligatory_flag',
        ),
        migrations.AlterField(
            model_name='widget',
            name='blacklist_ip',
            field=models.CharField(default=b'', max_length=3000, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='widget',
            name='blacklist_phones',
            field=models.CharField(default=b'', max_length=3000, blank=True),
            preserve_default=True,
        ),
    ]
