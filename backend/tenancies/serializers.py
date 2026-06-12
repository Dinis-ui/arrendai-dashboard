from rest_framework import serializers
from .models import Application, Tenancy, Document, Chat, Message

class ApplicationSerializer(serializers.ModelSerializer):
    # MAGIA: Enviar os nomes reais para o React não ter de adivinhar!
    tenant_name = serializers.CharField(source='tenant.username', read_only=True)
    property_title = serializers.CharField(source='property.titulo_anuncio', read_only=True)
    property_location = serializers.CharField(source='property.morada', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'property', 'property_title', 'property_location', 
            'tenant', 'tenant_name', 'message', 'status', 'created_at'
        ]
        read_only_fields = ['status', 'tenant'] 

class TenancySerializer(serializers.ModelSerializer):
    # MAGIA: Vai buscar os nomes reais à base de dados para a tabela do Senhorio!
    tenant_name = serializers.CharField(source='tenant.username', read_only=True)
    property_title = serializers.CharField(source='property.titulo_anuncio', read_only=True)
    
    class Meta:
        model = Tenancy
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ['tenant']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    class Meta:
        model = Chat
        fields = '__all__'