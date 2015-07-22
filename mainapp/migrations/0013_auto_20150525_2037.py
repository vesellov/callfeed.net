# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0012_auto_20150525_1959'),
    ]

    operations = [
        migrations.AddField(
            model_name='widget',
            name='email_field_flag',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='email_field_is_obligatory_flag',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='name_field_flag',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='name_field_is_obligatory_flag',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='phone_field_flag',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='phone_field_is_obligatory_flag',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='widget',
            name='time_before_callback_sec',
            field=models.IntegerField(default=15),
            preserve_default=True,
        ),
    ]
