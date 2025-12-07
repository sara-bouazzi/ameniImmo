from django.db import models

class Notification(models.Model):
    TYPE_CHOICES = [
        ('validation', 'Validation'),
        ('visite', 'Visite'),
        ('favori', 'Favori'),
    ]

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    message = models.TextField()
    date = models.DateField(auto_now_add=True)
    statut = models.CharField(max_length=20)
    adminId = models.IntegerField()
    ownerId = models.IntegerField()

    def __str__(self):
        return f"{self.type} - {self.statut}"
