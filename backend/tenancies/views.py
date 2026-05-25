from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from .models import Application, Tenancy, Document
from .serializers import ApplicationSerializer, TenancySerializer, DocumentSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        user = self.request.user
        # Se for Senhorio, vê candidaturas das SUAS casas (usando o campo landlord)
        if user.role == 'landlord':
            return Application.objects.filter(property__landlord=user) 
        # Se for Inquilino, vê as suas próprias
        return Application.objects.filter(tenant=user)

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        application = self.get_object()
        
        # Só o senhorio dono da casa pode aprovar
        if request.user.role != 'landlord' or application.property.landlord != request.user:
            return Response({'error': 'Sem permissão.'}, status=status.HTTP_403_FORBIDDEN)

        application.status = 'approved'
        application.save()

        # Cria Contrato automático
        Tenancy.objects.create(
            property=application.property,
            tenant=application.tenant,
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=365),
            monthly_rent=application.property.monthly_rent, # Corrigido para monthly_rent
            is_active=True
        )

        # Rejeita as outras para a mesma casa
        Application.objects.filter(property=application.property, status='pending').exclude(id=application.id).update(status='rejected')

        return Response({'message': 'Aprovada e contrato criado!'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        application = self.get_object()
        # Só o dono da casa pode rejeitar
        if request.user.role != 'landlord' or application.property.landlord != request.user:
            return Response({'error': 'Sem permissão.'}, status=status.HTTP_403_FORBIDDEN)

        application.status = 'rejected'
        application.save()
        return Response({'message': 'Candidatura rejeitada.'})


class TenancyViewSet(viewsets.ModelViewSet):
    serializer_class = TenancySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'landlord':
            return Tenancy.objects.filter(property__landlord=user)
        return Tenancy.objects.filter(tenant=user)


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'landlord':
            # Filtra documentos de inquilinos que se candidataram às casas deste senhorio
            return Document.objects.filter(tenant__applications__property__landlord=user).distinct()
        return Document.objects.filter(tenant=user)

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)