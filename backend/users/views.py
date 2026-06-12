from rest_framework import viewsets, generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, update_session_auth_hash

from .models import Propriedade
from .serializers import RegisterSerializer, UserSerializer, PropriedadeSerializer

User = get_user_model()

# 1. Gestão Geral de Utilizadores
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        # Se for criação (POST), usa o RegisterSerializer. Para atualizar (PATCH/PUT) ou ler, usa o UserSerializer
        if self.action == 'create':
            return RegisterSerializer
        return UserSerializer


# 2. Registo de Utilizadores
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


# 3. Utilizador Atual (Leitura e Atualização)
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def utilizador_atual(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
        
    elif request.method == 'PATCH':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 4. Recuperação de Password (Reset via Email)
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


# 5. Endpoint para Alterar Password (Logado)
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response({"error": "Ambos os campos são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({"error": "Palavra-passe antiga incorreta"}, status=status.HTTP_400_BAD_REQUEST)

        # Encripta a nova password
        user.set_password(new_password)
        user.save()
        
        # Impede que o utilizador perca a sessão atual
        update_session_auth_hash(request, user)
        return Response({"message": "Palavra-passe atualizada com sucesso!"}, status=status.HTTP_200_OK)


# 6. Lógica das Propriedades (Casas)
class PropriedadeViewSet(viewsets.ModelViewSet):
    serializer_class = PropriedadeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # O Admin vê tudo
        if user.is_staff or user.role == 'admin':
            return Propriedade.objects.all().order_by('-data_criacao')
            
        # O Senhorio vê as dele
        if user.role == 'senhorio' or user.role == 'landlord':
            return Propriedade.objects.filter(senhorio=user).order_by('-data_criacao')
        
        # O Inquilino vê apenas as Aprovadas E Publicadas
        return Propriedade.objects.filter(
            status_aprovacao='aprovado', 
            anuncio_publicado=True
        ).order_by('-data_criacao')

    def perform_create(self, serializer):
        # Associa o senhorio logado à casa recém-criada
        serializer.save(senhorio=self.request.user)