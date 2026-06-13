from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, 
    UserRegistrationView, 
    utilizador_atual, 
    PasswordResetView, 
    ChangePasswordView, 
    PropriedadeViewSet,
    PlanoSubscricaoViewSet
) 

router = DefaultRouter()
# Usar 'users' como prefixo evita conflitos com rotas vazias
router.register(r'propriedades', PropriedadeViewSet, basename='propriedade')
router.register(r'users', UserViewSet, basename='user') 
router.register(r'planos', PlanoSubscricaoViewSet, basename='planos')
urlpatterns = [
    # Rotas específicas
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('me/', utilizador_atual, name='utilizador_atual'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    
    # ROTA QUE ESTAVA A DAR 404
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('subscribe/', UserViewSet.as_view({'post': 'subscribe'}), name='subscribe'),
    # Rotas do Router
    path('', include(router.urls)),

    
]