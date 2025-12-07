from django.contrib import admin
from .models import Utilisateur, Favori

@admin.register(Utilisateur)
class UtilisateurAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "role", "telephone", "is_active", "is_staff")
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("username", "email", "telephone")

@admin.register(Favori)
class FavoriAdmin(admin.ModelAdmin):
    list_display = ("utilisateur", "immobilier", "date_ajout")
    list_filter = ("date_ajout",)
    search_fields = ("utilisateur__username", "immobilier__titre")
