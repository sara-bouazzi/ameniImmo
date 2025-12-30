# 🎯 DÉPLOIEMENT POUR TON REPO GITHUB

## ✅ TON REPO : `sara-bouazzi/amenilmmo`

Structure actuelle :
```
amenilmmo/
├── ameniimmo-backend/    ← Django (Python)
└── ameniimmo-frontend/   ← React
```

---

## 📋 ÉTAPES SIMPLES

### **ÉTAPE 1 : Modifier le service auth.js** (2 min)

Ouvre : `ameniimmo-frontend/src/services/auth.js`

Remplace :
```javascript
const API_URL = "http://127.0.0.1:8000/api/auth/";
```

Par :
```javascript
const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
const API_URL = `${BASE_URL}/api/auth/`;
```

---

### **ÉTAPE 2 : Pousser les modifications sur GitHub** (2 min)

```powershell
cd F:\1Work\amenImmo\Projet
git add .
git commit -m "Préparation pour déploiement"
git push
```

---

### **ÉTAPE 3 : Créer MongoDB Atlas** (5 min)

1. **Aller sur** : https://www.mongodb.com/cloud/atlas/register
2. **Sign Up** avec Google/GitHub
3. **Créer un cluster GRATUIT** :
   - Plan : **M0 FREE**
   - Provider : **AWS**
   - Region : **Frankfurt** (Europe)
4. **Database Access** :
   - Add New User
   - Username : `ameniimmo`
   - Password : (générer un mot de passe - COPIE-LE)
5. **Network Access** :
   - Add IP Address
   - Allow Access from Anywhere : `0.0.0.0/0`
6. **Connect** :
   - Connect your application
   - Copier l'URI :
   ```
   mongodb+srv://ameniimmo:<password>@cluster0.xxxxx.mongodb.net/
   ```
   - Remplace `<password>` par ton mot de passe

---

### **ÉTAPE 4 : Déployer Backend sur Render** (10 min)

1. **Aller sur** : https://render.com
2. **Sign Up** avec ton compte GitHub
3. **New +** → **Web Service**
4. **Connect repository** : `sara-bouazzi/amenilmmo`
5. **Configuration** :

```
Name: ameniimmo-backend
Region: Frankfurt
Branch: main
Root Directory: ameniimmo-backend
Runtime: Python 3
Build Command: chmod +x build.sh && ./build.sh
Start Command: gunicorn ameniimmo.wsgi:application --bind 0.0.0.0:$PORT
Instance Type: Free
```

6. **Environment Variables** (cliquer "Add Environment Variable") :

```
SECRET_KEY = django-insecure-change-moi-production-123456789
DEBUG = False
USE_SQLITE = False
MONGODB_URI = mongodb+srv://ameniimmo:TON-PASSWORD@cluster0.xxxxx.mongodb.net/
MONGODB_DB_NAME = ameniimmo_db
PYTHON_VERSION = 3.11.0
```

7. **Create Web Service** → Attendre 5-10 minutes

✅ **Note l'URL** : `https://ameniimmo-backend.onrender.com`

---

### **ÉTAPE 5 : Déployer Frontend sur Vercel** (5 min)

#### **Méthode Simple (Interface Web)** :

1. **Aller sur** : https://vercel.com
2. **Sign Up** avec GitHub (tu as déjà fait ça)
3. **Add New** → **Project**
4. **Import** ton repo : `sara-bouazzi/amenilmmo`
5. **Configuration** :

```
Project Name: ameniimmo
Framework Preset: Create React App
Root Directory: ameniimmo-frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

6. **Environment Variables** :

```
REACT_APP_API_URL = https://ameniimmo-backend.onrender.com
```

7. **Deploy** → Attendre 2-3 minutes

✅ **URL du site** : `https://ameniimmo.vercel.app`

---

### **ÉTAPE 6 : Créer un Admin** (2 min)

**Sur Render Dashboard** :
1. Va sur ton service `ameniimmo-backend`
2. Clique sur **Shell** (en haut à droite)
3. Tape :
```bash
python manage.py create_admin
```

**Identifiants** :
- Email : `admin@amenimmo.tn`
- Mot de passe : `Admin@2024`

---

### **ÉTAPE 7 : Mettre à jour CORS** (2 min)

**Sur Render** :
1. Va dans **Environment**
2. Ajoute :
```
FRONTEND_URL = https://ameniimmo.vercel.app
```

**OU** dans `settings.py`, remplace `https://*.vercel.app` par ton URL exacte :
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://ameniimmo.vercel.app",
]
```

Push sur GitHub si tu modifies le code.

---

## ✅ VÉRIFICATION FINALE

1. **Ouvre** : `https://ameniimmo.vercel.app`
2. **Inscris-toi** avec un nouveau compte
3. **Crée une annonce**
4. **Vérifie la carte**

---

## 🔄 MISES À JOUR FUTURES

```powershell
cd F:\1Work\amenImmo\Projet

# Faire tes modifications...

git add .
git commit -m "Description des changements"
git push
```

✅ Render et Vercel redéploient **automatiquement** !

---

## 🆘 PROBLÈMES ?

### Backend lent au premier chargement
👉 Normal = service gratuit se réveille (30-50 sec)

### CORS Error
👉 Vérifie que `REACT_APP_API_URL` est correct sur Vercel

### 502 Bad Gateway
👉 Backend Render est en train de démarrer, attends 1-2 min

---

## 🎉 URLS FINALES

- 🌐 **Site** : https://ameniimmo.vercel.app
- 🔧 **API** : https://ameniimmo-backend.onrender.com/api/
- 💾 **DB** : MongoDB Atlas (cloud)

**Tout est gratuit !** 🚀
