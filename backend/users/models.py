from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings # Precisamos disto para ligar a propriedade ao senhorio

# --- TABELA 1: OS UTILIZADORES ---
class User(AbstractUser):
    ROLE_CHOICES = (
        ('inquilino', 'Inquilino'),
        ('senhorio', 'Senhorio'),
        ('admin', 'Administrador'),
    )

    nome_completo = models.CharField(max_length=255, blank=True, null=True)
    nif = models.CharField(max_length=9, blank=True, null=True, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='inquilino')

    def __str__(self):
        return self.username  # Faltava isto na tua imagem!


# --- TABELA 2: AS PROPRIEDADES ---
class Propriedade(models.Model):
    # A ligação: Cada propriedade pertence a um senhorio (User)
    senhorio = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # Os dados da casa
    morada = models.CharField(max_length=255)
    area = models.DecimalField(max_digits=8, decimal_places=2)
    valor_estimado = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=50, default='Vazio (Pronto a anunciar)')
    
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.morada