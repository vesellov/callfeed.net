# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0005_callbackinfo'),
    ]

    operations = [
        migrations.AddField(
            model_name='callbackinfo',
            name='geodata',
            field=models.CharField(default=b'-', max_length=100),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='search_request',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
    ]
