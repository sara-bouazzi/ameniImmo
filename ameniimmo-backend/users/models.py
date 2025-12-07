from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.utils import timezone

class Utilisateur(AbstractUser):
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('visiteur', 'Visiteur'),
        ('admin', 'Admin'),
    ]

    # Champs supplémentaires (tous optionnels pour éviter les prompts)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, null=True, blank=True)
    telephone = models.CharField(max_length=20, null=True, blank=True)
    adresse = models.CharField(max_length=200, null=True, blank=True)
    dateNaissance = models.DateField(null=True, blank=True)
    genre = models.CharField(max_length=10, null=True, blank=True)
    photo = models.ImageField(upload_to='photos/', null=True, blank=True)

    def __str__(self):
        return self.username if self.username else "Utilisateur"


class Favori(models.Model):
    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True   # ✅ autorise null pour éviter les prompts
    )
    immobilier = models.ForeignKey(
        'annonces.Immobilier',
        on_delete=models.CASCADE,
        null=True, blank=True   # ✅ autorise null pour éviter les prompts
    )
    date_ajout = models.DateTimeField(default=timezone.now)  # ✅ corrigé

    def __str__(self):
        user = self.utilisateur.username if self.utilisateur else "Sans utilisateur"
        bien = self.immobilier.titre if self.immobilier else "Aucun bien"
        return f"{user} - {bien}"
