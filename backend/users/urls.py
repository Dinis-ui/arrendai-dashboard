from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserRegistrationView # <-- Adicionámos a nova View aqui!

# O teu router original
router = DefaultRouter()
router.register(r'', UserViewSet)

urlpatterns = [
    # 1. Rota ESPECÍFICA para o Registo (Fica no topo!)
    path('register/', UserRegistrationView.as_view(), name='register'),
    
    # 2. Rotas GERAIS do teu router
    path('', include(router.urls)),
]