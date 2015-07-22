# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0032_auto_20150610_1520'),
    ]

    operations = [
        migrations.CreateModel(
            name='DeferredCallback',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ip_side_b', models.IPAddressField()),
                ('geodata_side_b', models.CharField(default=b'-', max_length=100)),
                ('referer', models.CharField(max_length=255)),
                ('search_request', models.CharField(max_length=100)),
                ('when_ordered', models.DateTimeField()),
                ('asked_callback_for_datetime', models.DateTimeField()),
                ('widget', models.ForeignKey(to='mainapp.Widget')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='callbackinfo',
            name='callback_status',
            field=models.CharField(max_length=20, verbose_name=b'\xd0\xa1\xd1\x82\xd0\xb0\xd1\x82\xd1\x83\xd1\x81 \xd0\xb7\xd0\xb2\xd0\xbe\xd0\xbd\xd0\xba\xd0\xb0', choices=[(b'succeed', b'\xd0\x97\xd0\xb2\xd0\xbe\xd0\xbd\xd0\xbe\xd0\xba \xd0\xbf\xd1\x80\xd0\xbe\xd1\x88\xd1\x91\xd0\xbb \xd1\x83\xd1\x81\xd0\xbf\xd0\xb5\xd1\x88\xd0\xbd\xd0\xbe'), (b'planned', b'\xd0\x97\xd0\xb0\xd0\xbf\xd0\xbb\xd0\xb0\xd0\xbd\xd0\xb8\xd1\x80\xd0\xbe\xd0\xb2\xd0\xb0\xd0\xbd'), (b'fail_a', b'\xd0\x9e\xd0\xbf\xd0\xb5\xd1\x80\xd0\xb0\xd1\x82\xd0\xbe\xd1\x80 \xd0\xbd\xd0\xb5 \xd0\xb2\xd0\xb7\xd1\x8f\xd0\xbb \xd1\x82\xd1\x80\xd1\x83\xd0\xb1\xd0\xba\xd1\x83'), (b'fail_b', b'\xd0\x9a\xd0\xbb\xd0\xb8\xd0\xb5\xd0\xbd\xd1\x82 \xd0\xbd\xd0\xb5 \xd0\xb2\xd0\xb7\xd1\x8f\xd0\xbb \xd1\x82\xd1\x80\xd1\x83\xd0\xb1\xd0\xba\xd1\x83'), (b'out_of_balance', b'\xd0\x9d\xd0\xb5\xd0\xb4\xd0\xbe\xd1\x81\xd1\x82\xd0\xb0\xd1\x82\xd0\xbe\xd1\x87\xd0\xbd\xd0\xbe \xd0\xbc\xd0\xb8\xd0\xbd\xd1\x83\xd1\x82')]),
            preserve_default=True,
        ),
    ]
