# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0049_auto_20150810_1505'),
    ]

    operations = [
        migrations.AlterField(
            model_name='widget',
            name='is_email_notification_on',
            field=models.BooleanField(default=True, verbose_name=b'\xd0\x9f\xd0\xbe\xd0\xbb\xd1\x83\xd1\x87\xd0\xb0\xd1\x82\xd1\x8c email \xd1\x83\xd0\xb2\xd0\xb5\xd0\xb4\xd0\xbe\xd0\xbc\xd0\xbb\xd0\xb5\xd0\xbd\xd0\xb8\xd1\x8f'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='widget',
            name='is_operator_name_included',
            field=models.BooleanField(default=True, verbose_name=b'\xd0\x92\xd0\xba\xd0\xbb\xd1\x8e\xd1\x87\xd0\xb0\xd1\x82\xd1\x8c \xd0\xb8\xd0\xbc\xd1\x8f \xd0\xbe\xd0\xbf\xd0\xb5\xd1\x80\xd0\xb0\xd1\x82\xd0\xbe\xd1\x80\xd0\xb0 \xd0\xb2 SMS'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='widget',
            name='is_operator_shown_in_widget',
            field=models.BooleanField(default=True, verbose_name=b'\xd0\x9f\xd0\xbe\xd0\xba\xd0\xb0\xd0\xb7\xd1\x8b\xd0\xb2\xd0\xb0\xd1\x82\xd1\x8c \xd0\xb2 \xd0\xb2\xd0\xb8\xd0\xb4\xd0\xb6\xd0\xb5\xd1\x82\xd0\xb5 \xd0\xb8\xd0\xbd\xd1\x84\xd0\xbe\xd1\x80\xd0\xbc\xd0\xb0\xd1\x86\xd0\xb8\xd1\x8e \xd0\xbe\xd0\xb1 \xd0\xbe\xd0\xbf\xd0\xb5\xd1\x80\xd0\xb0\xd1\x82\xd0\xbe\xd1\x80\xd0\xb5'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='widget',
            name='is_sms_notification_on',
            field=models.BooleanField(default=True, verbose_name=b'\xd0\x9f\xd0\xbe\xd0\xbb\xd1\x83\xd1\x87\xd0\xb0\xd1\x82\xd1\x8c SMS-\xd1\x83\xd0\xb2\xd0\xb5\xd0\xb4\xd0\xbe\xd0\xbc\xd0\xbb\xd0\xb5\xd0\xbd\xd0\xb8\xd1\x8f'),
            preserve_default=True,
        ),
    ]
