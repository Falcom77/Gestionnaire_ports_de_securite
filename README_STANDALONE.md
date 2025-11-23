# 📦 Version Standalone - Gestionnaire pfSense

## 📄 Fichier à utiliser

**`pfsense_standalone_complet.html`** - Version complète et à jour (46 KB)

## ✨ Fonctionnalités incluses

### ✅ Toutes les données
- **67 services** répartis dans 8 catégories
  - Gaming (13 services)
  - Administration (18 services)
  - VPN (12 services)
  - Monitoring (9 services)
  - Infrastructure (7 services)
  - Database (4 services)
  - Network (2 services)
  - Home Automation (2 services)
- **6 périphériques** dans le parc informatique

### ✅ Fonctionnalités complètes
1. **Affichage des règles de port**
   - Groupées par catégorie avec couleurs
   - Toggle actif/inactif pour chaque règle
   - Toutes les colonnes visibles sans scroll horizontal
   
2. **Parc informatique**
   - Liste complète des périphériques
   - **Tri interactif** par colonne (cliquer sur les en-têtes)
     - Hostname (A-Z)
     - Adresse IP (numérique)
     - Adresse MAC
     - Type
     - Description
   - Indicateurs visuels de tri (↑ ↓)

3. **Modes d'affichage**
   - **Mode sombre** (par défaut)
   - **Mode clair** avec fond gris doux (non agressif)
   - Bouton de bascule avec icône soleil/lune

4. **Export de données**
   - Export CSV des règles de port
   - Export CSV du parc informatique
   - Téléchargement direct depuis le navigateur

## 🚀 Utilisation

### Méthode 1: Double-clic
1. Téléchargez le fichier `pfsense_standalone_complet.html`
2. Double-cliquez dessus
3. Il s'ouvre dans votre navigateur par défaut
4. **Aucun serveur web nécessaire** ✅

### Méthode 2: Glisser-déposer
1. Ouvrez votre navigateur
2. Glissez-déposez le fichier HTML dans la fenêtre
3. L'application se charge instantanément

### Méthode 3: Via le navigateur
1. Ouvrez votre navigateur
2. Menu Fichier → Ouvrir un fichier
3. Sélectionnez `pfsense_standalone_complet.html`

## 🌐 Compatibilité

### Navigateurs supportés
- ✅ Chrome/Edge (recommandé)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Brave

### Systèmes d'exploitation
- ✅ Windows 10/11
- ✅ macOS
- ✅ Linux
- ✅ ChromeOS

## 📊 Caractéristiques techniques

### Sans dépendances externes
Le fichier utilise uniquement :
- Tailwind CSS (CDN) pour le style
- JavaScript vanilla pour la logique
- Aucune bibliothèque externe requise
- **Fonctionne offline après le premier chargement** (le CSS Tailwind sera en cache)

### Performance
- Taille: 46 KB
- Chargement instantané
- Aucune latence réseau (tout est embarqué)
- Tri ultra-rapide (client-side)

## 🔧 Personnalisation

### Modifier les données
Les données sont embarquées dans le fichier JavaScript :
```javascript
const INITIAL_PORTS = [...]; // Ligne ~50
const INITIAL_DEVICES = [...]; // Ligne suivante
```

Pour ajouter/modifier des services ou périphériques :
1. Ouvrez le fichier dans un éditeur de texte
2. Cherchez `INITIAL_PORTS` ou `INITIAL_DEVICES`
3. Modifiez le JSON
4. Sauvegardez

### Modifier les couleurs
Les couleurs des catégories sont définies dans :
```javascript
const categoryColors = {
    "Gaming": "from-purple-500 to-pink-500",
    // ...
};
```

## 🎯 Cas d'usage

### Idéal pour:
- 📱 Consultation hors ligne
- 💾 Sauvegarde locale de la configuration
- 📧 Envoi par email à un collègue
- 🔒 Environnements sans accès internet
- 🖨️ Impression (mode clair recommandé)
- 📊 Présentation en réunion

### Différences avec la version web
| Fonctionnalité | Web | Standalone |
|----------------|-----|------------|
| Ajout/Modification | ✅ | ❌ |
| Suppression | ✅ | ❌ |
| Consultation | ✅ | ✅ |
| Tri | ✅ | ✅ |
| Export CSV | ✅ | ✅ |
| Toggle État | ✅ | ✅ (local) |
| Modes sombre/clair | ✅ | ✅ |
| Sauvegarde serveur | ✅ | ❌ |

## 📝 Notes importantes

1. **Les modifications ne sont pas sauvegardées**
   - Les toggles d'état fonctionnent mais ne persistent pas au rechargement
   - Pour sauvegarder, exportez en CSV

2. **Pas de base de données**
   - Toutes les données sont dans le fichier HTML
   - Rechargez la page pour réinitialiser

3. **Export uniquement CSV**
   - L'export .xlsx multi-feuilles n'est pas disponible en standalone
   - Utilisez la version web pour cela

## 🆚 Comparaison des versions

### Version Web (Preview)
- Base de données MongoDB
- CRUD complet
- Export .xlsx multi-feuilles
- Modifications persistantes

### Version Standalone (Ce fichier)
- Pas de serveur requis
- Lecture seule (avec export CSV)
- Parfait pour consultation/présentation
- Portable et partageable

## 🐛 Dépannage

### Le fichier ne s'ouvre pas
- Vérifiez que votre navigateur est à jour
- Essayez avec un autre navigateur
- Vérifiez que JavaScript est activé

### Les styles ne s'affichent pas
- Assurez-vous d'avoir une connexion internet au premier chargement
- Le CSS Tailwind est chargé depuis un CDN
- Après le premier chargement, ça fonctionnera offline

### Le tri ne fonctionne pas
- Cliquez directement sur le texte de l'en-tête de colonne
- Assurez-vous d'être dans l'onglet "Parc Informatique"
- Rechargez la page si nécessaire

## 📞 Support

Pour la version web avec toutes les fonctionnalités :
- Utilisez la preview Emergent
- URL: https://pf-port-forward.preview.emergentagent.com

---

**Date de création**: 17 Novembre 2024  
**Version**: 2.0 (Complète avec tri et corrections)  
**Taille**: 46 KB  
**Services**: 67  
**Périphériques**: 6
