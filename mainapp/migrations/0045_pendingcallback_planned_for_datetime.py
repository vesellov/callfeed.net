# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0044_pendingcallback_callback_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='pendingcallback',
            name='planned_for_datetime',
            field=models.DateTimeField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
