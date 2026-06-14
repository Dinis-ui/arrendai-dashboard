from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings             # <-- NOVO
from django.conf.urls.static import static   # <-- NOVO
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.admin_url if hasattr(admin.site, 'admin_url') else admin.site.urls),
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('api/users/', include('users.urls')),
    path('api/properties/', include('properties.urls')),
    path('api/tenancies/', include('tenancies.urls')),
]

# NOVO: Esta linha permite que o Django mostre os ficheiros de imagem/PDF no navegador
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)