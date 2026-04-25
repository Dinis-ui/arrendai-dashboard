from rest_framework import viewsets
from .models import Application, Tenancy
from .serializers import ApplicationSerializer, TenancySerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

class TenancyViewSet(viewsets.ModelViewSet):
    queryset = Tenancy.objects.all()
    serializer_class = TenancySerializer