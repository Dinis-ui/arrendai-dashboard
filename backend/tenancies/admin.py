from django.contrib import admin
from .models import Application, Tenancy, Document

admin.site.register(Application)
admin.site.register(Tenancy)
admin.site.register(Document)