from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet

# O Router cria automaticamente os links para Listar, Criar, Ver, Editar e Apagar
router = DefaultRouter()
router.register(r'', PropertyViewSet) # Deixamos vazio para ser o caminho base

urlpatterns = [
    path('', include(router.urls)),
]