# Script de recréation de l'environnement virtuel avec Python 3.10

# 1. Supprimez l'ancien environnement virtuel
Remove-Item -Recurse -Force venv -ErrorAction SilentlyContinue

# 2. Créez un nouvel environnement avec Python 3.10
py -3.10 -m venv venv

# 3. Activez l'environnement
.\venv\Scripts\Activate.ps1

# 4. Installez les dépendances
pip install --upgrade pip
pip install django==4.1.13
pip install djangorestframework
pip install django-cors-headers
pip install python-decouple
pip install djongo
pip install "pymongo[srv]==3.11.4"
pip install sqlparse
pip install pillow
pip install djangorestframework-simplejwt
pip install certifi

Write-Host ""
Write-Host "✅ Installation terminée !" -ForegroundColor Green
Write-Host "Lancez maintenant : python manage.py runserver" -ForegroundColor Yellow
