from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView # NOVO: Importar as views do JWT

urlpatterns = [
    path('admin/', admin.site.admin_url if hasattr(admin.site, 'admin_url') else admin.site.urls),
    
    # NOVOS: Links para o Login (Receber o Token)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # As nossas Apps
    path('api/users/', include('users.urls')),
    path('api/properties/', include('properties.urls')),
    path('api/tenancies/', include('tenancies.urls')),
]