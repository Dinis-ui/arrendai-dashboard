from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import ValidationError

# IMPORTAÇÕES LOCAIS
from .models import Application, Tenancy, Document, Chat, Message
from .serializers import ApplicationSerializer, TenancySerializer, DocumentSerializer, ChatSerializer, MessageSerializer

# IMPORTAÇÃO DA NOTIFICAÇÃO DO OUTRO APP
from users.models import Notificacao

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        user = self.request.user
        if user.role == 'landlord' or user.role == 'senhorio':
            # O Senhorio vê as candidaturas das suas propriedades
            return Application.objects.filter(property__senhorio=user).order_by('-created_at') 
        
        # O Inquilino vê as suas próprias candidaturas
        return Application.objects.filter(tenant=user).order_by('-created_at')
    
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

        # Salva a candidatura
        application = serializer.save(tenant=user)

        # 🔔 DISPARA NOTIFICAÇÃO PARA O SENHORIO
        Notificacao.objects.create(
            user=propriedade.senhorio,
            titulo="Nova Candidatura Recebida!",
            mensagem=f"O inquilino {user.username} acabou de se candidatar ao teu imóvel: {propriedade.titulo_anuncio}."
        )

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

        # Rejeita as outras candidaturas que ficaram pendentes para esta casa
        Application.objects.filter(
            property=application.property, 
            status='pending'
        ).exclude(id=application.id).update(status='rejected')

        # 🔔 DISPARA NOTIFICAÇÃO PARA O INQUILINO
        Notificacao.objects.create(
            user=application.tenant,
            titulo="Candidatura Aprovada! 🎉",
            mensagem=f"Parabéns! O senhorio aceitou a tua candidatura para: {application.property.titulo_anuncio}."
        )

        return Response({'message': 'Aprovada!'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        application = self.get_object()
        application.status = 'rejected'
        application.save()

        # 🔔 DISPARA NOTIFICAÇÃO PARA O INQUILINO
        Notificacao.objects.create(
            user=application.tenant,
            titulo="Atualização da Candidatura",
            mensagem=f"A tua candidatura para {application.property.titulo_anuncio} não avançou. Não desanimes e continua a procurar!"
        )

        return Response({'message': 'Rejeitada.'})

class TenancyViewSet(viewsets.ModelViewSet):
    serializer_class = TenancySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'landlord' or user.role == 'senhorio':
            return Tenancy.objects.filter(property__senhorio=user)
        return Tenancy.objects.filter(tenant=user)

    # FUNÇÃO DE PAGAMENTO COM NOTIFICAÇÃO
    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        tenancy = self.get_object()
        tenancy.payment_status = 'pago'
        tenancy.save()

        # 🔔 DISPARA NOTIFICAÇÃO PARA O SENHORIO
        Notificacao.objects.create(
            user=tenancy.property.senhorio,
            titulo="Renda Recebida! 💰",
            mensagem=f"O inquilino {tenancy.tenant.username} acabou de pagar a renda do imóvel {tenancy.property.titulo_anuncio}."
        )

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