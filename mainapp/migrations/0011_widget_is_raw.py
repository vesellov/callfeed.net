# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0010_auto_20150525_1511'),
    ]

    operations = [
        migrations.AddField(
            model_name='widget',
            name='is_raw',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
