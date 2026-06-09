from rest_framework import serializers
from django.contrib.auth import get_user_model
from tenancies.models import Document  # Importamos o modelo de documentos para guardar o PDF

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nif', 'role', 'is_landlord_approved']
     
        read_only_fields = ['role', 'is_landlord_approved']

    def update(self, instance, validated_data):
        # Atualiza apenas os campos permitidos se eles vierem no pedido (PATCH)
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.nif = validated_data.get('nif', instance.nif)
        instance.save()
        return instance


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

        user = User(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            role=validated_data.get('role', 'tenant'),
            nif=validated_data.get('nif', '')
        )
        user.set_password(validated_data['password'])
        user.save()

       
        if user.role == 'landlord' and file_data:
            Document.objects.create(
                tenant=user, 
                document_type='identificacao',
                file=file_data
            )

        return user