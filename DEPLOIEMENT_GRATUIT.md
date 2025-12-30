# 🚀 DÉPLOIEMENT GRATUIT - GUIDE SIMPLE

## 📊 LIMITES DES SERVICES GRATUITS

### **Render.com** (Backend)
- ❌ Se met en veille après 15 min d'inactivité (redémarre en 30-50 sec)
- ✅ 750 heures/mois gratuit
- ✅ 512 MB RAM
- ✅ Illimité en nombre de projets

### **Vercel** (Frontend)
- ✅ 100 GB bande passante/mois
- ✅ Déploiements illimités
- ✅ Performances excellentes
- ✅ SSL automatique

### **MongoDB Atlas** (Base de données)
- ✅ 512 MB stockage
- ✅ Connexions illimitées
- ✅ Backups quotidiens
- ❌ Pas de support prioritaire

---

## 🎯 ÉTAPES DE DÉPLOIEMENT

### **ÉTAPE 1 : Préparer le Backend** (5 min)

```powershell
cd F:\1Work\amenImmo\Projet\ameniimmo-backend
.\venv\Scripts\Activate.ps1
pip install gunicorn dj-database-url whitenoise
pip freeze > requirements.txt
```

**Créer fichier `runtime.txt`** :
```
python-3.11.0
```

**Créer fichier `build.sh`** :
```bash
#!/usr/bin/env bash
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
```

**Créer fichier `Procfile`** :
```
web: gunicorn ameniimmo.wsgi --log-file -
```

---

### **ÉTAPE 2 : MongoDB Atlas** (5 min)

1. **Aller sur** : https://www.mongodb.com/cloud/atlas/register
2. **Créer compte** → Plan **M0 FREE**
3. **Créer cluster** → Région **Frankfurt** (plus proche)
4. **Database Access** → Créer un utilisateur
   - Username : `ameniimmo`
   - Password : (générer un mot de passe fort)
5. **Network Access** → Add IP : `0.0.0.0/0` (accès de partout)
6. **Connect** → Copier l'URI de connexion :
   ```
   mongodb+srv://ameniimmo:<password>@cluster0.xxxxx.mongodb.net/
   ```

---

### **ÉTAPE 3 : Pousser sur GitHub** (5 min)

```powershell
cd F:\1Work\amenImmo\Projet

# Créer .gitignore
@"
__pycache__/
*.pyc
venv/
.env
db.sqlite3
*.log
node_modules/
build/
"@ | Out-File -FilePath .gitignore -Encoding utf8

git add .
git commit -m "Préparation déploiement"
```

**Sur GitHub.com** :
1. Nouveau repo : `ameniimmo`
2. Repo public ou privé (au choix)

```powershell
git remote add origin https://github.com/VOTRE-USERNAME/ameniimmo.git
git branch -M main
git push -u origin main
```

---

### **ÉTAPE 4 : Déployer Backend sur Render** (10 min)

1. **Aller sur** : https://render.com → Sign Up (avec GitHub)

2. **New +** → **Web Service**

3. **Connecter votre repo GitHub** → Sélectionner `ameniimmo`

4. **Configuration** :
   - **Name** : `ameniimmo-backend`
   - **Region** : `Frankfurt`
   - **Branch** : `main`
   - **Root Directory** : `ameniimmo-backend`
   - **Runtime** : `Python 3`
   - **Build Command** : `chmod +x build.sh && ./build.sh`
   - **Start Command** : `gunicorn ameniimmo.wsgi:application --bind 0.0.0.0:$PORT`
   - **Plan** : `Free`

5. **Environment Variables** (Ajouter) :
   ```
   SECRET_KEY = django-insecure-changez-moi-en-production-xxxxxxxxxxxxx
   DEBUG = False
   USE_SQLITE = False
   MONGODB_URI = mongodb+srv://ameniimmo:VOTRE-PASSWORD@cluster0.xxxxx.mongodb.net/
   MONGODB_DB_NAME = ameniimmo_db
   PYTHON_VERSION = 3.11.0
   ```

6. **Create Web Service** → Attendre 5-10 minutes

✅ **Backend URL** : `https://ameniimmo-backend.onrender.com`

---

### **ÉTAPE 5 : Préparer Frontend** (2 min)

**Créer fichier `.env` dans `ameniimmo-frontend/`** :
```
REACT_APP_API_URL=https://ameniimmo-backend.onrender.com
```

**Modifier tous les fichiers dans `src/services/`** :

Remplacer :
```javascript
const API_URL = "http://127.0.0.1:8000";
```

Par :
```javascript
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
```

```powershell
cd F:\1Work\amenImmo\Projet
git add .
git commit -m "Configuration API pour production"
git push
```

---

### **ÉTAPE 6 : Déployer Frontend sur Vercel** (5 min)

**Option A : Via Site Web (Plus Simple)**

1. **Aller sur** : https://vercel.com → Sign Up (avec GitHub)
2. **Add New** → **Project**
3. **Import** votre repo `ameniimmo`
4. **Configuration** :
   - **Framework Preset** : `Create React App`
   - **Root Directory** : `ameniimmo-frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `build`
5. **Environment Variables** :
   ```
   REACT_APP_API_URL = https://ameniimmo-backend.onrender.com
   ```
6. **Deploy** → Attendre 2-3 minutes

**Option B : Via Terminal**

```powershell
cd F:\1Work\amenImmo\Projet\ameniimmo-frontend
npm install -g vercel
vercel login
vercel --prod
```

✅ **Frontend URL** : `https://ameniimmo.vercel.app`

---

## ✅ VÉRIFICATION FINALE

### **Tester votre site** :

1. **Frontend** : https://ameniimmo.vercel.app
2. **Créer un compte** → S'inscrire
3. **Créer une annonce**
4. **Vérifier la carte**

### **Créer un Admin** :

**Sur Render Dashboard** :
1. **Votre service** → **Shell**
2. Taper :
   ```bash
   python manage.py create_admin
   ```

**Identifiants** :
- Email : `admin@amenimmo.tn`
- Mot de passe : `Admin@2024`

---

## 🔄 MISES À JOUR FUTURES

```powershell
cd F:\1Work\amenImmo\Projet

# Faire vos modifications...

git add .
git commit -m "Description des changements"
git push
```

✅ **Render** et **Vercel** redéploient automatiquement !

---

## ⚠️ PROBLÈMES COURANTS

### **Backend lent au démarrage**
👉 Normal, le service se réveille (gratuit = veille après 15 min)

### **CORS Error**
👉 Vérifier `CORS_ALLOWED_ORIGINS` dans `settings.py`

### **Images ne s'affichent pas**
👉 Utiliser un service comme **Cloudinary** (gratuit 25 GB)

---

## 📱 BONUS : Configuration CORS

Dans `settings.py`, remplacer :
```python
CORS_ALLOW_ALL_ORIGINS = True
```

Par :
```python
CORS_ALLOWED_ORIGINS = [
    "https://ameniimmo.vercel.app",
    "http://localhost:3000",  # Pour le dev local
]
```

---

## 🎉 C'EST TOUT !

Votre site est en ligne et gratuit ! 🚀

**Domaine custom ?** 
- Vercel : Settings → Domains → Ajouter votre domaine
- Render : Settings → Custom Domain

**URLs à partager** :
- 🌐 Site : https://ameniimmo.vercel.app
- 🔧 API : https://ameniimmo-backend.onrender.com/api/
