# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AdministrativeManager',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=35)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CallbackInfo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('phone_number_side_a', models.CharField(max_length=20)),
                ('phone_number_side_b', models.CharField(max_length=20)),
                ('ip_side_b', models.IPAddressField()),
                ('mtt_callback_call_id', models.CharField(max_length=50)),
                ('call_duration_min', models.IntegerField()),
                ('total_price', models.DecimalField(max_digits=12, decimal_places=2)),
                ('when', models.DateTimeField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email', models.EmailField(max_length=255)),
                ('phone_number', models.CharField(max_length=20)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='IPBlackList',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ip', models.IPAddressField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='NotificationPhonesList',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('phone_number', models.CharField(max_length=20)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Operator',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=35)),
                ('phone_number', models.CharField(max_length=20)),
                ('spare_phone_number', models.CharField(max_length=20, null=True, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PhoneBlackList',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('phone_number', models.CharField(max_length=20)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Reseller',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=35)),
                ('administrative_manager', models.ForeignKey(to='mainapp.AdministrativeManager')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Schedule',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('time_zone', models.IntegerField()),
                ('monday', models.CharField(max_length=10, null=True, blank=True)),
                ('tuesday', models.CharField(max_length=10, null=True, blank=True)),
                ('wednesday', models.CharField(max_length=10, null=True, blank=True)),
                ('thursday', models.CharField(max_length=10, null=True, blank=True)),
                ('friday', models.CharField(max_length=10, null=True, blank=True)),
                ('saturday', models.CharField(max_length=10, null=True, blank=True)),
                ('sunday', models.CharField(max_length=10, null=True, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Tariff',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=20)),
                ('description', models.TextField(null=True, blank=True)),
                ('price_per_minute', models.DecimalField(max_digits=12, decimal_places=2)),
                ('minutes', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Widget',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('settings', models.CharField(max_length=255)),
                ('site_url', models.URLField()),
                ('notification_email', models.EmailField(max_length=255)),
                ('is_active', models.BooleanField(default=True)),
                ('is_email_notification_on', models.BooleanField(default=False)),
                ('is_sms_notification_on', models.BooleanField(default=False)),
                ('is_operator_name_included', models.BooleanField(default=False)),
                ('balance_minutes', models.IntegerField()),
                ('client', models.ForeignKey(to='mainapp.Client')),
                ('schedule', models.OneToOneField(to='mainapp.Schedule')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='reseller',
            name='tariff',
            field=models.OneToOneField(null=True, blank=True, to='mainapp.Tariff'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='reseller',
            name='user',
            field=models.OneToOneField(to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='phoneblacklist',
            name='widget',
            field=models.ForeignKey(blank=True, to='mainapp.Widget', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='operator',
            name='widget',
            field=models.ForeignKey(to='mainapp.Widget'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='notificationphoneslist',
            name='widget',
            field=models.ForeignKey(blank=True, to='mainapp.Widget', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='ipblacklist',
            name='widget',
            field=models.ForeignKey(blank=True, to='mainapp.Widget', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='client',
            name='reseller',
            field=models.ForeignKey(blank=True, to='mainapp.Reseller', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='client',
            name='user',
            field=models.OneToOneField(to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='callbackinfo',
            name='widget',
            field=models.ForeignKey(to='mainapp.Widget'),
            preserve_default=True,
        ),
    ]
