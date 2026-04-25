from django.db import models
from django.conf import settings # Para ligar ao nosso Custom User

class Property(models.Model):
    # O Senhorio dono desta propriedade (Se o dono for apagado, as casas dele também são)
    landlord = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='properties')
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Localização
    address = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=20)
    city = models.CharField(max_length=100)
    
    # Detalhes do imóvel
    area_sqm = models.DecimalField(max_digits=8, decimal_places=2) # Ex: 85.50 m2
    monthly_rent = models.DecimalField(max_digits=8, decimal_places=2) # Ex: 1200.00 €
    typology = models.CharField(max_length=10) # Ex: T0, T1, T2
    
    # Estado
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Properties"

    def __str__(self):
        return f"{self.title} - {self.city} ({self.typology})"