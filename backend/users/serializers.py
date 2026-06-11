from rest_framework import serializers
from .models import User, Propriedade

class RegisterSerializer(serializers.ModelSerializer):
    # A password só pode ser escrita, nunca lida (por segurança)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # Listar exatamente os campos que vamos receber do React
        fields = ['username', 'email', 'password', 'nome_completo', 'nif', 'role']

    def create(self, validated_data):
        # Usamos o create_user para que a password seja encriptada automaticamente!
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            nome_completo=validated_data.get('nome_completo', ''),
            nif=validated_data.get('nif', ''),
            role=validated_data.get('role', 'inquilino')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nome_completo', 'nif', 'role']

# --- NOVO: O Tradutor das Propriedades ---
class PropriedadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Propriedade
        # 1. Adicionamos os 3 campos novos aqui à lista fields:
        fields = ['id', 'senhorio', 'morada', 'area', 'valor_estimado', 'estado', 'data_criacao', 'tipo_casa', 'foto_principal', 'status_aprovacao', 'anuncio_publicado', 'titulo_anuncio', 'preco_anuncio']
        
        # 2. Bloqueamos o 'status_aprovacao' para ser só de leitura. 
        # Assim evitamos que um senhorio "hacker" consiga auto-aprovar a sua casa enviando 'aprovado' no React!
        read_only_fields = ['senhorio', 'data_criacao', 'status_aprovacao']