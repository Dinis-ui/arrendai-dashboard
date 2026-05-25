from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Property
from .serializers import PropertySerializer

class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 

    def get_queryset(self):
        queryset = Property.objects.all()
        # Se o React pedir /api/properties/?minhas=true, filtra as casas do senhorio
        if self.request.query_params.get('minhas') == 'true':
            queryset = queryset.filter(landlord=self.request.user)
        return queryset

    def perform_create(self, serializer):
        # Associa automaticamente a casa nova ao senhorio logado
        serializer.save(landlord=self.request.user)