from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ApplicationViewSet,
    TenancyViewSet,
    DocumentViewSet,
    ChatViewSet,
    MessageViewSet
)

# Cria o router para a API
router = DefaultRouter()

# Regista todas as rotas (é isto que cria os endpoints como /api/tenancies/tenancies/)
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'tenancies', TenancyViewSet, basename='tenancy') # <--- AQUI ESTAVA A FALTAR!
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'chats', ChatViewSet, basename='chat')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
]