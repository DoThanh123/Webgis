from django.contrib import admin
from .models import shp

# Register your models here.
class ShpAdmin(admin.ModelAdmin):  
    list_display = ['name','description','upload_date']  
    

admin.site.register(shp)
