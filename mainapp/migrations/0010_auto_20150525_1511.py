# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0009_auto_20150525_1444'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='widget',
            name='timeout_sec',
        ),
        migrations.RemoveField(
            model_name='widget',
            name='token',
        ),
        migrations.AlterField(
            model_name='widget',
            name='notification_email',
            field=models.EmailField(max_length=255, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='widget',
            name='schedule',
            field=models.OneToOneField(null=True, blank=True, to='mainapp.Schedule'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='widget',
            name='settings',
            field=models.CharField(max_length=5000, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='widget',
            name='site_url',
            field=models.URLField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
