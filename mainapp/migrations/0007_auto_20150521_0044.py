# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0006_auto_20150521_0044'),
    ]

    operations = [
        migrations.RenameField(
            model_name='callbackinfo',
            old_name='geodata',
            new_name='geodata_side_b',
        ),
    ]
