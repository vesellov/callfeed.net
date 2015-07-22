# -*- coding: utf-8 -*-
"""
Содержит функции общего назначения
"""
__author__ = 'max'
import os
import random
import string
from callfeed.settings import MEDIA_ROOT, MEDIA_URL, BASE_URL

MIN_MEDIA_FILENAME_LENGTH, MAX_MEDIA_FILENAME_LENGTH = 6, 10


def rand_string(length=16):
    # default length = 16 - for widget tokens
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in xrange(0, length))


def save_media_file(uploaded_file, path=None):
    try:
        file_extension = uploaded_file.name.split('.')[-1]
    except Exception:
        return None

    def gen_filename():
        _filename = '%s.%s' % (
            rand_string(random.randint(MIN_MEDIA_FILENAME_LENGTH, MAX_MEDIA_FILENAME_LENGTH)), file_extension)
        _file_path = '%s/%s' % (MEDIA_ROOT, _filename)
        _file_url = '%s%s%s' % (BASE_URL, MEDIA_URL, _filename)
        return _filename, _file_path, _file_url

    filename, file_path, file_url = gen_filename()

    while os.path.exists(file_path):
        filename, file_path, file_url = gen_filename()

    with open(file_path, 'wb') as output_file:
        for chunk in uploaded_file.chunks():
            output_file.write(chunk)

    return file_url


def random_delay(starting_from=0.3, finishing_with=1.0):
    """
    This method is used to generate random delays; needed for preventing 'time attacks'
    :param starting_from: high border
    :param finishing_with: low border
    :return: None
    """
    import time

    the_delay_length = random.uniform(starting_from, finishing_with)
    time.sleep(the_delay_length)
