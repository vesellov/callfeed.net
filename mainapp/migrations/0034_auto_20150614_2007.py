# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from decimal import Decimal


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0033_auto_20150613_2110'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='deferredcallback',
            name='widget',
        ),
        migrations.DeleteModel(
            name='DeferredCallback',
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='planned_for_datetime',
            field=models.DateTimeField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='widget',
            name='is_operator_shown_in_widget',
            field=models.BooleanField(default=True, verbose_name=b'\xd0\x9f\xd0\xbe\xd0\xba\xd0\xb0\xd0\xb7\xd1\x8b\xd0\xb2\xd0\xb0\xd1\x82\xd1\x8c \xd0\xb2 \xd0\xb2\xd0\xb8\xd0\xb4\xd0\xb6\xd0\xb5\xd1\x82\xd0\xb5 \xd0\xb8\xd0\xbd\xd1\x84\xd0\xbe\xd1\x80\xd0\xbc\xd0\xb0\xd1\x86\xd0\xb8\xd1\x8e \xd0\xbe\xd0\xb1 \xd0\xbe\xd0\xbf\xd0\xb5\xd1\x80\xd0\xb0\xd1\x82\xd0\xbe\xd1\x80\xd0\xb5'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='call_description',
            field=models.CharField(default=b'', max_length=255),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='callback_status',
            field=models.CharField(default=b'planned', max_length=20, verbose_name=b'\xd0\xa1\xd1\x82\xd0\xb0\xd1\x82\xd1\x83\xd1\x81 \xd0\xb7\xd0\xb2\xd0\xbe\xd0\xbd\xd0\xba\xd0\xb0', choices=[(b'succeed', b'\xd0\x97\xd0\xb2\xd0\xbe\xd0\xbd\xd0\xbe\xd0\xba \xd0\xbf\xd1\x80\xd0\xbe\xd1\x88\xd1\x91\xd0\xbb \xd1\x83\xd1\x81\xd0\xbf\xd0\xb5\xd1\x88\xd0\xbd\xd0\xbe'), (b'planned', b'\xd0\x97\xd0\xb0\xd0\xbf\xd0\xbb\xd0\xb0\xd0\xbd\xd0\xb8\xd1\x80\xd0\xbe\xd0\xb2\xd0\xb0\xd0\xbd'), (b'fail_a', b'\xd0\x9e\xd0\xbf\xd0\xb5\xd1\x80\xd0\xb0\xd1\x82\xd0\xbe\xd1\x80 \xd0\xbd\xd0\xb5 \xd0\xb2\xd0\xb7\xd1\x8f\xd0\xbb \xd1\x82\xd1\x80\xd1\x83\xd0\xb1\xd0\xba\xd1\x83'), (b'fail_b', b'\xd0\x9a\xd0\xbb\xd0\xb8\xd0\xb5\xd0\xbd\xd1\x82 \xd0\xbd\xd0\xb5 \xd0\xb2\xd0\xb7\xd1\x8f\xd0\xbb \xd1\x82\xd1\x80\xd1\x83\xd0\xb1\xd0\xba\xd1\x83'), (b'out_of_balance', b'\xd0\x9d\xd0\xb5\xd0\xb4\xd0\xbe\xd1\x81\xd1\x82\xd0\xb0\xd1\x82\xd0\xbe\xd1\x87\xd0\xbd\xd0\xbe \xd0\xbc\xd0\xb8\xd0\xbd\xd1\x83\xd1\x82')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='charged_length_a_sec',
            field=models.IntegerField(default=0, verbose_name=b'\xd0\xa1\xd0\xbf\xd0\xb8\xd1\x81\xd0\xb0\xd0\xbd\xd0\xbd\xd0\xb0\xd1\x8f \xd0\xb4\xd0\xbb\xd0\xb8\xd0\xbd\xd0\xb0 \xd1\x80\xd0\xb0\xd0\xb7\xd0\xb3\xd0\xbe\xd0\xb2\xd0\xbe\xd1\x80\xd0\xb0 \xd0\xbd\xd0\xb0 \xd1\x81\xd1\x82\xd0\xbe\xd1\x80\xd0\xbe\xd0\xbd\xd0\xb5 \xd0\xbe\xd0\xbf\xd0\xb5\xd1\x80\xd0\xb0\xd1\x82\xd0\xbe\xd1\x80\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='charged_length_b_sec',
            field=models.IntegerField(default=0, verbose_name=b'\xd0\xa1\xd0\xbf\xd0\xb8\xd1\x81\xd0\xb0\xd0\xbd\xd0\xbd\xd0\xb0\xd1\x8f \xd0\xb4\xd0\xbb\xd0\xb8\xd0\xbd\xd0\xb0 \xd1\x80\xd0\xb0\xd0\xb7\xd0\xb3\xd0\xbe\xd0\xb2\xd0\xbe\xd1\x80\xd0\xb0 \xd0\xbd\xd0\xb0 \xd1\x81\xd1\x82\xd0\xbe\xd1\x80\xd0\xbe\xd0\xbd\xd0\xb5 \xd0\xba\xd0\xbb\xd0\xb8\xd0\xb5\xd0\xbd\xd1\x82\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='cost',
            field=models.DecimalField(default=Decimal('0'), verbose_name=b'\xd0\xa1\xd1\x82\xd0\xbe\xd0\xb8\xd0\xbc\xd0\xbe\xd1\x81\xd1\x82\xd1\x8c', max_digits=12, decimal_places=2),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='currency',
            field=models.CharField(default=b'', max_length=3, verbose_name=b'\xd0\x92\xd0\xb0\xd0\xbb\xd1\x8e\xd1\x82\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='geodata_side_b',
            field=models.CharField(default=b'', max_length=100, verbose_name=b'\xd0\x93\xd0\xb5\xd0\xbe\xd0\xb4\xd0\xb0\xd1\x82\xd0\xb0 \xd0\xba\xd0\xbb\xd0\xb8\xd0\xb5\xd0\xbd\xd1\x82\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='ip_side_b',
            field=models.IPAddressField(default=b'', verbose_name=b'IP-\xd0\xb0\xd0\xb4\xd1\x80\xd0\xb5\xd1\x81 \xd0\xba\xd0\xbb\xd0\xb8\xd0\xb5\xd0\xbd\xd1\x82\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='mtt_callback_call_id',
            field=models.CharField(default=b'', max_length=50),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='phone_number_side_a',
            field=models.CharField(default=b'', max_length=20, verbose_name=b'\xd0\x9d\xd0\xbe\xd0\xbc\xd0\xb5\xd1\x80 \xd1\x82\xd0\xb5\xd0\xbb\xd0\xb5\xd1\x84\xd0\xbe\xd0\xbd\xd0\xb0 \xd0\xbe\xd0\xbf\xd0\xb5\xd1\x80\xd0\xb0\xd1\x82\xd0\xbe\xd1\x80\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='phone_number_side_b',
            field=models.CharField(default=b'', max_length=20, verbose_name=b'\xd0\x9d\xd0\xbe\xd0\xbc\xd0\xb5\xd1\x80 \xd1\x82\xd0\xb5\xd0\xbb\xd0\xb5\xd1\x84\xd0\xbe\xd0\xbd\xd0\xb0 \xd0\xba\xd0\xbb\xd0\xb8\xd0\xb5\xd0\xbd\xd1\x82\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='real_length_a_sec',
            field=models.IntegerField(default=0, verbose_name=b'\xd0\xa0\xd0\xb5\xd0\xb0\xd0\xbb\xd1\x8c\xd0\xbd\xd0\xb0\xd1\x8f \xd0\xb4\xd0\xbb\xd0\xb8\xd0\xbd\xd0\xb0 \xd1\x80\xd0\xb0\xd0\xb7\xd0\xb3\xd0\xbe\xd0\xb2\xd0\xbe\xd1\x80\xd0\xb0 \xd0\xbd\xd0\xb0 \xd1\x81\xd1\x82\xd0\xbe\xd1\x80\xd0\xbe\xd0\xbd\xd0\xb5 \xd0\xbe\xd0\xbf\xd0\xb5\xd1\x80\xd0\xb0\xd1\x82\xd0\xbe\xd1\x80\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='real_length_b_sec',
            field=models.IntegerField(default=0, verbose_name=b'\xd0\xa0\xd0\xb5\xd0\xb0\xd0\xbb\xd1\x8c\xd0\xbd\xd0\xb0\xd1\x8f \xd0\xb4\xd0\xbb\xd0\xb8\xd0\xbd\xd0\xb0 \xd1\x80\xd0\xb0\xd0\xb7\xd0\xb3\xd0\xbe\xd0\xb2\xd0\xbe\xd1\x80\xd0\xb0 \xd0\xbd\xd0\xb0 \xd1\x81\xd1\x82\xd0\xbe\xd1\x80\xd0\xbe\xd0\xbd\xd0\xb5 \xd0\xba\xd0\xbb\xd0\xb8\xd0\xb5\xd0\xbd\xd1\x82\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='record_url_a',
            field=models.CharField(default=b'', max_length=255, verbose_name=b'\xd0\xa1\xd1\x81\xd1\x8b\xd0\xbb\xd0\xba\xd0\xb0 \xd0\xbd\xd0\xb0 \xd0\xb7\xd0\xb0\xd0\xbf\xd0\xb8\xd1\x81\xd1\x8c \xd1\x80\xd0\xb0\xd0\xb7\xd0\xb3\xd0\xbe\xd0\xb2\xd0\xbe\xd1\x80\xd0\xb0 \xd0\xbe\xd0\xbf\xd0\xb5\xd1\x80\xd0\xb0\xd1\x82\xd0\xbe\xd1\x80\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='record_url_b',
            field=models.CharField(default=b'', max_length=255, verbose_name=b'\xd0\xa1\xd1\x81\xd1\x8b\xd0\xbb\xd0\xba\xd0\xb0 \xd0\xbd\xd0\xb0 \xd0\xb7\xd0\xb0\xd0\xbf\xd0\xb8\xd1\x81\xd1\x8c \xd1\x80\xd0\xb0\xd0\xb7\xd0\xb3\xd0\xbe\xd0\xb2\xd0\xbe\xd1\x80\xd0\xb0 \xd0\xba\xd0\xbb\xd0\xb8\xd0\xb5\xd0\xbd\xd1\x82\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='referer',
            field=models.CharField(default=b'', max_length=255, verbose_name=b'\xd0\x98\xd1\x81\xd1\x82\xd0\xbe\xd1\x87\xd0\xbd\xd0\xb8\xd0\xba \xd0\xbf\xd0\xb5\xd1\x80\xd0\xb5\xd1\x85\xd0\xbe\xd0\xb4\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='search_request',
            field=models.CharField(default=b'', max_length=100, verbose_name=b'\xd0\x9f\xd0\xbe\xd0\xb8\xd1\x81\xd0\xba\xd0\xbe\xd0\xb2\xd1\x8b\xd0\xb9 \xd0\xb7\xd0\xb0\xd0\xbf\xd1\x80\xd0\xbe\xd1\x81'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='waiting_period_a_sec',
            field=models.IntegerField(default=0, verbose_name=b'\xd0\x9f\xd0\xb5\xd1\x80\xd0\xb8\xd0\xbe\xd0\xb4 \xd0\xbe\xd0\xb6\xd0\xb8\xd0\xb4\xd0\xb0\xd0\xbd\xd0\xb8\xd1\x8f \xd1\x81\xd0\xbe \xd1\x81\xd1\x82\xd0\xbe\xd1\x80\xd0\xbe\xd0\xbd\xd1\x8b \xd0\xbe\xd0\xbf\xd0\xb5\xd1\x80\xd0\xb0\xd1\x82\xd0\xbe\xd1\x80\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='waiting_period_b_sec',
            field=models.IntegerField(default=0, verbose_name=b'\xd0\x9f\xd0\xb5\xd1\x80\xd0\xb8\xd0\xbe\xd0\xb4 \xd0\xbe\xd0\xb6\xd0\xb8\xd0\xb4\xd0\xb0\xd0\xbd\xd0\xb8\xd1\x8f \xd1\x81\xd0\xbe \xd1\x81\xd1\x82\xd0\xbe\xd1\x80\xd0\xbe\xd0\xbd\xd1\x8b \xd0\xba\xd0\xbb\xd0\xb8\xd0\xb5\xd0\xbd\xd1\x82\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='when',
            field=models.DateTimeField(null=True, verbose_name=b'\xd0\x9a\xd0\xbe\xd0\xb3\xd0\xb4\xd0\xb0', blank=True),
            preserve_default=True,
        ),
    ]
