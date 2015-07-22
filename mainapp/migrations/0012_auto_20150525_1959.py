# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0011_widget_is_raw'),
    ]

    operations = [
        migrations.AddField(
            model_name='widget',
            name='blacklist_ip',
            field=models.CharField(default=b'', max_length=3000),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='blacklist_phones',
            field=models.CharField(default=b'', max_length=3000),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='delay_before_callback_from_a_to_b',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='delay_before_callback_to_additional_number',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='disable_on_mobiles',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='geo_filter',
            field=models.CharField(default=b'all', max_length=20, choices=[(b'all', b'All')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='operator_incoming_number',
            field=models.CharField(default=b'callfeed', max_length=8, choices=[(b'callfeed', b'Callfeed'), (b'client', b'Client')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='speak_site_name',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='time_before_callback_sec',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
