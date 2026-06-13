from rest_framework import serializers
# Adicionei a Notificacao aos imports!
from .models import User, Propriedade, PlanoSubscricao, Notificacao

class PlanoSubscricaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanoSubscricao
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    # A password só pode ser escrita, nunca lida (por segurança)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # Adicionado 'telefone'
        fields = ['username', 'email', 'password', 'nome_completo', 'nif', 'telefone', 'role', 'iban', 'morada_fiscal']

    def create(self, validated_data):
        # Usamos o create_user para que a password seja encriptada automaticamente!
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            nome_completo=validated_data.get('nome_completo', ''),
            nif=validated_data.get('nif', ''),
            telefone=validated_data.get('telefone', ''), # <-- Novo campo
            role=validated_data.get('role', 'tenant'),
            iban=validated_data.get('iban', ''),
            morada_fiscal=validated_data.get('morada_fiscal', '')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Adicionado 'telefone' para que a API o envie e receba
        fields = ['id', 'username', 'email', 'nome_completo', 'nif', 'telefone', 'role', 'iban', 'morada_fiscal', 'plano']

# --- O Tradutor das Propriedades ---
class PropriedadeSerializer(serializers.ModelSerializer):
    inquilino_atual = serializers.SerializerMethodField()
    estado = serializers.SerializerMethodField()
    
    # NOVOS CAMPOS
    contrato_inicio = serializers.SerializerMethodField()
    contrato_fim = serializers.SerializerMethodField()
    perfil_inquilino = serializers.SerializerMethodField()

    contrato_id = serializers.SerializerMethodField()

    class Meta:
        model = Propriedade
        fields = '__all__'
        read_only_fields = ['senhorio', 'status_aprovacao', 'inquilino_atual', 'contrato_inicio', 'contrato_fim', 'perfil_inquilino', 'contrato_id']

    def get_inquilino_atual(self, obj):
        contrato = obj.active_tenancies.filter(is_active=True).first()
        if contrato:
            return contrato.tenant.username
        return None

    def get_estado(self, obj):
        contrato = obj.active_tenancies.filter(is_active=True).first()
        if contrato:
            return "Alugado"
        return obj.estado

    # Vai buscar a Data de Início
    def get_contrato_inicio(self, obj):
        contrato = obj.active_tenancies.filter(is_active=True).first()
        if contrato and contrato.start_date:
            return contrato.start_date.strftime("%d/%m/%Y")
        return "-"

    # Vai buscar a Data de Fim
    def get_contrato_fim(self, obj):
        contrato = obj.active_tenancies.filter(is_active=True).first()
        if contrato and contrato.end_date:
            return contrato.end_date.strftime("%d/%m/%Y")
        return "-"

    # Vai buscar os dados do utilizador para abrir o Modal
    def get_perfil_inquilino(self, obj):
        contrato = obj.active_tenancies.filter(is_active=True).first()
        if contrato and contrato.tenant:
            tenant = contrato.tenant
            return {
                "nome": tenant.username,
                "email": tenant.email,
                # Usa 'getattr' caso não tenhas estes campos obrigatórios no teu modelo de Utilizador
                "telefone": getattr(tenant, 'telefone', 'Não partilhado'),
                "profissao": getattr(tenant, 'profissao', 'Não especificado'),
                "idade": getattr(tenant, 'idade', 'N/A'),
                "bio": getattr(tenant, 'bio', 'O inquilino ainda não preencheu a biografia.'),
                "score": 5.0  # Classificação base
            }
        return None
    
    def get_contrato_id(self, obj):
        contrato = obj.active_tenancies.filter(is_active=True).first()
        if contrato:
            return contrato.id
        return None

# ==========================================
# NOVO: SERIALIZER DAS NOTIFICAÇÕES
# ==========================================
class NotificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacao
        fields = ['id', 'titulo', 'mensagem', 'lida', 'criada_em']