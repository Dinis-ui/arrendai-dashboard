from rest_framework import serializers
from .models import User

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