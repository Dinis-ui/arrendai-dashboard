from rest_framework import serializers
from .models import Application, Tenancy, Document, Chat, Message

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['status', 'tenant'] 

class TenancySerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenancy
        fields = '__all__'

# O TEU SERIALIZER DOS DOCUMENTOS QUE FALTAVA AQUI:
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