# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0023_auto_20150601_1935'),
    ]

    operations = [
        migrations.AddField(
            model_name='widget',
            name='is_installed',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
