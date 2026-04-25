from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, TenancyViewSet

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet)
router.register(r'contracts', TenancyViewSet)

urlpatterns = [
    path('', include(router.urls)),
]