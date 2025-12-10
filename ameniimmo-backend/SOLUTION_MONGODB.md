# Guide de résolution du problème MongoDB Atlas avec Python 3.11

## Problème
Python 3.11 avec OpenSSL 3.0 sur Windows a des incompatibilités SSL/TLS avec MongoDB Atlas.

## Solution : Utiliser Python 3.10

### Étape 1 : Installer Python 3.10
1. Téléchargez Python 3.10.x depuis : https://www.python.org/downloads/
2. Installez-le (assurez-vous de cocher "Add Python to PATH")

### Étape 2 : Recréer l'environnement virtuel avec Python 3.10
```powershell
# Dans le dossier ameniimmo-backend
# Supprimez l'ancien venv
Remove-Item -Recurse -Force venv

# Créez un nouveau venv avec Python 3.10
py -3.10 -m venv venv

# Activez le venv
.\venv\Scripts\Activate.ps1

# Installez les dépendances
pip install django djangorestframework django-cors-headers python-decouple
pip install djongo pymongo==3.12.3 sqlparse
pip install pillow
pip install djangorestframework-simplejwt
```

### Étape 3 : Lancez le serveur
```powershell
python manage.py migrate
python manage.py runserver
```

## Alternative : Si vous ne pouvez pas installer Python 3.10

Utilisez SQLite pour le développement local et MongoDB Atlas uniquement en production.
Le fichier settings.py a déjà été configuré avec SQLite.
