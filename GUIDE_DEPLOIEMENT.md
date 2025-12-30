# 🚀 GUIDE DE DÉPLOIEMENT - AMENIIMMO

## 📊 État Actuel du Projet

✅ **Backend** : Django 3.1.12 + Django REST Framework  
✅ **Frontend** : React 19 + TailwindCSS  
✅ **Base de données** : SQLite (dev) / MongoDB Atlas (prod)  
✅ **Python** : 3.11.0  
✅ **Node.js** : 20.17.0  

---

## 🎯 3 OPTIONS DE DÉPLOIEMENT

### **Option 1 : Test Local (Développement)** 🖥️
**Idéal pour** : Tester avant de déployer, développement  
**Coût** : Gratuit  
**Durée** : 5 minutes

### **Option 2 : Déploiement Cloud Gratuit** ☁️
**Idéal pour** : Portfolio, démo, petit trafic  
**Coût** : Gratuit avec limitations  
**Durée** : 30-60 minutes  
**Services** :
- Backend → Render.com (gratuit)
- Frontend → Vercel.com (gratuit)
- BDD → MongoDB Atlas (gratuit 512MB)

### **Option 3 : Déploiement Professionnel** 🏢
**Idéal pour** : Production, trafic important  
**Coût** : ~5-20€/mois  
**Durée** : 2-3 heures  
**Services** :
- Backend → VPS (DigitalOcean, AWS, Hostinger)
- Frontend → Vercel/Netlify
- BDD → MongoDB Atlas

---

## 🚀 OPTION 1 : TEST LOCAL

### **Étape 1 : Démarrer le Backend**

```powershell
# Terminal 1 - Backend
cd F:\1Work\amenImmo\Projet\ameniimmo-backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

✅ **Backend disponible sur** : http://127.0.0.1:8000

**Tester l'API :**
- http://127.0.0.1:8000/api/annonces/
- http://127.0.0.1:8000/api/users/register/

---

### **Étape 2 : Démarrer le Frontend**

```powershell
# Terminal 2 - Frontend
cd F:\1Work\amenImmo\Projet\ameniimmo-frontend
npm start
```

✅ **Frontend disponible sur** : http://localhost:3000

---

### **Étape 3 : Créer un compte Admin**

```powershell
# Terminal Backend
cd F:\1Work\amenImmo\Projet\ameniimmo-backend
.\venv\Scripts\Activate.ps1
python manage.py create_admin
```

**Identifiants par défaut** :
- Email : `admin@amenimmo.tn`
- Mot de passe : `Admin@2024`

---

## ☁️ OPTION 2 : DÉPLOIEMENT CLOUD GRATUIT

### **A. Préparation du Backend pour le Cloud**

#### 1. Créer un fichier `requirements.txt` complet

```powershell
cd F:\1Work\amenImmo\Projet\ameniimmo-backend
.\venv\Scripts\Activate.ps1
pip freeze > requirements.txt
```

#### 2. Créer un fichier `Procfile` (pour Render)

Créez un fichier `Procfile` dans `ameniimmo-backend/` :

```
web: gunicorn ameniimmo.wsgi --log-file -
```

#### 3. Installer gunicorn

```powershell
pip install gunicorn
pip freeze > requirements.txt
```

#### 4. Modifier `settings.py` pour la production

Ajoutez ces lignes dans `settings.py` :

```python
import os
import dj_database_url

# Pour Render.com
if 'RENDER' in os.environ:
    DEBUG = False
    ALLOWED_HOSTS = ['.onrender.com']
    
    # Si vous voulez utiliser PostgreSQL sur Render
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600
        )
    }
```

#### 5. Créer un `.gitignore`

```
*.pyc
__pycache__/
venv/
.env
db.sqlite3
media/
*.log
```

---

### **B. Déployer le Backend sur Render.com**

1. **Créer un compte sur [Render.com](https://render.com)**

2. **Pousser votre code sur GitHub**
   ```powershell
   cd F:\1Work\amenImmo\Projet
   git init
   git add .
   git commit -m "Prêt pour le déploiement"
   # Créez un repo GitHub et poussez le code
   ```

3. **Sur Render.com** :
   - Cliquez sur "New +" → "Web Service"
   - Connectez votre repo GitHub
   - Configuration :
     - **Name** : `ameniimmo-backend`
     - **Region** : Frankfurt (plus proche de la Tunisie)
     - **Branch** : `main`
     - **Root Directory** : `ameniimmo-backend`
     - **Runtime** : `Python 3`
     - **Build Command** : `pip install -r requirements.txt && python manage.py collectstatic --no-input`
     - **Start Command** : `gunicorn ameniimmo.wsgi:application`
     - **Plan** : Free

4. **Variables d'environnement** (dans Render) :
   ```
   SECRET_KEY=votre-secret-key-tres-longue-et-aleatoire
   DEBUG=False
   USE_SQLITE=False
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
   MONGODB_DB_NAME=ameniimmo_db
   ```

5. **Déployer** → Attendre 5-10 minutes

✅ Votre backend sera disponible sur : `https://ameniimmo-backend.onrender.com`

---

### **C. Déployer le Frontend sur Vercel**

1. **Modifier la configuration API**

Dans `ameniimmo-frontend/src/services/auth.js` et tous les fichiers de services, créez une variable d'environnement :

Créez `.env` dans `ameniimmo-frontend/` :
```
REACT_APP_API_URL=https://ameniimmo-backend.onrender.com
```

Puis modifiez les services pour utiliser :
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
```

2. **Créer un compte sur [Vercel.com](https://vercel.com)**

3. **Déployer** :
   ```powershell
   cd F:\1Work\amenImmo\Projet\ameniimmo-frontend
   npm install -g vercel
   vercel login
   vercel
   ```

4. **Configuration** :
   - Répondez aux questions
   - Ajoutez la variable d'environnement `REACT_APP_API_URL`

✅ Votre frontend sera disponible sur : `https://ameniimmo.vercel.app`

---

## 🏢 OPTION 3 : DÉPLOIEMENT PROFESSIONNEL

### **A. Backend sur VPS**

#### 1. Choisir un VPS
- **DigitalOcean** : 6$/mois (Ubuntu)
- **Hostinger** : 4€/mois
- **AWS EC2** : Variable

#### 2. Configuration du serveur

```bash
# Se connecter au VPS
ssh root@votre-ip

# Mettre à jour
sudo apt update && sudo apt upgrade -y

# Installer Python, Nginx, PostgreSQL
sudo apt install python3-pip python3-venv nginx postgresql -y

# Créer un utilisateur
sudo adduser ameniimmo
sudo usermod -aG sudo ameniimmo
su - ameniimmo

# Cloner le projet
git clone https://github.com/votre-repo/ameniimmo.git
cd ameniimmo/ameniimmo-backend

# Environnement virtuel
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt gunicorn

# Variables d'environnement
nano .env
# Ajoutez vos variables

# Collecter les fichiers statiques
python manage.py collectstatic --no-input

# Migrations
python manage.py migrate
```

#### 3. Configurer Gunicorn avec systemd

```bash
sudo nano /etc/systemd/system/ameniimmo.service
```

```ini
[Unit]
Description=AmeniImmo Django Application
After=network.target

[Service]
User=ameniimmo
Group=www-data
WorkingDirectory=/home/ameniimmo/ameniimmo/ameniimmo-backend
Environment="PATH=/home/ameniimmo/ameniimmo/ameniimmo-backend/venv/bin"
ExecStart=/home/ameniimmo/ameniimmo/ameniimmo-backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/home/ameniimmo/ameniimmo/ameniimmo-backend/ameniimmo.sock \
          ameniimmo.wsgi:application

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl start ameniimmo
sudo systemctl enable ameniimmo
```

#### 4. Configurer Nginx

```bash
sudo nano /etc/nginx/sites-available/ameniimmo
```

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    location /static/ {
        root /home/ameniimmo/ameniimmo/ameniimmo-backend;
    }

    location /media/ {
        root /home/ameniimmo/ameniimmo/ameniimmo-backend;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/ameniimmo/ameniimmo/ameniimmo-backend/ameniimmo.sock;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ameniimmo /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. SSL avec Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d votre-domaine.com
```

---

### **B. Frontend sur Vercel** (même procédure que Option 2)

---

## 📋 CHECKLIST FINALE

### **Avant le Déploiement**
- [ ] `.env` configuré avec les bonnes variables
- [ ] `DEBUG = False` en production
- [ ] `ALLOWED_HOSTS` configuré
- [ ] `SECRET_KEY` unique et sécurisée
- [ ] Base de données de production configurée
- [ ] Fichiers statiques collectés
- [ ] Migrations effectuées

### **Après le Déploiement**
- [ ] Tester toutes les pages
- [ ] Tester l'inscription/connexion
- [ ] Tester la création d'annonces
- [ ] Vérifier les images s'affichent
- [ ] Tester sur mobile
- [ ] Configurer les sauvegardes de la base de données

---

## 🆘 PROBLÈMES COURANTS

### **Le backend ne démarre pas**
```powershell
# Vérifier les logs
python manage.py check --deploy
```

### **CORS Errors**
Vérifiez dans `settings.py` :
```python
CORS_ALLOWED_ORIGINS = [
    "https://votre-frontend.vercel.app",
]
```

### **Static files ne s'affichent pas**
```bash
python manage.py collectstatic --no-input
```

### **Base de données erreurs**
```bash
python manage.py migrate
python manage.py makemigrations
python manage.py migrate
```

---

## 📞 PROCHAINES ÉTAPES

1. **Choisissez une option** (1, 2 ou 3)
2. **Testez localement d'abord** (Option 1)
3. **Puis déployez** (Option 2 ou 3)

**Question** : Quelle option préférez-vous ? Je peux vous guider étape par étape ! 😊
