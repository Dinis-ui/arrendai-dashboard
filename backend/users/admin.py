from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Isto diz ao painel para mostrar a nossa tabela de Utilizadores
admin.site.register(User, UserAdmin)

# Register your models here.
