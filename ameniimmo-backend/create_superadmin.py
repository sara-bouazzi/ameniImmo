#!/usr/bin/env python
"""Script pour créer un superadmin avec mot de passe personnalisé"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ameniimmo.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Informations de l'admin
username = 'sarra'
email = 'sarra.bouazzi2002@gmail.com'
password = 'sarra'
prenom = 'Sarra'
nom = 'Bouazzi'

# Vérifier si l'utilisateur existe déjà
if User.objects.filter(username=username).exists():
    print(f"❌ L'utilisateur '{username}' existe déjà.")
    user = User.objects.get(username=username)
    # Mettre à jour le mot de passe
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.role = 'admin'
    user.save()
    print(f"✅ Mot de passe mis à jour pour '{username}'")
else:
    # Créer le superadmin
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
        prenom=prenom,
        nom=nom,
        role='admin'
    )
    print(f"✅ Superadmin créé avec succès!")

print(f"""
╔════════════════════════════════════════╗
║     SUPERADMIN CRÉÉ AVEC SUCCÈS        ║
╠════════════════════════════════════════╣
║ Username  : {username:<25}║
║ Email     : {email:<25}║
║ Password  : {password:<25}║
║ Rôle      : admin / superuser          ║
╚════════════════════════════════════════╝

🔐 Vous pouvez maintenant vous connecter :
   - Frontend: http://localhost:3000/login
   - Backend Admin: http://127.0.0.1:8000/admin
""")
