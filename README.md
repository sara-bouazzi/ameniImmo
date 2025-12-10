# AmeniImmo - Plateforme Immobilière

## 📋 Description
AmeniImmo est une plateforme web complète de gestion d'annonces immobilières en Tunisie. Elle permet aux propriétaires de publier leurs biens, aux visiteurs de consulter les annonces, et aux administrateurs de valider les publications.

## 🏗️ Architecture du Projet

```
ameniimmo/
├── ameniimmo-backend/     # API Django REST Framework + MongoDB
└── ameniimmo-frontend/    # Application React
```

## 🚀 Démarrage du Projet

### Prérequis
- Python 3.11
- Node.js 18+
- MongoDB Atlas (compte cloud)

### 1. Backend Django

**Terminal 1 :**
```powershell
cd F:\1Work\amenImmo\Projet\ameniimmo-backend
python manage.py runserver
```

✅ **Backend disponible sur** : http://127.0.0.1:8000

### 2. Frontend React

**Terminal 2 :**
```powershell
cd F:\1Work\amenImmo\Projet\ameniimmo-frontend
npm start
```

✅ **Frontend disponible sur** : http://localhost:3000

---

## 👥 Comptes de Test

### Créer un Admin
```powershell
cd ameniimmo-backend
python manage.py create_admin
```

### Créer d'autres comptes
Utilisez la page d'inscription : http://localhost:3000/register

**Rôles disponibles :**
- **Admin** : Dashboard de gestion et approbation
- **Propriétaire** : Créer et gérer des annonces
- **Visiteur** : Consulter les annonces, favoris, visites

---

## 📦 Installation (Première fois)

### Backend
```powershell
cd ameniimmo-backend
pip install -r requirements.txt
python manage.py migrate --fake
python manage.py create_admin  # Créer les comptes admin
```

**Packages principaux :**
- Django 3.1.12
- djangorestframework 3.12.4
- djangorestframework-simplejwt 4.8.0
- django-cors-headers 3.10.0
- djongo 1.3.7
- pymongo 3.11.4
- dnspython 1.16.0
- python-decouple 3.8

### Frontend
```powershell
cd ameniimmo-frontend
npm install
```

**Packages principaux :**
- React 18
- React Router 6
- Axios
- TailwindCSS 3

---

## 🔑 Fonctionnalités

### 🏠 Page d'Accueil (Public)
- Affichage des annonces approuvées
- Hero section avec CTA
- Accessible sans connexion

### 👤 Authentification
- **Inscription** : Choix du rôle (Propriétaire/Visiteur)
- **Connexion** : JWT avec access + refresh tokens
- **Déconnexion** : Suppression des tokens

### 👨‍💼 Propriétaire (owner)
- ✅ Créer des annonces (en attente d'approbation)
- ✅ Voir uniquement ses propres annonces
- ✅ Supprimer ses annonces
- 📋 Types de biens : Immobilier, Logement, Terrain, Espace de travail, Place de parc

### 🔍 Visiteur
- ✅ Consulter les annonces approuvées
- 🔜 Ajouter aux favoris
- 🔜 Demander des visites

### 🛡️ Admin
- ✅ Dashboard complet
- ✅ Statistiques (Total, Approuvées, En attente)
- ✅ Approuver/Rejeter les annonces
- ✅ Supprimer les annonces
- ✅ Filtres : Toutes, En attente, Approuvées

---

## 🛠️ Commandes Utiles

### Backend

**Créer un superuser/admin :**
```powershell
cd ameniimmo-backend
python manage.py create_admin
```

**Migrations (avec djongo) :**
```powershell
python manage.py makemigrations
python manage.py migrate --fake  # djongo nécessite --fake
```

**Shell Django :**
```powershell
python manage.py shell
```

### Frontend

**Installer les dépendances :**
```powershell
npm install
```

**Build production :**
```powershell
npm run build
```

---

**Dernière mise à jour** : 10 décembre 2025
