from rest_framework import viewsets, generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserRegistrationSerializer

User = get_user_model()

# 1. Para gerir os utilizadores em geral
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# 2. Específico para o Registo
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

# 3. Para o React ir buscar os dados de quem está logado
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def utilizador_atual(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# 4. NOVO: Lógica de Recuperação de Password
class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        
        # Debug para veres no terminal o que está a acontecer
        print(f"DEBUG: Tentativa de recuperar password para o email: '{email}'")
        
        # Procuramos o utilizador ignorando maiúsculas (iexact)
        user = User.objects.filter(email__iexact=email).first()
        
        if user:
            print(f"DEBUG: Utilizador encontrado: {user.username}")
            # Aqui no futuro podes disparar o envio de email real.
            # Por agora, confirmamos que o email existe.
            return Response({"message": "Link enviado com sucesso!"}, status=status.HTTP_200_OK)
        else:
            print("DEBUG: Utilizador não encontrado na base de dados.")
            return Response({"error": "Email não encontrado"}, status=status.HTTP_404_NOT_FOUND)