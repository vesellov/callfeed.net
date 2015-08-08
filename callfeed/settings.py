"""
Django settings for callfeed project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
BASE_URL = 'http://callfeed.net'

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '3#dhx#(l=dp(+dj1#&b@t876q4z9gtekd30js%tr(j9(yh&%sd'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'periodically',
    # 'huey.djhuey',
    'robokassa',
    'multiforloop',
    'mainapp',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    'django.core.context_processors.request',
    "django.core.context_processors.tz",
    "django.contrib.messages.context_processors.messages",
)

ROOT_URLCONF = 'callfeed.urls'

WSGI_APPLICATION = 'callfeed.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'callfeed',
        'HOST': '127.0.0.1',
        'PORT': '3306',
        'USER': 'callfeed',
        'PASSWORD': 'NjJ3hg*2_f#',
        # 'ENGINE': 'django.db.backends.sqlite3',
        # 'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGES = (
    ('ru', 'Russian'),
    ('en', 'English'),
)

LANGUAGE_CODE = 'ru'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = '/home/callfeed/srv/static'
STATICFILES_DIRS = ('/home/max/Dev/Python/callfeed/static',)

MEDIA_URL = '/media/'
MEDIA_ROOT = '/home/callfeed/srv/media'


# A list of people to be informed in case of technical problems
ADMINS = (('Max', 'qiwi360@gmail.com'),
          )

TEMPLATE_DIRS = (os.path.join(BASE_DIR, 'templates').replace('\\', '/'),
                 )

LOCALE_PATHS = (os.path.join(BASE_DIR, 'locale').replace('\\', '/'),
                )
# AUTH_USER_MODEL = ''
AUTH_USER_EMAIL_UNIQUE = True

# LOGIN_REDIRECT_URL = '/accounts/profile'
LOGIN_URL = '/accounts/login'

# ROBOKASSA SETTINGS

ROBOKASSA_LOGIN = 'call2015feed'
ROBOKASSA_PASSWORD1 = 'C12ll58T45Uy41b5'
ROBOKASSA_PASSWORD2 = 'lUT45u526HeEMn45'
ROBOKASSA_USE_POST = True
ROBOKASSA_STRICT_CHECK = True
ROBOKASSA_TEST_MODE = False
# ROBOKASSA_EXTRA_PARAMS = []

# USER GROUPS

USER_GROUP_ADMIN = 'admin'
USER_GROUP_ADMINISTRATIVE_MANAGER = 'administrative_manager'
USER_GROUP_RESELLER = 'reseller'
USER_GROUP_CLIENT = 'client'

# email settings

EMAIL_HOST_USER = 'info@callfeed.ru'
EMAIL_HOST_PASSWORD = 'HFZNpcCf'
EMAIL_HOST = 'smtp.timeweb24.com'
EMAIL_PORT = 465
EMAIL_USE_SSL = True
EMAIL_SUBJECT_PREFIX = '[Callfeed]'
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
