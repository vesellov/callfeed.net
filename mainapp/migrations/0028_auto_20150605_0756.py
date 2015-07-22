# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0027_pendingcallback'),
    ]

    operations = [
        migrations.AddField(
            model_name='pendingcallback',
            name='geodata_side_b',
            field=models.CharField(default=b'-', max_length=100),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pendingcallback',
            name='ip_side_b',
            field=models.IPAddressField(default='127.0.0.1'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pendingcallback',
            name='referer',
            field=models.CharField(default='http://google.com', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pendingcallback',
            name='search_request',
            field=models.CharField(default='dongle', max_length=100),
            preserve_default=False,
        ),
    ]
