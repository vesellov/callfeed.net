# from django.conf import settings
from django.conf.urls import patterns, include, url
# from django.conf.urls.static import static
from django.contrib import admin

urlpatterns = patterns('',
                       # Examples:
                       # url(r'^$', 'callfeed.views.home', name='home'),
                       # url(r'^blog/', include('blog.urls')),

                       url(r'^admin/', include(admin.site.urls)),
                       (r'', include('mainapp.urls')),
                       )

# if settings.DEBUG:
# urlpatterns + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

