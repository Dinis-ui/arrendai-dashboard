from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Importamos as três coisas que precisamos diretamente:
from .views import UserViewSet, UserRegistrationView, utilizador_atual 

# O teu router original
router = DefaultRouter()
router.register(r'', UserViewSet)

urlpatterns = [
    # 1. Rota ESPECÍFICA para o Registo (Fica no topo!)
    path('register/', UserRegistrationView.as_view(), name='register'),
    
    # 2. Rota para o React descobrir quem fez login! (Sem a palavra "views.")
    path('me/', utilizador_atual, name='utilizador_atual'),
    
    # 3. Rotas GERAIS do teu router
    path('', include(router.urls)),
]