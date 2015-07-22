# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0024_widget_is_installed'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='client',
            name='free_minutes',
        ),
    ]
