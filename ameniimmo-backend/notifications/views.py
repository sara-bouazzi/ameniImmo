from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    """API endpoint pour gérer les notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retourne uniquement les notifications de l'utilisateur connecté"""
        return Notification.objects.filter(destinataire=self.request.user)

    @action(detail=False, methods=['get'])
    def non_lues(self, request):
        """Récupère uniquement les notifications non lues"""
        notifications = self.get_queryset().filter(statut='non_lu')
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def marquer_toutes_lues(self, request):
        """Marque toutes les notifications comme lues"""
        updated = self.get_queryset().filter(statut='non_lu').update(statut='lu')
        return Response({
            'message': f'{updated} notification(s) marquée(s) comme lue(s)',
            'count': updated
        })

    @action(detail=True, methods=['post'])
    def marquer_lu(self, request, pk=None):
        """Marque une notification spécifique comme lue"""
        notification = self.get_object()
        notification.statut = 'lu'
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)

