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
    # Enviar o nome de quem mandou a mensagem
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'sender_name', 'text', 'timestamp']
        read_only_fields = ['sender']

class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    # Enviar o título da casa
    property_title = serializers.CharField(source='property.titulo_anuncio', read_only=True)
    # Enviar os detalhes dos participantes
    participants_info = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ['id', 'property', 'property_title', 'participants', 'participants_info', 'messages', 'created_at']

    def get_participants_info(self, obj):
        return [{"id": user.id, "username": user.username} for user in obj.participants.all()]