from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from .models import Immobilier
from .serializers import ImmobilierSerializer


class ImmobilierViewSet(viewsets.ModelViewSet):
	"""API endpoint pour gérer les annonces immobilières"""
	serializer_class = ImmobilierSerializer
	permission_classes = [IsAuthenticatedOrReadOnly]

	def get_queryset(self):
		# Retourne toutes les annonces (djongo a des problèmes avec filter sur BooleanField)
		return Immobilier.objects.all()

	def perform_create(self, serializer):
		"""Enregistre automatiquement le propriétaire lors de la création"""
		serializer.save(proprietaire=self.request.user)
