# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0031_auto_20150610_1239'),
    ]

    operations = [
        migrations.AddField(
            model_name='operator',
            name='related_widgets',
            field=models.ManyToManyField(related_name='related_operators', null=True, to='mainapp.Widget', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='operator',
            name='name',
            field=models.CharField(max_length=35, verbose_name=b'\xd0\x98\xd0\xbc\xd1\x8f'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='operator',
            name='phone_number',
            field=models.CharField(max_length=20, verbose_name=b'\xd0\x9d\xd0\xbe\xd0\xbc\xd0\xb5\xd1\x80 \xd1\x82\xd0\xb5\xd0\xbb\xd0\xb5\xd1\x84\xd0\xbe\xd0\xbd\xd0\xb0'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='operator',
            name='photo_url',
            field=models.CharField(max_length=255, null=True, verbose_name=b'\xd0\xa4\xd0\xbe\xd1\x82\xd0\xbe', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='operator',
            name='position',
            field=models.CharField(default='\u041a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0430\u043d\u0442', max_length=35, verbose_name=b'\xd0\x94\xd0\xbe\xd0\xbb\xd0\xb6\xd0\xbd\xd0\xbe\xd1\x81\xd1\x82\xd1\x8c'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='widget',
            name='default_operator',
            field=models.ForeignKey(related_name='widgets_operator_is_default_for', blank=True, to='mainapp.Operator', null=True),
            preserve_default=True,
        ),
    ]
