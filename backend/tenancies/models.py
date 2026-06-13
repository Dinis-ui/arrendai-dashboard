from django.db import models
from django.conf import settings
from users.models import Propriedade, Notificacao # <-- Importei a Notificacao daqui
from django.db.models.signals import post_save # <-- Importei o gatilho
from django.dispatch import receiver

class Application(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pendente'),
        ('approved', 'Aprovada'),
        ('rejected', 'Rejeitada'),
    )
    property = models.ForeignKey(Propriedade, on_delete=models.CASCADE, related_name='applications')
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    message = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Candidatura: {self.tenant.username} -> {self.property.morada}"

class Tenancy(models.Model):
    property = models.ForeignKey(Propriedade, on_delete=models.PROTECT, related_name='active_tenancies')
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='my_tenancies')
    start_date = models.DateField()
    end_date = models.DateField()
    monthly_rent = models.DecimalField(max_digits=8, decimal_places=2)
    is_active = models.BooleanField(default=True)
    payment_status = models.CharField(max_length=20, default='pendente')

    def __str__(self):
        return f"Contrato: {self.property.morada} ({self.tenant.username})"

class Document(models.Model):
    DOC_TYPES = (
        ('identificacao', 'Cartão de Cidadão / Passaporte'),
        ('rendimentos', 'Recibos de Vencimento / IRS'),
        ('fiador', 'Documentos do Fiador'),
        ('outro', 'Outro Documento'),
    )
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=20, choices=DOC_TYPES)
    file = models.FileField(upload_to='tenant_documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_document_type_display()} - {self.tenant.username}"

class Chat(models.Model):
    property = models.ForeignKey(Propriedade, on_delete=models.CASCADE)
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL)
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


# ==========================================
# GATILHOS (SIGNALS) PARA NOTIFICAÇÕES
# ==========================================
@receiver(post_save, sender=Application)
def criar_notificacao_candidatura(sender, instance, created, **kwargs):
    # 1. Se a candidatura acabou de ser CRIADA -> Notifica o Senhorio
    if created:
        Notificacao.objects.create(
            user=instance.property.senhorio,
            titulo="Nova Candidatura Recebida! 🎉",
            mensagem=f"O inquilino {instance.tenant.username} candidatou-se ao teu imóvel: {instance.property.titulo_anuncio or instance.property.morada}."
        )
    # 2. Se a candidatura foi ATUALIZADA (Ex: aceite ou rejeitada) -> Notifica o Inquilino
    else:
        if instance.status == 'approved':
            Notificacao.objects.create(
                user=instance.tenant,
                titulo="Candidatura Aprovada! 🥳",
                mensagem=f"Parabéns! A tua candidatura para o imóvel {instance.property.titulo_anuncio or instance.property.morada} foi aceite pelo senhorio."
            )
        elif instance.status == 'rejected':
            Notificacao.objects.create(
                user=instance.tenant,
                titulo="Candidatura Rejeitada 😔",
                mensagem=f"Infelizmente, o senhorio decidiu não avançar com a tua candidatura para o imóvel {instance.property.titulo_anuncio or instance.property.morada}."
            )