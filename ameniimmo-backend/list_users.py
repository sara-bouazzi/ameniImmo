#!/usr/bin/env python
"""Script pour gérer les utilisateurs facilement"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ameniimmo.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("📋 LISTE DES UTILISATEURS")
print("=" * 60)

users = User.objects.all()

if not users:
    print("Aucun utilisateur trouvé.")
else:
    for user in users:
        role_display = {
            'admin': '🔴 ADMIN',
            'owner': '🔵 PROPRIÉTAIRE',
            'visiteur': '🟢 VISITEUR'
        }.get(user.role, '⚪ AUTRE')
        
        status = '✅ Actif' if user.is_active else '❌ Inactif'
        superuser = ' (SUPERUSER)' if user.is_superuser else ''
        
        # Afficher nom complet si disponible
        nom_complet = ''
        if user.first_name or user.last_name:
            nom_complet = f"{user.first_name} {user.last_name}".strip()
        
        print(f"\n👤 {user.username}")
        if nom_complet:
            print(f"   Nom: {nom_complet}")
        print(f"   Email: {user.email}")
        print(f"   Rôle: {role_display}{superuser}")
        print(f"   Status: {status}")

print("\n" + "=" * 60)
print(f"Total: {users.count()} utilisateur(s)")
print("=" * 60)
