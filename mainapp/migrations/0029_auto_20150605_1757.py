# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0028_auto_20150605_0756'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='widget',
            name='notification_email',
        ),
        migrations.AlterField(
            model_name='widget',
            name='callback_type',
            field=models.CharField(default=b'ringall', max_length=10, choices=[(b'ringall', b'Ringall'), (b'linear', b'Linear')]),
            preserve_default=True,
        ),
    ]
