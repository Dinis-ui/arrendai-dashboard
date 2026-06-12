from rest_framework import serializers
from .models import User, Propriedade

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
        fields = ['id', 'username', 'email', 'nome_completo', 'nif', 'telefone', 'role', 'iban', 'morada_fiscal']

# --- O Tradutor das Propriedades ---
class PropriedadeSerializer(serializers.ModelSerializer):

    senhorio_nome = serializers.CharField(source='senhorio.username', read_only=True)
    class Meta:
        model = Propriedade
        fields = [
            'id', 'senhorio','senhorio_nome', 'morada', 'area', 'valor_estimado', 
            'estado', 'data_criacao', 'tipo_casa', 'foto_principal', 
            'status_aprovacao', 'anuncio_publicado', 'titulo_anuncio', 'preco_anuncio', 'descricao', 'comodidades'
        ]
        read_only_fields = ['senhorio', 'data_criacao', 'status_aprovacao']