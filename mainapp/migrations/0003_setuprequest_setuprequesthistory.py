# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0002_auto_20150521_0016'),
    ]

    operations = [
        migrations.CreateModel(
            name='SetupRequest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('organization_name', models.CharField(max_length=50)),
                ('site', models.CharField(max_length=50)),
                ('head_fio', models.CharField(max_length=60, null=True, blank=True)),
                ('head_position', models.CharField(max_length=20, null=True, blank=True)),
                ('head_phone_number', models.CharField(max_length=50, null=True, blank=True)),
                ('head_email', models.CharField(max_length=30, null=True, blank=True)),
                ('tech_fio', models.CharField(max_length=30, null=True, blank=True)),
                ('tech_phone_number', models.CharField(max_length=50, null=True, blank=True)),
                ('tech_email', models.CharField(max_length=30, null=True, blank=True)),
                ('advanced_info', models.CharField(max_length=500, null=True, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SetupRequestHistory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('when', models.DateTimeField(default=datetime.datetime.now)),
                ('text', models.CharField(max_length=250)),
                ('setup_request', models.ForeignKey(blank=True, to='mainapp.SetupRequest', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
