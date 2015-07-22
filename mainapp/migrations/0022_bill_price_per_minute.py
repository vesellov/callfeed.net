# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0021_auto_20150531_1904'),
    ]

    operations = [
        migrations.AddField(
            model_name='bill',
            name='price_per_minute',
            field=models.DecimalField(default=19, max_digits=12, decimal_places=2),
            preserve_default=False,
        ),
    ]
