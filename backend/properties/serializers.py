from rest_framework import serializers
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    # Isto envia o nome do senhorio em vez de apenas o número (ID) dele
    landlord_name = serializers.CharField(source='landlord.username', read_only=True)

    class Meta:
        model = Property
        fields = '__all__'
        # O 'landlord' é read_only para não precisarmos de o enviar no formulário. 
        # O Django vai saber quem é o senhorio através do Token de Login!
        read_only_fields = ['landlord', 'created_at']