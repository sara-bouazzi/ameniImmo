from django.db import models
from django.conf import settings

class Notification(models.Model):
    TYPE_CHOICES = [
        ('nouvelle_annonce', 'Nouvelle Annonce'),
        ('annonce_approuvee', 'Annonce Approuvée'),
        ('annonce_rejetee', 'Annonce Rejetée'),
        ('visite', 'Visite'),
    ]
    
    STATUT_CHOICES = [
        ('non_lu', 'Non lu'),
        ('lu', 'Lu'),
    ]

    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='non_lu')
    
    # Utilisateur qui reçoit la notification
    destinataire = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications_recues',
        null=True,
        blank=True
    )
    
    # Annonce liée (optionnel)
    annonce = models.ForeignKey(
        'annonces.Immobilier',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.type} - {self.message[:50]}"

