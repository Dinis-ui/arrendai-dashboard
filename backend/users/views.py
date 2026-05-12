from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserRegistrationSerializer

User = get_user_model()

# 1. O TEU: Para gerir os utilizadores em geral
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# 2. O NOVO: Específico para o Registo de novas contas
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    # AllowAny: Permite que pessoas sem conta (visitantes) consigam fazer o registo
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer