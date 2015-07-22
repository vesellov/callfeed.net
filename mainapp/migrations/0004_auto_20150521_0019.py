# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0003_setuprequest_setuprequesthistory'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='callbackinfo',
            name='widget',
        ),
        migrations.DeleteModel(
            name='CallbackInfo',
        ),
    ]
