from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, TenancyViewSet, DocumentViewSet

router = DefaultRouter()
# O basename é obrigatório aqui porque usamos 'get_queryset' nas Views
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'agreements', TenancyViewSet, basename='tenancy') 
router.register(r'documents', DocumentViewSet, basename='document') 

urlpatterns = [
    path('', include(router.urls)),
]