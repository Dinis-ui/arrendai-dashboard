from rest_framework import serializers
from django.contrib.auth import get_user_model
from tenancies.models import Document  # Importamos o modelo de documentos para guardar o PDF

User = get_user_model()

# 1. O TEU ORIGINAL: Para ver perfis normais (voltou para o seu lugar!)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nif', 'role', 'is_landlord_approved']

# 2. O NOVO: Específico para criar contas novas com o PDF
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # Avisamos o serializer que pode vir um ficheiro opcional chamado 'documento'
    documento = serializers.FileField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'nif', 'documento')

    def create(self, validated_data):
        # 1. Extraímos o documento enviado antes de criar o utilizador
        file_data = validated_data.pop('documento', None)

        # 2. Criamos o utilizador manualmente
        user = User(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            role=validated_data.get('role', 'tenant'),
            nif=validated_data.get('nif', '')
        )
        user.set_password(validated_data['password'])
        user.save()

        # 3. SE for senhorio e tiver enviado um PDF, guardamos automaticamente na tabela Documentos!
        if user.role == 'landlord' and file_data:
            Document.objects.create(
                tenant=user, 
                document_type='identificacao',
                file=file_data
            )

        return user