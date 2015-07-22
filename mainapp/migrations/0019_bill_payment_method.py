# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0018_auto_20150530_1815'),
    ]

    operations = [
        migrations.AddField(
            model_name='bill',
            name='payment_method',
            field=models.CharField(default=b'cashless', max_length=10, choices=[(b'cash', b'Cash'), (b'cashless', b'Cashless')]),
            preserve_default=True,
        ),
    ]
