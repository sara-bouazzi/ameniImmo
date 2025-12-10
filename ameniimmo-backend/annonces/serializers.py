from rest_framework import serializers
from .models import Immobilier


class ImmobilierSerializer(serializers.ModelSerializer):
    type_bien = serializers.SerializerMethodField()
    proprietaire_username = serializers.CharField(source='proprietaire.username', read_only=True)

    class Meta:
        model = Immobilier
        fields = '__all__'
        read_only_fields = ('proprietaire',)

    def get_type_bien(self, obj):
        """Détermine le type de bien en fonction du modèle"""
        model_name = obj.__class__.__name__
        type_map = {
            'Logement': 'Logement',
            'EspaceTravail': 'Espace de travail',
            'Terrain': 'Terrain',
            'PlaceDeParc': 'Place de parc',
            'Immobilier': 'Immobilier'
        }
        return type_map.get(model_name, 'Immobilier')
