# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0045_pendingcallback_planned_for_datetime'),
    ]

    operations = [
        migrations.AlterField(
            model_name='widget',
            name='callback_type',
            field=models.CharField(default=b'linear', max_length=10, verbose_name=b'\xd0\x9f\xd0\xbe\xd1\x80\xd1\x8f\xd0\xb4\xd0\xbe\xd0\xba \xd0\xb4\xd0\xbe\xd0\xb7\xd0\xb2\xd0\xbe\xd0\xbd\xd0\xb0', choices=[(b'ringall', b'\xd0\x9e\xd0\xb4\xd0\xbd\xd0\xbe\xd0\xb2\xd1\x80\xd0\xb5\xd0\xbc\xd0\xb5\xd0\xbd\xd0\xbd\xd0\xbe'), (b'linear', b'\xd0\x9f\xd0\xbe \xd0\xbe\xd1\x87\xd0\xb5\xd1\x80\xd0\xb5\xd0\xb4\xd0\xb8')]),
            preserve_default=True,
        ),
    ]
