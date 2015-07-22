# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0026_auto_20150604_2258'),
    ]

    operations = [
        migrations.CreateModel(
            name='PendingCallback',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('mtt_callback_call_id', models.CharField(max_length=50)),
                ('when', models.DateTimeField()),
                ('widget', models.ForeignKey(to='mainapp.Widget')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
