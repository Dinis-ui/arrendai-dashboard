from rest_framework import viewsets, generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, update_session_auth_hash
from rest_framework.decorators import action
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum
from tenancies.models import Tenancy # Para calcularmos a receita (MRR)
from .models import Propriedade, User

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
        if user.role == 'landlord':
            return Propriedade.objects.filter(senhorio=user).order_by('-data_criacao')
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

    # RESTRIÇÃO 1: Limite de Propriedades Criadas
    def create(self, request, *args, **kwargs):
        user = request.user
        
        if user.role == 'landlord':
            if not user.plano:
                return Response({'error': 'A sua conta não tem um plano ativo. Por favor, adira ao plano Grátis na secção "Meu Plano".'}, status=status.HTTP_403_FORBIDDEN)
                
            total_casas = Propriedade.objects.filter(senhorio=user).count()
            if total_casas >= user.plano.max_propriedades:
                return Response(
                    {'error': f'Atingiu o limite de propriedades ({user.plano.max_propriedades}) do seu plano {user.plano.nome}. Faça upgrade para adicionar mais!'},
                    status=status.HTTP_403_FORBIDDEN
                )
                
        return super().create(request, *args, **kwargs)

    # RESTRIÇÃO 2: Limite de Anúncios Ativos
    def partial_update(self, request, *args, **kwargs):
        # Deteta se o utilizador está a tentar publicar um anúncio
        if request.data.get('anuncio_publicado') == True:
            user = request.user
            propriedade_atual = self.get_object()
            
            # Só fazemos a contagem se a propriedade ainda NÃO estiver publicada
            if user.role == 'landlord' and user.plano and not propriedade_atual.anuncio_publicado:
                total_anuncios = Propriedade.objects.filter(senhorio=user, anuncio_publicado=True).count()
                
                if total_anuncios >= user.plano.max_anuncios:
                    return Response(
                        {'error': f'Atingiu o limite de anúncios ativos ({user.plano.max_anuncios}) do seu plano {user.plano.nome}. Faça upgrade para publicar mais!'},
                        status=status.HTTP_403_FORBIDDEN
                    )
                    
        return super().partial_update(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(senhorio=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    # Proteção: Só Admins entram!
    if request.user.role != 'admin' and not request.user.is_superuser:
        return Response({'erro': 'Acesso negado'}, status=403)

    total_users = User.objects.count()
    senhorios = User.objects.filter(role='landlord', status_verificacao='pendente')
    imoveis = Propriedade.objects.filter(status_aprovacao='pendente')
    
    # Receita MRR (Soma mensal de todos os contratos ativos na plataforma)
    mrr = Tenancy.objects.filter(is_active=True).aggregate(Sum('monthly_rent'))['monthly_rent__sum'] or 0

    return Response({
        'stats': {
            'totalUsers': total_users,
            'senhoriosPendentes': senhorios.count(),
            'anunciosPendentes': imoveis.count(),
            'receitaMensal': f"{mrr}€"
        },
        'senhorios': [{
            'id': s.id, 
            'nome': s.nome_completo or s.username, 
            'email': s.email, 
            'nif': s.nif or 'N/A', 
            'data': s.date_joined.strftime('%d/%m/%Y'),
            'docs': request.build_absolute_uri(s.documento_verificacao.url) if s.documento_verificacao else None
        } for s in senhorios],
        'imoveis': [{
            'id': i.id, 
            'senhorio': i.senhorio.username, 
            'morada': i.morada,
            'preco': f"{i.preco_anuncio or i.valor_estimado}€", 
            'tipo': i.get_tipo_casa_display(), 
            'data': i.data_criacao.strftime('%d/%m/%Y')
        } for i in imoveis]
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def moderar_senhorio(request, pk):
    if request.user.role != 'admin' and not request.user.is_superuser: 
        return Response(status=403)
    senhorio = User.objects.get(pk=pk)
    senhorio.status_verificacao = request.data.get('acao') # 'aprovado' ou 'rejeitado'
    senhorio.save()
    return Response({'status': 'ok'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def moderar_imovel(request, pk):
    if request.user.role != 'admin' and not request.user.is_superuser: 
        return Response(status=403)
    imovel = Propriedade.objects.get(pk=pk)
    imovel.status_aprovacao = request.data.get('acao') # 'aprovado' ou 'rejeitado'
    imovel.save()
    return Response({'status': 'ok'})