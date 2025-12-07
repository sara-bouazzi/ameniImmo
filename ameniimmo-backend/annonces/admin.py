from django.contrib import admin
from .models import (
    Immobilier, Visite, Agence,
    Logement, EspaceTravail, Terrain, PlaceDeParc
)

@admin.register(Immobilier)
class ImmobilierAdmin(admin.ModelAdmin):
    list_display = ('titre', 'prix', 'ville', 'statut', 'approuve')
    list_filter = ('approuve', 'ville', 'statut')
    search_fields = ('titre', 'description')

admin.site.register(Visite)
admin.site.register(Agence)
admin.site.register(Logement)
admin.site.register(EspaceTravail)
admin.site.register(Terrain)
admin.site.register(PlaceDeParc)
