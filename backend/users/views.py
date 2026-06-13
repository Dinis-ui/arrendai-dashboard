from rest_framework import viewsets, generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, update_session_auth_hash
from rest_framework.decorators import action

# Importações dos modelos e serializers (Adicionado Notificacao e NotificacaoSerializer)
from .models import Propriedade, PlanoSubscricao, Notificacao
from .serializers import RegisterSerializer, UserSerializer, PropriedadeSerializer, PlanoSubscricaoSerializer, NotificacaoSerializer

User = get_user_model()

class PlanoSubscricaoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PlanoSubscricao.objects.all().order_by('preco')
    serializer_class = PlanoSubscricaoSerializer
    permission_classes = [IsAuthenticated]

# 1. Gestão Geral de Utilizadores
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        # Se for criação (POST), usa o RegisterSerializer. Para atualizar ou ler, usa o UserSerializer
        if self.action == 'create':
            return RegisterSerializer
        return UserSerializer
    
    @action(detail=False, methods=['post'])
    def subscribe(self, request):
        user = request.user
        plano_id = request.data.get('plano_id')
        try:
            plano = PlanoSubscricao.objects.get(id=plano_id)
            user.plano = plano
            user.save()
            return Response({'message': f'Bem-vindo ao plano {plano.nome}!'}, status=status.HTTP_200_OK)
        except PlanoSubscricao.DoesNotExist:
            return Response({'error': 'Plano não encontrado.'}, status=status.HTTP_404_NOT_FOUND)


# 2. Específico para o Registo
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
        # partial=True permite atualizar apenas alguns campos (como NIF ou IBAN)
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
        user = User.objects.filter(email__iexact=email).first()
        
        if user:
            return Response({"message": "Link enviado com sucesso!"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Email não encontrado"}, status=status.HTTP_404_NOT_FOUND)


# 5. Endpoint para Alterar Password (Logado) - VERSÃO DE DEBUG
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        
        print(f"DEBUG: Tentativa de mudar password do user: {user.username}")
        print(f"DEBUG: Dados recebidos: {request.data}")

        if not old_password or not new_password:
            print("DEBUG: Erro: Campos vazios")
            return Response({"error": "Ambos os campos são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            print("DEBUG: Erro: Password antiga errada")
            return Response({"error": "Palavra-passe antiga incorreta"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)
        print("DEBUG: Sucesso! Password alterada.")
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
            status_aprovacao__iexact='aprovado', 
            anuncio_publicado=True
        ).order_by('-data_criacao')

    def perform_create(self, serializer):
        serializer.save(senhorio=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        
        # Só aplicamos limites se o utilizador for senhorio e tiver um plano associado
        if user.role == 'landlord' and user.plano:
            # Conta quantas casas este senhorio já tem
            total_casas = Propriedade.objects.filter(senhorio=user).count()
            
            # Compara com o limite do plano
            if total_casas >= user.plano.max_propriedades:
                return Response(
                    {'error': f'Atingiu o limite do seu plano ({user.plano.nome}). Atualize a sua subscrição para adicionar mais do que {user.plano.max_propriedades} propriedades.'},
                    status=status.HTTP_403_FORBIDDEN
                )
                
        # Se estiver tudo ok (ou for o admin), deixa criar a propriedade normalmente
        return super().create(request, *args, **kwargs)

# ==========================================
# NOVO: VIEWS DAS NOTIFICAÇÕES
# ==========================================
class NotificacaoListView(APIView):
    permission_classes = [IsAuthenticated]

    # Vai buscar as notificações do utilizador logado
    def get(self, request):
        notificacoes = Notificacao.objects.filter(user=request.user)
        serializer = NotificacaoSerializer(notificacoes, many=True)
        return Response(serializer.data)

class MarcarNotificacoesLidasView(APIView):
    permission_classes = [IsAuthenticated]

    # Marca todas as notificações do utilizador como lidas
    def post(self, request):
        Notificacao.objects.filter(user=request.user, lida=False).update(lida=True)
        return Response({"mensagem": "Todas as notificações marcadas como lidas."})