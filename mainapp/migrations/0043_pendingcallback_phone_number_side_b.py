# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0042_auto_20150807_0757'),
    ]

    operations = [
        migrations.AddField(
            model_name='pendingcallback',
            name='phone_number_side_b',
            field=models.CharField(default=b'', max_length=12),
            preserve_default=True,
        ),
    ]
