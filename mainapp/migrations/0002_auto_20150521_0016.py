# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='callbackinfo',
            old_name='total_price',
            new_name='cost',
        ),
        migrations.RemoveField(
            model_name='callbackinfo',
            name='call_duration_min',
        ),
        migrations.RemoveField(
            model_name='schedule',
            name='time_zone',
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='call_description',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='callback_status',
            field=models.CharField(default='', max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='charged_length_a_sec',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='charged_length_b_sec',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='currency',
            field=models.CharField(default='', max_length=3),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='real_length_a_sec',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='real_length_b_sec',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='record_url_a',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='record_url_b',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='referer',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='waiting_period_a_sec',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='waiting_period_b_sec',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='client',
            name='free_minutes',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='client',
            name='name',
            field=models.CharField(max_length=35, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='operator',
            name='photo_url',
            field=models.CharField(max_length=255, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='schedule',
            name='timezone',
            field=models.IntegerField(default=3),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='tariff',
            name='free_minutes',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='widget',
            name='callback_type',
            field=models.CharField(default=b'ringall', max_length=10, choices=[(b'ringall', b'ringall'), (b'linear', b'linear')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='timeout_sec',
            field=models.IntegerField(default=10),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='token',
            field=models.CharField(default='', max_length=16),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='schedule',
            name='friday',
            field=models.CharField(max_length=11, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='schedule',
            name='monday',
            field=models.CharField(max_length=11, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='schedule',
            name='saturday',
            field=models.CharField(max_length=11, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='schedule',
            name='sunday',
            field=models.CharField(max_length=11, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='schedule',
            name='thursday',
            field=models.CharField(max_length=11, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='schedule',
            name='tuesday',
            field=models.CharField(max_length=11, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='schedule',
            name='wednesday',
            field=models.CharField(max_length=11, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='widget',
            name='settings',
            field=models.CharField(max_length=5000),
            preserve_default=True,
        ),
    ]
