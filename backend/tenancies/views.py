from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from .models import Application, Tenancy, Document, Chat, Message
from .serializers import ApplicationSerializer, TenancySerializer, DocumentSerializer, ChatSerializer, MessageSerializer

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from .models import Application, Tenancy, Chat, Message
from .serializers import ApplicationSerializer, TenancySerializer, ChatSerializer, MessageSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        user = self.request.user
        # ALTERAÇÃO: 'landlord' -> 'senhorio' (o nome do campo que criaste no modelo Propriedade)
        if user.role == 'landlord':
            return Application.objects.filter(property__senhorio=user) 
        return Application.objects.filter(tenant=user)

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        application = self.get_object()
        if application.status == 'approved':
            return Response({'error': 'Já aprovada.'}, status=status.HTTP_400_BAD_REQUEST)

        application.status = 'approved'
        application.save()

        # Cria Contrato
        Tenancy.objects.create(
            property=application.property,
            tenant=application.tenant,
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=365),
            # ALTERAÇÃO: 'monthly_rent' -> 'valor_estimado' (nome real na tua tabela Propriedade)
            monthly_rent=application.property.valor_estimado, 
            is_active=True
        )

        # Cria Chat
        chat = Chat.objects.create(property=application.property)
        # ALTERAÇÃO: 'property.landlord' -> 'property.senhorio'
        chat.participants.add(application.tenant, application.property.senhorio) 
        Message.objects.create(
            chat=chat,
            sender=application.property.senhorio, # ALTERAÇÃO
            # ALTERAÇÃO: 'property.title' -> 'property.titulo_anuncio'
            text=f"Olá! A sua candidatura ao imóvel {application.property.titulo_anuncio} foi aceite."
        )

        Application.objects.filter(property=application.property, status='pending').exclude(id=application.id).update(status='rejected')
        return Response({'message': 'Aprovada!'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        application = self.get_object()
        application.status = 'rejected'
        application.save()
        return Response({'message': 'Rejeitada.'})

class TenancyViewSet(viewsets.ModelViewSet):
    serializer_class = TenancySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        # ALTERAÇÃO: 'property__landlord' -> 'property__senhorio'
        return Tenancy.objects.filter(tenant=user) if user.role != 'landlord' else Tenancy.objects.filter(property__senhorio=user)

# Os restantes ViewSets (Document, Chat, Message) podes manter como estão, 
# desde que as ligações na base de dados estejam corretas.

class TenancyViewSet(viewsets.ModelViewSet):
    serializer_class = TenancySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Tenancy.objects.filter(tenant=user) if user.role != 'landlord' else Tenancy.objects.filter(property__landlord=user)

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Document.objects.filter(tenant=self.request.user)
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)

class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Chat.objects.filter(participants=self.request.user)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Message.objects.filter(chat__participants=self.request.user)
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

        