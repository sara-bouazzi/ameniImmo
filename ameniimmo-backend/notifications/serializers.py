from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    annonce_titre = serializers.CharField(source='annonce.titre', read_only=True, allow_null=True)
    annonce_id = serializers.IntegerField(source='annonce.id', read_only=True, allow_null=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'type', 'message', 'date', 'statut', 'destinataire', 'annonce', 'annonce_titre', 'annonce_id']
        read_only_fields = ['id', 'date']

