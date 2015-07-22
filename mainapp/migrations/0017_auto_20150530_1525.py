# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0016_widget_default_operator'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='receive_email_notifications_flag',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='client',
            name='receive_sms_notifications_flag',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
