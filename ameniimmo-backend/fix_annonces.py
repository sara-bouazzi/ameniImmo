import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ameniimmo.settings')
django.setup()

from annonces.models import Immobilier
from users.models import Utilisateur

# Trouver le premier propriétaire
owner = Utilisateur.objects.filter(role='owner').first()

if owner:
    # Compter les annonces orphelines
    orphans = Immobilier.objects.filter(proprietaire__isnull=True)
    count = orphans.count()
    
    if count > 0:
        orphans.update(proprietaire=owner)
        print(f'✅ {count} annonce(s) réassignée(s) à {owner.username}')
    else:
        print('✅ Aucune annonce orpheline')
else:
    print('❌ Aucun propriétaire trouvé')
