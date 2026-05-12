from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

# 1. O TEU: Para ver perfis normais (não mexe em passwords)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nif', 'role', 'is_landlord_approved']

# 2. O NOVO: Específico para criar contas novas (Registo) com encriptação!
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'nif')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'tenant'),
            nif=validated_data.get('nif', '')
        )
        return user