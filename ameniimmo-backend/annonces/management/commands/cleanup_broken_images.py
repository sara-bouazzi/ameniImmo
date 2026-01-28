from django.core.management.base import BaseCommand
from annonces.models import ImageImmobilier
import os


class Command(BaseCommand):
    help = 'Nettoie les références d\'images dans la DB dont les fichiers n\'existent plus'

    def handle(self, *args, **options):
        deleted_count = 0
        
        for img in ImageImmobilier.objects.all():
            if img.image:
                # Vérifier si le fichier existe
                if not os.path.isfile(img.image.path):
                    self.stdout.write(self.style.WARNING(f'Fichier manquant: {img.image.name}'))
                    img.delete()
                    deleted_count += 1
        
        if deleted_count == 0:
            self.stdout.write(self.style.SUCCESS('Toutes les images ont des fichiers valides'))
        else:
            self.stdout.write(self.style.SUCCESS(f'{deleted_count} référence(s) d\'image(s) supprimée(s)'))
