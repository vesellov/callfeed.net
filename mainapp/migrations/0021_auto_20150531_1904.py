# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0020_auto_20150531_1900'),
    ]

    operations = [
        migrations.RenameField(
            model_name='reseller',
            old_name='price_per_minute',
            new_name='price_per_minute_rub',
        ),
    ]
