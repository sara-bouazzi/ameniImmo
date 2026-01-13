# Guide : Système d'Images Multiples pour les Annonces

## ✨ Fonctionnalités ajoutées

Le système permet maintenant aux propriétaires d'ajouter **plusieurs images** pour chaque annonce immobilière.

## 🔧 Modifications Backend

### 1. Nouveau modèle `ImageImmobilier`
- Relation ForeignKey avec `Immobilier`
- Champs : `image`, `description`, `ordre`, `date_ajout`
- Une annonce peut avoir plusieurs images

### 2. Nouvelles API endpoints
- **POST** `/api/annonces/{id}/upload_images/` - Upload plusieurs images
- **DELETE** `/api/annonces/{id}/delete_image/` - Supprimer une image

### 3. Serializer mis à jour
- Le `ImmobilierSerializer` inclut maintenant un champ `images` avec toutes les images liées

## 🎨 Modifications Frontend

### 1. Composant CreerAnnonce
- Champ d'upload d'images multiples
- Aperçu des images avant upload
- Possibilité de retirer des images avant création
- Upload automatique après création de l'annonce

### 2. Composant AnnonceDetail
- Carrousel d'images avec navigation
- Miniatures cliquables
- Indicateurs de position
- Affichage élégant des images

### 3. Composant AnnonceCard
- Affiche la première image de l'annonce
- Badge indiquant le nombre d'images
- Fallback sur icône si pas d'images

## 📖 Guide d'utilisation

### Pour créer une annonce avec images :

1. **Remplir le formulaire** de création d'annonce
2. **Cliquer sur la zone d'upload** ou glisser-déposer des images
3. **Prévisualiser** les images sélectionnées
4. **Retirer des images** en cliquant sur le bouton ❌ si nécessaire
5. **Soumettre** le formulaire

### Pour voir les images d'une annonce :

1. Cliquer sur une annonce depuis la liste
2. Naviguer entre les images avec les flèches ◀ ▶
3. Cliquer sur les miniatures pour changer d'image
4. Les points en bas indiquent l'image active

## 🗄️ Base de données

### Migration créée :
```bash
python manage.py makemigrations
python manage.py migrate
```

Les migrations ont déjà été appliquées :
- `0006_immobilier_image.py` - Ajout champ image (supprimé)
- `0007_auto_20260113_2111.py` - Création du modèle ImageImmobilier

## 📁 Structure des fichiers

### Backend :
- `annonces/models.py` - Modèle `ImageImmobilier`
- `annonces/serializers.py` - `ImageImmobilierSerializer`
- `annonces/views.py` - Actions `upload_images` et `delete_image`
- `annonces/admin.py` - Admin pour gérer les images

### Frontend :
- `pages/CreerAnnonce.js` - Upload d'images
- `pages/AnnonceDetail.js` - Carrousel d'images
- `components/AnnonceCard.js` - Affichage première image
- `services/images.js` - Service de gestion des images

## 🔒 Sécurité

- Seul le **propriétaire** peut ajouter/supprimer des images
- Authentification requise pour l'upload
- Validation côté backend des permissions

## 🚀 Fonctionnalités futures possibles

- [ ] Réorganiser l'ordre des images (drag & drop)
- [ ] Éditer la description de chaque image
- [ ] Compression automatique des images
- [ ] Limite du nombre d'images par annonce
- [ ] Définir une image principale
- [ ] Zoom sur les images en plein écran

## 📝 Notes importantes

- Les images sont stockées dans `media/photos/`
- Format accepté : PNG, JPG, JPEG
- Les images sont automatiquement liées à l'annonce
- En cas de suppression d'annonce, les images sont supprimées automatiquement (CASCADE)
