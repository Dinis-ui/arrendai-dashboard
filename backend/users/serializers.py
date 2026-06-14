from rest_framework import serializers
from .models import User, Propriedade, PlanoSubscricao, Notificacao

class PlanoSubscricaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanoSubscricao
        fields = '__all__'

# --- O SERIALIZER DO REGISTO ATUALIZADO ---
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # 🔥 A MAGIA PARA RECEBER O PDF (Não é obrigatório para inquilinos)
    documento = serializers.FileField(source='documento_verificacao', required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'nome_completo', 'nif', 'telefone', 'role', 'iban', 'morada_fiscal', 'documento']

    def create(self, validated_data):
        # Apanhar e remover a password para encriptar depois
        password = validated_data.pop('password')
        
        # O validated_data já contém o 'documento_verificacao' graças ao 'source'
        user = User(**validated_data)
        user.set_password(password)
        
        # Se for senhorio, atribuímos o plano base e definimos como pendente
        if user.role == 'landlord':
            user.status_verificacao = 'pendente'
            plano_basico = PlanoSubscricao.objects.first()
            if plano_basico:
                user.plano = plano_basico
        else:
            # Se for inquilino, não precisa de aprovação
            user.status_verificacao = 'aprovado'
            
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Adicionado o 'status_verificacao' para o React saber se está bloqueado ou não!
        fields = ['id', 'username', 'email', 'nome_completo', 'nif', 'telefone', 'role', 'iban', 'morada_fiscal', 'plano', 'status_verificacao']

class PropriedadeSerializer(serializers.ModelSerializer):
    inquilino_atual = serializers.SerializerMethodField()
    estado = serializers.SerializerMethodField()
    contrato_inicio = serializers.SerializerMethodField()
    contrato_fim = serializers.SerializerMethodField()
    perfil_inquilino = serializers.SerializerMethodField()
    contrato_id = serializers.SerializerMethodField()
    
    #  1. ADICIONA ISTO AQUI 
    nome_senhorio = serializers.SerializerMethodField()

    class Meta:
        model = Propriedade
        fields = '__all__'
        read_only_fields = ['senhorio', 'status_aprovacao', 'inquilino_atual', 'contrato_inicio', 'contrato_fim', 'perfil_inquilino', 'contrato_id']

    #  2. E ADICIONA ESTA FUNÇÃO NO FINAL DO SERIALIZER 
    def get_nome_senhorio(self, obj):
        # Tenta enviar o nome completo. Se não existir, envia o username.
        return obj.senhorio.nome_completo or obj.senhorio.username


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

    def get_contrato_inicio(self, obj):
        contrato = obj.active_tenancies.filter(is_active=True).first()
        if contrato and contrato.start_date:
            return contrato.start_date.strftime("%d/%m/%Y")
        return "-"

    def get_contrato_fim(self, obj):
        contrato = obj.active_tenancies.filter(is_active=True).first()
        if contrato and contrato.end_date:
            return contrato.end_date.strftime("%d/%m/%Y")
        return "-"

    def get_perfil_inquilino(self, obj):
        contrato = obj.active_tenancies.filter(is_active=True).first()
        if contrato and contrato.tenant:
            tenant = contrato.tenant
            return {
                "nome": getattr(tenant, 'nome_completo', tenant.username) or tenant.username,
                "email": tenant.email,
                "telefone": getattr(tenant, 'telefone', 'Não partilhado'),
                "profissao": getattr(tenant, 'profissao', 'Não especificado'),
                "idade": getattr(tenant, 'idade', 'N/A'),
                "bio": getattr(tenant, 'bio', 'O inquilino ainda não preencheu a biografia.'),
                "score": 5.0  
            }
        return None
    
    def get_contrato_id(self, obj):
        contrato = obj.active_tenancies.filter(is_active=True).first()
        if contrato:
            return contrato.id
        return None

class NotificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacao
        fields = ['id', 'titulo', 'mensagem', 'lida', 'criada_em']