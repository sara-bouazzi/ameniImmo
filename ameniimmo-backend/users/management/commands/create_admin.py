from django.core.management.base import BaseCommand
from users.models import Utilisateur


class Command(BaseCommand):
    help = 'Create or update admin user'

    def handle(self, *args, **options):
        # Update sarra to admin if exists
        try:
            sarra = Utilisateur.objects.get(username='sarra')
            sarra.role = 'admin'
            sarra.is_staff = True
            sarra.is_superuser = True
            sarra.save()
            self.stdout.write(self.style.SUCCESS(f"User 'sarra' updated to admin role"))
        except Utilisateur.DoesNotExist:
            self.stdout.write(self.style.WARNING("User 'sarra' does not exist"))

        # Create or update admin user
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
            self.stdout.write(self.style.SUCCESS('Admin user created: username=admin, password=admin123'))
        else:
            admin_user.role = 'admin'
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Admin user updated'))

        # List all admins
        admins = Utilisateur.objects.filter(role='admin')
        self.stdout.write(f'\nAdmin users ({admins.count()}):')
        for admin in admins:
            self.stdout.write(f'  - {admin.username} ({admin.email})')
