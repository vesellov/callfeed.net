# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0013_auto_20150525_2037'),
    ]

    operations = [
        migrations.CreateModel(
            name='OperatorDepartment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='operator',
            name='spare_phone_number',
        ),
        migrations.AddField(
            model_name='operator',
            name='email',
            field=models.EmailField(default='aka@aka.com', max_length=255),
            preserve_default=False,
        ),
    ]
