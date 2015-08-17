# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0041_auto_20150807_0735'),
    ]

    operations = [
        migrations.AddField(
            model_name='pendingcallback',
            name='tracking_history',
            field=models.CharField(default=b'', max_length=200),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='pendingcallback',
            name='when',
            field=models.DateTimeField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
