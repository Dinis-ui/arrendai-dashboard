from rest_framework import serializers
from .models import User, Propriedade

class RegisterSerializer(serializers.ModelSerializer):
    # A password só pode ser escrita, nunca lida (por segurança)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # Adicionados 'iban' e 'morada_fiscal' para permitir que o registo os receba
        fields = ['username', 'email', 'password', 'nome_completo', 'nif', 'role', 'iban', 'morada_fiscal']

    def create(self, validated_data):
        # Usamos o create_user para que a password seja encriptada automaticamente!
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            nome_completo=validated_data.get('nome_completo', ''),
            nif=validated_data.get('nif', ''),
            role=validated_data.get('role', 'tenant'),
            iban=validated_data.get('iban', ''),
            morada_fiscal=validated_data.get('morada_fiscal', '')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Expondo os novos campos para que o React os possa ler no perfil
        fields = ['id', 'username', 'email', 'nome_completo', 'nif', 'role', 'iban', 'morada_fiscal']

# --- O Tradutor das Propriedades ---
class PropriedadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Propriedade
        fields = [
            'id', 'senhorio', 'morada', 'area', 'valor_estimado', 
            'estado', 'data_criacao', 'tipo_casa', 'foto_principal', 
            'status_aprovacao', 'anuncio_publicado', 'titulo_anuncio', 'preco_anuncio'
        ]
        read_only_fields = ['senhorio', 'data_criacao', 'status_aprovacao']