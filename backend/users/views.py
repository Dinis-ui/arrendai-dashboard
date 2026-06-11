from rest_framework import viewsets, generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model

# Não te esqueças destas novas importações!
from .models import Propriedade
from .serializers import RegisterSerializer, UserSerializer, PropriedadeSerializer

User = get_user_model()

# 1. Para gerir os utilizadores em geral
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

# 2. Específico para o Registo
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

# 3. Para o React ir buscar os dados de quem está logado
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def utilizador_atual(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# 4. Lógica de Recuperação de Password
class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        print(f"DEBUG: Tentativa de recuperar password para o email: '{email}'")
        
        user = User.objects.filter(email__iexact=email).first()
        
        if user:
            print(f"DEBUG: Utilizador encontrado: {user.username}")
            return Response({"message": "Link enviado com sucesso!"}, status=status.HTTP_200_OK)
        else:
            print("DEBUG: Utilizador não encontrado na base de dados.")
            return Response({"error": "Email não encontrado"}, status=status.HTTP_404_NOT_FOUND)

# 5. NOVO: Lógica das Propriedades (Casas)
class PropriedadeViewSet(viewsets.ModelViewSet):
    serializer_class = PropriedadeSerializer
    permission_classes = [IsAuthenticated]

    # Em vez do queryset fixo com .all(), usamos esta função:
    def get_queryset(self):
        # Filtra a base de dados para devolver APENAS as casas do utilizador logado
        return Propriedade.objects.filter(senhorio=self.request.user).order_by('-data_criacao')

    def perform_create(self, serializer):
        serializer.save(senhorio=self.request.user)