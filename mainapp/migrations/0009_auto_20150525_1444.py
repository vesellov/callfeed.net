# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0008_auto_20150524_1952'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schedule',
            name='timezone',
            field=models.IntegerField(default=3, choices=[(2, 'UTC+02:00 - \u041a\u0430\u043b\u0438\u043d\u0438\u043d\u0433\u0440\u0430\u0434'), (3, 'UTC+03:00 - \u041c\u043e\u0441\u043a\u0432\u0430'), (4, 'UTC+04:00 - \u0421\u0430\u043c\u0430\u0440\u0430'), (5, 'UTC+05:00 - \u0415\u043a\u0430\u0442\u0435\u0440\u0438\u043d\u0431\u0443\u0440\u0433'), (6, 'UTC+06:00 - \u041e\u043c\u0441\u043a'), (7, 'UTC+07:00 - \u041a\u0440\u0430\u0441\u043d\u043e\u044f\u0440\u0441\u043a'), (8, 'UTC+08:00 - \u0418\u0440\u043a\u0443\u0442\u0441\u043a'), (9, 'UTC+09:00 - \u042f\u043a\u0443\u0442\u0441\u043a'), (10, 'UTC+10:00 - \u0412\u043b\u0430\u0434\u0438\u0432\u043e\u0441\u0442\u043e\u043a'), (11, 'UTC+11:00 - \u0421\u0430\u0445\u0430\u043b\u0438\u043d\u0441\u043a\u0430\u044f'), (12, 'UTC+12:00 - \u041a\u0430\u043c\u0447\u0430\u0442\u043a\u0430')]),
            preserve_default=True,
        ),
    ]
