# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0007_auto_20150521_0044'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='operator',
            name='widget',
        ),
        migrations.RemoveField(
            model_name='widget',
            name='balance_minutes',
        ),
        migrations.AddField(
            model_name='client',
            name='balance_minutes',
            field=models.IntegerField(default=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='operator',
            name='client',
            field=models.ForeignKey(default=1, to='mainapp.Client'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='operator',
            name='position',
            field=models.CharField(default='Manager', max_length=35),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='callback_status',
            field=models.CharField(max_length=20, choices=[(b'succeed', b'Succeed'), (b'planned', b'Planned'), (b'fail_a', b'Fail, side A'), (b'fail_b', b'Fail, side B'), (b'out_of_balance', b'Out of balance')]),
            preserve_default=True,
        ),
    ]
