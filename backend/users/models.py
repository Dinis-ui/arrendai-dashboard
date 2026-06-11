from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Opções para o tipo de conta
    ROLE_CHOICES = (
        ('tenant', 'Inquilino'),
    ('landlord', 'Senhorio'), # Agora o Django aceita 'landlord'
    ('admin', 'Administrador'),
    )

    # Os nossos campos extra
    nome_completo = models.CharField(max_length=255, blank=True, null=True)
    nif = models.CharField(max_length=9, blank=True, null=True, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='inquilino')

    def __str__(self):
        return self.username