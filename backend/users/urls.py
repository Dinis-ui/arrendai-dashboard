from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Importa o PropriedadeViewSet que acabaste de criar
from .views import UserViewSet, UserRegistrationView, utilizador_atual, PasswordResetView, PropriedadeViewSet 

router = DefaultRouter()
# NOVO: Criamos a rota para as propriedades
router.register(r'propriedades', PropriedadeViewSet, basename='propriedade')
# O teu router original dos utilizadores
router.register(r'', UserViewSet)

urlpatterns = [
    # 1. Rota ESPECÍFICA para o Registo
    path('register/', UserRegistrationView.as_view(), name='register'),
    
    # 2. Rota para o React descobrir quem fez login
    path('me/', utilizador_atual, name='utilizador_atual'),
    
    # 3. Rota para a recuperação de password
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    
    # 4. Rotas GERAIS do teu router (inclui agora as /propriedades/ geradas ali em cima)
    path('', include(router.urls)),
]