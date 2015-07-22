# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0015_auto_20150528_1909'),
    ]

    operations = [
        migrations.AddField(
            model_name='widget',
            name='default_operator',
            field=models.OneToOneField(null=True, blank=True, to='mainapp.Operator'),
            preserve_default=True,
        ),
    ]
