from rest_framework import viewsets
from .models import Property
from .serializers import PropertySerializer

class PropertyViewSet(viewsets.ModelViewSet):
    # 1. Onde é que ele vai buscar os dados? (A todas as propriedades)
    queryset = Property.objects.all()
    # 2. Quem é o tradutor? (O PropertySerializer)
    serializer_class = PropertySerializer