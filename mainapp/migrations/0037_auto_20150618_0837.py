# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0036_auto_20150618_0830'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='resetpasswordstorage',
            name='user',
        ),
        migrations.DeleteModel(
            name='ResetPasswordStorage',
        ),
    ]
