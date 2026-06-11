from django.urls import path, include
from rest_framework.routers import DefaultRouter
# ADICIONA A PasswordResetView AQUI NAS IMPORTAÇÕES:
from .views import UserViewSet, UserRegistrationView, utilizador_atual, PasswordResetView 

# O teu router original
router = DefaultRouter()
router.register(r'', UserViewSet)

urlpatterns = [
    # 1. Rota ESPECÍFICA para o Registo
    path('register/', UserRegistrationView.as_view(), name='register'),
    
    # 2. Rota para o React descobrir quem fez login
    path('me/', utilizador_atual, name='utilizador_atual'),
    
    # 3. NOVO: Rota para a recuperação de password
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    
    # 4. Rotas GERAIS do teu router
    path('', include(router.urls)),
]