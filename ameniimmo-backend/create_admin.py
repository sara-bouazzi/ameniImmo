from users.models import Utilisateur

# Vérifier si sarra existe et mettre à jour son rôle
try:
    sarra = Utilisateur.objects.get(username='sarra')
    sarra.role = 'admin'
    sarra.save()
    print(f"✅ User 'sarra' mis à jour avec le rôle admin")
except Utilisateur.DoesNotExist:
    print("❌ User 'sarra' n'existe pas")

# Créer un admin si besoin
admin_user, created = Utilisateur.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@ameniimmo.com',
        'role': 'admin',
        'is_staff': True,
        'is_superuser': True
    }
)

if created:
    admin_user.set_password('admin123')
    admin_user.save()
    print("✅ Utilisateur admin créé : username=admin, password=admin123")
else:
    admin_user.role = 'admin'
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.save()
    print("✅ Utilisateur admin mis à jour")

# Afficher tous les admins
admins = Utilisateur.objects.filter(role='admin')
print(f"\n📋 Liste des admins ({admins.count()}):")
for admin in admins:
    print(f"  - {admin.username} ({admin.email})")
