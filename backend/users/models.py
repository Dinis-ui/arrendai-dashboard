from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class PlanoSubscricao(models.Model):
    nome = models.CharField(max_length=50)  # Ex: "Free", "Premium", "Business"
    max_propriedades = models.IntegerField(default=1)
    max_anuncios = models.IntegerField(default=1)
    preco = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    
    def __str__(self):
        return f"Plano {self.nome} ({self.preco}€)"
# --- TABELA 1: OS UTILIZADORES ---
class User(AbstractUser):
    ROLE_CHOICES = (
        ('tenant', 'Inquilino'),
        ('landlord', 'Senhorio'),
        ('admin', 'Administrador'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='tenant')
    nome_completo = models.CharField(max_length=255, blank=True, null=True)
    nif = models.CharField(max_length=9, blank=True, null=True, unique=True)
    
    # Novos campos para o perfil do Senhorio
    telefone = models.CharField(max_length=20, blank=True, null=True) # <-- AQUI ESTÁ O NOVO CAMPO
    iban = models.CharField(max_length=34, blank=True, null=True)
    morada_fiscal = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.username
    
    plano = models.ForeignKey(PlanoSubscricao, on_delete=models.SET_NULL, null=True, blank=True)

# --- TABELA 2: AS PROPRIEDADES ---
class Propriedade(models.Model):
    senhorio = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    morada = models.CharField(max_length=255)
    area = models.DecimalField(max_digits=8, decimal_places=2)
    valor_estimado = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=50, default='Vazio (Pronto a anunciar)')
    data_criacao = models.DateTimeField(auto_now_add=True)
    
    TIPO_CHOICES = (
        ('apartamento', 'Apartamento'),
        ('moradia', 'Moradia'),
        ('quarto', 'Quarto'),
    )
    tipo_casa = models.CharField(max_length=20, choices=TIPO_CHOICES, default='apartamento')
    foto_principal = models.ImageField(upload_to='propriedades/', blank=True, null=True)

    STATUS_APROVACAO_CHOICES = (
        ('pendente', 'Pendente de Aprovação'),
        ('aprovado', 'Aprovado'),
        ('rejeitado', 'Rejeitado'),
    )
    status_aprovacao = models.CharField(
        max_length=20, 
        choices=STATUS_APROVACAO_CHOICES, 
        default='pendente'
    )

    anuncio_publicado = models.BooleanField(default=False)
    titulo_anuncio = models.CharField(max_length=255, blank=True, null=True)
    preco_anuncio = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return self.morada
    
    descricao = models.TextField(blank=True, null=True, default="Fantástico imóvel com excelentes áreas e muita luz natural. Localizado numa zona tranquila e com ótimos acessos.")
    comodidades = models.CharField(max_length=255, blank=True, null=True, default="Cozinha Equipada, Excelente Exposição Solar, Zona Tranquila")