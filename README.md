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

## 🗄️ Base de Données

### MongoDB Atlas
- **Type** : MongoDB Atlas (Cloud)
- **Connection** : Définie dans `.env` (backend)

**Créer le fichier `.env` dans `ameniimmo-backend/` :**
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appname>
MONGODB_DB_NAME=<database_name>
```

⚠️ **Important** : Remplacez les valeurs avec vos propres credentials MongoDB Atlas

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

## 📂 Structure de la Base de Données

### Collections MongoDB

**users_utilisateur**
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  role: String, // "admin", "owner", "visiteur"
  telephone: String,
  adresse: String,
  dateNaissance: Date,
  genre: String,
  photo: String
}
```

**annonces_immobilier**
```javascript
{
  _id: ObjectId,
  titre: String,
  description: String,
  prix: Float,
  surface: Float,
  region: String,
  ville: String,
  gouvernorat: String,
  fonctionnalite: String,
  statut: String, // "à louer", "à vendre"
  approuve: Boolean, // false par défaut
  proprietaire: ObjectId, // Référence vers Utilisateur
  datePublication: Date,
  type_bien: String // "Logement", "Terrain", etc.
}
```

---

## 🔧 API Endpoints

### Authentification
```
POST   /api/auth/register/       # Inscription
POST   /api/auth/login/          # Connexion
GET    /api/auth/profile/        # Profil utilisateur (auth requise)
POST   /api/auth/token/refresh/  # Rafraîchir le token
```

### Annonces
```
GET    /api/annonces/            # Liste toutes les annonces
POST   /api/annonces/            # Créer une annonce (auth requise)
GET    /api/annonces/{id}/       # Détail d'une annonce
PATCH  /api/annonces/{id}/       # Modifier une annonce (admin)
DELETE /api/annonces/{id}/       # Supprimer une annonce (admin/propriétaire)
```

### Admin Django
```
http://127.0.0.1:8000/admin/
```

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

## ⚠️ Problèmes Connus

### 1. Djongo et Filtres BooleanField
**Problème** : `Immobilier.objects.filter(approuve=True)` génère une erreur SQL.  
**Solution** : Utiliser `.all()` et filtrer en JavaScript côté frontend.

### 2. Migrations Djongo
**Problème** : Les migrations ALTER TABLE échouent.  
**Solution** : Toujours utiliser `python manage.py migrate --fake`.

### 3. Port déjà utilisé (Backend)
**Problème** : "Address already in use" sur le port 8000.  
**Solution** :
```powershell
Get-Process -Name python | Stop-Process -Force
```

### 4. MongoDB Atlas Timeout
**Problème** : Connexion lente ou timeout.  
**Solution** : Vérifier l'IP whitelisting (0.0.0.0/0) dans MongoDB Atlas.

---

## 🎨 Design & UI

- **Framework CSS** : TailwindCSS 3
- **Icônes** : SVG inline
- **Thème** : Gradient bleu/indigo
- **Responsive** : Mobile-first design

---

## 📝 TODO / Fonctionnalités Futures

- [ ] Upload d'images pour les annonces
- [ ] Système de favoris pour les visiteurs
- [ ] Demandes de visite avec calendrier
- [ ] Filtres de recherche avancés (prix, surface, ville)
- [ ] Pagination des annonces
- [ ] Notifications en temps réel
- [ ] Tableau de bord propriétaire (statistiques)
- [ ] Messagerie entre visiteurs et propriétaires
- [ ] Géolocalisation avec carte interactive

---

## 📞 Support

Pour toute question ou problème :
1. Vérifier que MongoDB Atlas est accessible
2. Vérifier que les deux serveurs (backend + frontend) sont lancés
3. Consulter les logs dans les terminaux
4. Vérifier le fichier `.env` pour les credentials MongoDB

---

## 🔐 Sécurité

- ⚠️ **NE JAMAIS** commiter le fichier `.env` sur GitHub
- ✅ `.env` est dans `.gitignore`
- ✅ Mots de passe hashés avec Django (PBKDF2)
- ✅ JWT pour l'authentification
- ✅ CORS configuré pour le développement

---

## 📄 Licence

Projet universitaire - Tous droits réservés

---

**Dernière mise à jour** : 10 décembre 2025
