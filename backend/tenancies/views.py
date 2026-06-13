from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from .models import Application, Tenancy, Document, Chat, Message
from .serializers import ApplicationSerializer, TenancySerializer, DocumentSerializer, ChatSerializer, MessageSerializer
from rest_framework.exceptions import ValidationError

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated] 

    class ApplicationViewSet(viewsets.ModelViewSet):
        serializer_class = ApplicationSerializer
        permission_classes = [IsAuthenticated] 

        def get_queryset(self):
            user = self.request.user
            if user.role == 'landlord':
            # O Senhorio vê as suas propriedades
             return Application.objects.filter(property__senhorio=user) 
        
        # O Inquilino vê as suas candidaturas todas (aprovadas, pendentes e rejeitadas)
            return Application.objects.filter(tenant=user)
    
    def perform_create(self, serializer):
        user = self.request.user
        propriedade = serializer.validated_data.get('property')

        # O CADEADO: Verifica se já existe uma candidatura pendente ou aprovada deste utilizador para esta casa
        candidatura_existente = Application.objects.filter(
            tenant=user, 
            property=propriedade, 
            status__in=['pending', 'approved']
        ).exists()

        if candidatura_existente:
            raise ValidationError({"erro": "Já tens uma candidatura ativa ou em análise para este imóvel."})

        serializer.save(tenant=user)

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
            # CORREÇÃO: Usa preco_anuncio (que é o valor real do aluguer)
            monthly_rent=application.property.preco_anuncio or application.property.valor_estimado, 
            is_active=True
        )

        # Cria Chat
        chat = Chat.objects.create(property=application.property)
        chat.participants.add(application.tenant, application.property.senhorio) 
        Message.objects.create(
            chat=chat,
            sender=application.property.senhorio,
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
        if user.role == 'landlord':
            return Tenancy.objects.filter(property__senhorio=user)
        return Tenancy.objects.filter(tenant=user)

    # NOVA FUNÇÃO DE PAGAMENTO:
    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        tenancy = self.get_object()
        tenancy.payment_status = 'pago'
        tenancy.save()
        return Response({'message': 'Pagamento efetuado com sucesso!', 'status': 'pago'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        tenancy = self.get_object()
        
        if not tenancy.is_active:
            return Response({'error': 'O contrato já se encontra encerrado.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Desliga o contrato e define a data de hoje como o fim oficial
        tenancy.is_active = False
        tenancy.end_date = timezone.now().date()
        tenancy.save()
        
        return Response({'message': 'Contrato encerrado e propriedade libertada com sucesso.'}, status=status.HTTP_200_OK)

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