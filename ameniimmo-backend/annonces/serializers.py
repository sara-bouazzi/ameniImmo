from rest_framework import serializers
from .models import Immobilier, ImageImmobilier


class ImageImmobilierSerializer(serializers.ModelSerializer):
    """Serializer pour les images d'une annonce"""
    class Meta:
        model = ImageImmobilier
        fields = ['id', 'image', 'description', 'ordre', 'date_ajout']
        read_only_fields = ['date_ajout']


class ImmobilierSerializer(serializers.ModelSerializer):
    proprietaire_username = serializers.CharField(source='proprietaire.username', read_only=True)
    images = ImageImmobilierSerializer(many=True, read_only=True)

    class Meta:
        model = Immobilier
        fields = '__all__'
        read_only_fields = ('proprietaire',)
