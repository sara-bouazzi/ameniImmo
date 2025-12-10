# 🎨 Design Moderne Ameni Immo

## ✅ Modifications appliquées

### 1. Charte graphique
- **Couleur principale** : Rouge bordeaux `#8B1538` (du logo)
- **Couleur secondaire** : Gris foncé `#3D3D3D` (du logo)
- **Police principale** : Inter (textes)
- **Police d'affichage** : Poppins (titres)

### 2. Composants redesignés
- ✅ Navbar moderne avec gradient et effets
- ✅ Page d'accueil avec hero section élégante
- ✅ Cards d'annonces avec animations
- ✅ Boutons avec effets de glow
- ✅ Design responsive

## 📍 Comment ajouter votre logo

### Option 1 : Logo dans la Navbar (Recommandé)

1. **Copiez votre logo** dans le dossier :
   ```
   ameniimmo-frontend/src/assets/images/logo.png
   ```

2. **Modifiez Navbar.js** (ligne 20) :
   ```javascript
   // Remplacez cette partie :
   <div className="w-14 h-14 bg-gradient-to-br from-primary-700 to-primary-600 rounded-xl...">
     <svg className="w-8 h-8 text-white"...>
   </div>

   // Par :
   <img 
     src={require('../assets/images/logo.png')} 
     alt="Ameni Immo Logo" 
     className="w-14 h-14 object-contain"
   />
   ```

### Option 2 : Logo au format SVG

Si votre logo est en SVG, vous pouvez l'importer directement :

```javascript
import logo from '../assets/images/logo.svg';

// Dans le return :
<img src={logo} alt="Ameni Immo" className="w-14 h-14" />
```

## 🎨 Palette de couleurs complète

```css
Rouge bordeaux :
- primary-700: #8B1538 (principal)
- primary-600: #d12d42
- primary-500: #e54d5e
- primary-100: #fde6e7 (fond clair)

Gris :
- secondary-700: #3D3D3D (principal)
- secondary-600: #515151
- secondary-500: #666666
```

## 🚀 Prochaines étapes

1. Ajoutez votre logo dans `/src/assets/images/`
2. Modifiez `Navbar.js` pour utiliser votre logo
3. Personnalisez les textes selon vos besoins
4. Ajoutez de vraies images d'annonces

## 📦 Classes CSS personnalisées disponibles

- `.btn-primary` - Bouton principal avec gradient
- `.btn-secondary` - Bouton secondaire avec bordure
- `.card` - Carte avec ombre et hover
- `.input-field` - Champ de saisie stylisé
- `.gradient-text` - Texte avec gradient
