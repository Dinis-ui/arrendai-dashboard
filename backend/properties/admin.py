from django.contrib import admin
from .models import Property

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'city', 'typology', 'monthly_rent')
    list_filter = ('typology', 'city')
    search_fields = ('title', 'city', 'zip_code')