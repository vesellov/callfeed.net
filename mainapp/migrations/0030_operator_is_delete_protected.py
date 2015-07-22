# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0029_auto_20150605_1757'),
    ]

    operations = [
        migrations.AddField(
            model_name='operator',
            name='is_delete_protected',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
