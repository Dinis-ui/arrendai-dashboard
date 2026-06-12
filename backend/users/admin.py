from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Propriedade

class CustomUserAdmin(UserAdmin):
    # Adiciona os campos personalizados do utilizador no painel de Admin
    # Incluídos 'iban' e 'morada_fiscal' para corrigir o problema de visualização
    fieldsets = UserAdmin.fieldsets + (
        ('Campos ArrendAI (Personalizados)', {
            'fields': ('role', 'nif', 'nome_completo', 'iban', 'morada_fiscal')
        }),
    )
    list_display = ('username', 'email', 'nome_completo', 'role', 'is_staff')
    list_filter = ('role', 'is_staff')

# Registo do CustomUserAdmin existente
admin.site.register(User, CustomUserAdmin)


# --- Painel de Administração para as Propriedades ---
@admin.register(Propriedade)
class PropriedadeAdmin(admin.ModelAdmin):
    # Colunas que o Admin vai ver na tabela geral de propriedades
    list_display = ('morada', 'senhorio', 'tipo_casa', 'status_aprovacao', 'valor_estimado', 'data_criacao')
    
    # Filtros laterais para o Admin encontrar rapidamente o que está "pendente"
    list_filter = ('status_aprovacao', 'tipo_casa', 'data_criacao')
    
    # Campos pelos quais o Admin pode pesquisar (ex: pesquisar por morada ou username do senhorio)
    search_fields = ('morada', 'senhorio__username', 'senhorio__email')
    
    # Permite ao Admin alterar o estado de aprovação diretamente na listagem, sem ter de abrir propriedade a propriedade!
    list_editable = ('status_aprovacao',)
    
    # Organiza o ecrã de edição de uma propriedade em secções limpas
    fieldsets = (
        ('Informação Básica', {
            'fields': ('senhorio', 'morada', 'tipo_casa', 'foto_principal')
        }),
        ('Detalhes Financeiros e Físicos', {
            'fields': ('area', 'valor_estimado', 'estado')
        }),
        ('Configurações do Anúncio Público', {
            'fields': ('anuncio_publicado', 'titulo_anuncio', 'preco_anuncio'),
            'description': 'Detalhes de como a propriedade aparece na montra para os inquilinos.'
        }),
        ('Moderação do Sistema', {
            'fields': ('status_aprovacao',),
            'description': 'Altere para "Aprovado" para que a propriedade fique visível no portal dos Inquilinos.'
        }),
    )