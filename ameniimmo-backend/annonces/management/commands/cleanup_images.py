from django.core.management.base import BaseCommand
from django.conf import settings
from annonces.models import ImageImmobilier
import os


class Command(BaseCommand):
    help = 'Nettoie les images orphelines du dossier media/photos/'

    def handle(self, *args, **options):
        media_photos_path = os.path.join(settings.MEDIA_ROOT, 'photos')
        
        if not os.path.exists(media_photos_path):
            self.stdout.write(self.style.WARNING(f'Le dossier {media_photos_path} n\'existe pas'))
            return
        
        # Récupérer tous les noms de fichiers dans la base de données
        db_image_files = set()
        for img in ImageImmobilier.objects.all():
            if img.image:
                # Extraire juste le nom du fichier (sans le chemin 'photos/')
                image_name = os.path.basename(img.image.name)
                db_image_files.add(image_name)
        
        self.stdout.write(f'Images dans la DB: {len(db_image_files)}')
        
        # Parcourir tous les fichiers dans le dossier photos
        deleted_count = 0
        for filename in os.listdir(media_photos_path):
            file_path = os.path.join(media_photos_path, filename)
            
            # Ignorer les sous-dossiers
            if os.path.isdir(file_path):
                continue
            
            # Si le fichier n'est pas dans la base de données
            if filename not in db_image_files:
                try:
                    os.remove(file_path)
                    deleted_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Supprimé: {filename}'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Erreur lors de la suppression de {filename}: {e}'))
        
        if deleted_count == 0:
            self.stdout.write(self.style.SUCCESS('Aucune image orpheline trouvée'))
        else:
            self.stdout.write(self.style.SUCCESS(f'{deleted_count} image(s) orpheline(s) supprimée(s)'))
