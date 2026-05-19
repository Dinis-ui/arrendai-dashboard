from rest_framework import serializers
from .models import Application, Tenancy, Document

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['status', 'tenant'] 

class TenancySerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenancy
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ['tenant']