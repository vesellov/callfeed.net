# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0035_auto_20150617_1507'),
    ]

    operations = [
        migrations.RenameField(
            model_name='resetpasswordstorage',
            old_name='reset_password_code',
            new_name='confirmation_code',
        ),
        migrations.RenameField(
            model_name='resetpasswordstorage',
            old_name='reset_password_when_requested',
            new_name='when_requested',
        ),
    ]
