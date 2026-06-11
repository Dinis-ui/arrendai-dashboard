from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ApplicationViewSet, 
    TenancyViewSet, 
    DocumentViewSet, 
    ChatViewSet, 
    MessageViewSet
)

router = DefaultRouter()
# O basename é obrigatório aqui porque usamos 'get_queryset' nas Views
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'agreements', TenancyViewSet, basename='tenancy') 
router.register(r'documents', DocumentViewSet, basename='document') 
# Novas rotas que adicionámos agora:
router.register(r'chats', ChatViewSet, basename='chat')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
]