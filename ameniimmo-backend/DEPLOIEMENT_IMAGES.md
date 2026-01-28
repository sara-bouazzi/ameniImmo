# Guide de déploiement - Gestion des images

## Option 1 : Stockage local sur serveur (Simple)

### Configuration
Dans `settings.py`, assurez-vous que :
```python
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

### Lors du déploiement :
1. Créer un dossier `media/` persistant en dehors du code
2. Configurer le serveur web (nginx/Apache) pour servir les fichiers statiques
3. Sauvegarder régulièrement le dossier `media/`

### Inconvénients :
- Les images peuvent être perdues lors des mises à jour
- Difficile à scaler sur plusieurs serveurs
- Pas de CDN pour la performance

---

## Option 2 : Cloudinary (Recommandé - Gratuit jusqu'à 25GB)

### Installation
```bash
pip install cloudinary django-cloudinary-storage
```

### Configuration dans `settings.py`
```python
# Ajouter à INSTALLED_APPS (AVANT 'django.contrib.staticfiles')
INSTALLED_APPS = [
    # ...
    'cloudinary_storage',
    'cloudinary',
    # ...
]

# Configuration Cloudinary
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': 'votre_cloud_name',
    'API_KEY': 'votre_api_key',
    'API_SECRET': 'votre_api_secret'
}

# Remplacer DEFAULT_FILE_STORAGE
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
```

### Variables d'environnement (.env)
```
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

### Avantages :
✅ Images sauvegardées dans le cloud (jamais perdues)
✅ CDN intégré (chargement rapide partout dans le monde)
✅ Transformations d'images automatiques (resize, compress)
✅ Gratuit jusqu'à 25GB et 25,000 transformations/mois
✅ Aucun changement de code nécessaire dans le frontend

---

## Option 3 : AWS S3 (Pour grandes applications)

### Installation
```bash
pip install django-storages boto3
```

### Configuration dans `settings.py`
```python
INSTALLED_APPS = [
    # ...
    'storages',
    # ...
]

# Configuration AWS S3
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = 'votre-bucket-name'
AWS_S3_REGION_NAME = 'eu-west-3'  # Paris
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = 'public-read'
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'

# Utiliser S3 pour les media files
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'
```

---

## Recommandation pour votre projet

**Pour commencer** : Utilisez le stockage local avec sauvegarde régulière

**Pour la production** : Migrez vers Cloudinary (gratuit et simple)

**Instructions Cloudinary** :
1. Créer un compte sur https://cloudinary.com
2. Copier Cloud Name, API Key, API Secret
3. Installer les packages
4. Modifier settings.py
5. Déployer → Les images seront automatiquement uploadées sur Cloudinary

Aucun changement dans le code frontend nécessaire !
