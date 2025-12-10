from django.db import models
from django.conf import settings

class Immobilier(models.Model):
    titre = models.CharField(max_length=200)
    description = models.TextField()
    prix = models.FloatField()
    surface = models.FloatField()
    region = models.CharField(max_length=100)
    ville = models.CharField(max_length=100)
    gouvernorat = models.CharField(max_length=100)
    fonctionnalite = models.CharField(max_length=200)
    datePublication = models.DateField(auto_now_add=True)
    statut = models.CharField(max_length=50)
    approuve = models.BooleanField(default=False)
    proprietaire = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='annonces'
    )

    def __str__(self):
        return self.titre


class Visite(models.Model):
    immobilier = models.ForeignKey(Immobilier, on_delete=models.CASCADE)
    visiteurId = models.IntegerField()
    adminId = models.IntegerField()
    dateSouhaitee = models.DateField()
    dateConfirmee = models.DateField(null=True, blank=True)
    statut = models.CharField(max_length=50)

    def __str__(self):
        return f"Visite de {self.immobilier.titre}"


class Agence(models.Model):
    nom = models.CharField(max_length=200)
    adresse = models.CharField(max_length=200)
    telephone = models.CharField(max_length=20)
    email = models.EmailField()
    siteWeb = models.CharField(max_length=200)

    def __str__(self):
        return self.nom


class Logement(Immobilier):
    nombreEtages = models.IntegerField()
    nombreChambres = models.IntegerField()
    nombreSallesDeBain = models.IntegerField()
    balcon = models.BooleanField(default=False)
    garage = models.BooleanField(default=False)
    piscine = models.BooleanField(default=False)

    def __str__(self):
        return f"Logement: {self.titre}"


class EspaceTravail(Immobilier):
    superficie = models.FloatField()
    nombrePieces = models.IntegerField()
    typeActivite = models.CharField(max_length=100)
    internetDisponible = models.BooleanField(default=False)
    vitrine = models.BooleanField(default=False)

    def __str__(self):
        return f"Espace de travail: {self.titre}"


class Terrain(Immobilier):
    superficie = models.FloatField()
    constructible = models.BooleanField(default=False)
    titreFoncier = models.CharField(max_length=200)

    def __str__(self):
        return f"Terrain: {self.titre}"


class PlaceDeParc(Immobilier):
    type = models.CharField(max_length=100)
    securite = models.BooleanField(default=False)

    def __str__(self):
        return f"Place de parc: {self.titre}"
