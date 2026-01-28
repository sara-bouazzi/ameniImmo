from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Immobilier, ImageImmobilier
from .serializers import ImmobilierSerializer, ImageImmobilierSerializer


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

	@action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser], permission_classes=[IsAuthenticated])
	def upload_images(self, request, pk=None):
		"""Upload une ou plusieurs images pour une annonce
		
		Paramètres:
		- images: liste de fichiers images
		- replace: si True, remplace toutes les images existantes (défaut: False)
		"""
		immobilier = self.get_object()
		
		# Vérifier que l'utilisateur est le propriétaire
		if immobilier.proprietaire != request.user:
			return Response(
				{'error': 'Vous n\'êtes pas autorisé à modifier cette annonce'},
				status=status.HTTP_403_FORBIDDEN
			)
		
		# Récupérer les fichiers images
		images = request.FILES.getlist('images')
		if not images:
			return Response(
				{'error': 'Aucune image fournie'},
				status=status.HTTP_400_BAD_REQUEST
			)
		
		# Vérifier si on doit remplacer les images existantes
		replace = request.data.get('replace', 'false').lower() == 'true'
		
		if replace:
			# Supprimer toutes les images existantes
			ImageImmobilier.objects.filter(immobilier=immobilier).delete()
			start_order = 0
		else:
			# Commencer après les images existantes
			existing_count = ImageImmobilier.objects.filter(immobilier=immobilier).count()
			start_order = existing_count
		
		# Créer les objets ImageImmobilier
		created_images = []
		for i, image_file in enumerate(images):
			image_obj = ImageImmobilier.objects.create(
				immobilier=immobilier,
				image=image_file,
				ordre=start_order + i
			)
			created_images.append(image_obj)
		
		# Sérialiser et retourner les images créées
		serializer = ImageImmobilierSerializer(created_images, many=True)
		return Response(serializer.data, status=status.HTTP_201_CREATED)

	@action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
	def delete_image(self, request, pk=None):
		"""Supprimer une image d'une annonce"""
		immobilier = self.get_object()
		
		# Vérifier que l'utilisateur est le propriétaire
		if immobilier.proprietaire != request.user:
			return Response(
				{'error': 'Vous n\'êtes pas autorisé à modifier cette annonce'},
				status=status.HTTP_403_FORBIDDEN
			)
		
		image_id = request.data.get('image_id')
		if not image_id:
			return Response(
				{'error': 'ID de l\'image requis'},
				status=status.HTTP_400_BAD_REQUEST
			)
		
		try:
			image = ImageImmobilier.objects.get(id=image_id, immobilier=immobilier)
			image.delete()
			return Response(
				{'message': 'Image supprimée avec succès'},
				status=status.HTTP_200_OK
			)
		except ImageImmobilier.DoesNotExist:
			return Response(
				{'error': 'Image non trouvée'},
				status=status.HTTP_404_NOT_FOUND
			)
