# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0017_auto_20150530_1525'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bill',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('when', models.DateTimeField()),
                ('minutes', models.IntegerField()),
                ('sum', models.DecimalField(max_digits=12, decimal_places=2)),
                ('status', models.CharField(default=b'unpaid', max_length=10, choices=[(b'paid', b'Paid'), (b'unpaid', b'Unpaid')])),
                ('client', models.ForeignKey(blank=True, to='mainapp.Client', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='ipblacklist',
            name='widget',
        ),
        migrations.DeleteModel(
            name='IPBlackList',
        ),
        migrations.RemoveField(
            model_name='phoneblacklist',
            name='widget',
        ),
        migrations.DeleteModel(
            name='PhoneBlackList',
        ),
    ]
