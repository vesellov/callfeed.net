# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0004_auto_20150521_0019'),
    ]

    operations = [
        migrations.CreateModel(
            name='CallbackInfo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('call_description', models.CharField(max_length=255)),
                ('phone_number_side_a', models.CharField(max_length=20)),
                ('phone_number_side_b', models.CharField(max_length=20)),
                ('charged_length_a_sec', models.IntegerField()),
                ('charged_length_b_sec', models.IntegerField()),
                ('real_length_a_sec', models.IntegerField()),
                ('real_length_b_sec', models.IntegerField()),
                ('record_url_a', models.CharField(max_length=255)),
                ('record_url_b', models.CharField(max_length=255)),
                ('waiting_period_a_sec', models.IntegerField()),
                ('waiting_period_b_sec', models.IntegerField()),
                ('callback_status', models.CharField(max_length=20)),
                ('cost', models.DecimalField(max_digits=12, decimal_places=2)),
                ('currency', models.CharField(max_length=3)),
                ('ip_side_b', models.IPAddressField()),
                ('mtt_callback_call_id', models.CharField(max_length=50)),
                ('referer', models.CharField(max_length=255)),
                ('when', models.DateTimeField()),
                ('widget', models.ForeignKey(to='mainapp.Widget')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
