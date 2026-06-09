from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    # Dizemos ao Django para adicionar uma nova secção no ecrã com os teus campos
    fieldsets = UserAdmin.fieldsets + (
        ('Campos ArrendAI (Personalizados)', {'fields': ('role', 'nif')}),
    )

admin.site.register(User, CustomUserAdmin)