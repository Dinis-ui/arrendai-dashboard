from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Definir os perfis (RBAC)
    ROLE_CHOICES = (
        ('landlord', 'Senhorio'),
        ('tenant', 'Inquilino'),
        ('admin', 'Administrador'),
    )
    
    # Campos específicos do ArrendAI
    nif = models.CharField(max_length=9, unique=True, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='tenant')
    is_landlord_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"