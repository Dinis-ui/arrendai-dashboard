from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserRegistrationSerializer

User = get_user_model()

# 1. O TEU ORIGINAL: Para gerir os utilizadores em geral
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# 2. O TEU ORIGINAL: Específico para o Registo de novas contas (com suporte a FormData/PDF)
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    # AllowAny: Permite que pessoas sem conta (visitantes) consigam fazer o registo
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

# 3. O NOVO: Para o React conseguir ir buscar os dados de quem acabou de fazer login
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def utilizador_atual(request):
    # O Django lê o Token enviado e sabe exatamente quem é o request.user
    serializer = UserSerializer(request.user)
    return Response(serializer.data)