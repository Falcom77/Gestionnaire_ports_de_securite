# 📖 Guide d'utilisation - Boutons d'action

## 🎯 Où sont les boutons ?

### Version Web (https://netportal-2.preview.emergentagent.com)

#### 1. 📋 Onglet "Règles de Ports"

**En haut de la page:**
- 🟠 **"Catégorie"** - Ajouter une nouvelle catégorie
- 🔵 **"+ Ajouter Port"** - Ajouter une nouvelle règle de port
- 🟣 **"pfSense"** - Exporter la configuration pfSense
- 🟢 **"Export Complet"** - Exporter tout en .xlsx

**Dans chaque catégorie (en-tête coloré):**
- 🗑️ **Icône poubelle rouge** - Supprimer toute la catégorie

**Dans le tableau (colonne "ACTIONS" à droite):**
- 🔵 **Icône crayon (bleu)** - Modifier la règle de port
- 🔴 **Icône poubelle (rouge)** - Supprimer la règle de port

#### 2. 💻 Onglet "Parc Informatique"

**En haut de la page:**
- 🔵 **"+ Ajouter Périphérique"** - Ajouter un nouveau périphérique
- 🟢 **"Export Complet"** - Exporter en .xlsx

**Dans le tableau (colonne "ACTIONS" à droite):**
- 🔵 **Icône crayon (bleu)** - Modifier le périphérique
- 🔴 **Icône poubelle (rouge)** - Supprimer le périphérique

## 🖱️ Comment utiliser les boutons

### Modifier une règle de port (✏️)

1. **Cliquer** sur l'icône crayon bleue dans la colonne "ACTIONS"
2. Une **modale** s'ouvre avec le formulaire pré-rempli
3. **Modifier** les champs souhaités
4. **Cliquer** sur "Enregistrer" ou "Annuler"

### Supprimer une règle de port (🗑️)

1. **Cliquer** sur l'icône poubelle rouge dans la colonne "ACTIONS"
2. Une **confirmation** s'affiche
3. **Confirmer** pour supprimer définitivement

### Ajouter une règle de port (➕)

1. **Cliquer** sur le bouton bleu "**+ Ajouter Port**" en haut
2. Une **modale** s'ouvre avec un formulaire vide
3. **Remplir** tous les champs requis:
   - Service
   - Port Interne
   - Port Externe
   - Protocole (TCP/UDP)
   - Description
   - Catégorie
   - Destination (optionnel - liste déroulante)
   - Adresse IP (optionnel - se remplit automatiquement si destination sélectionnée)
4. **Cliquer** sur "Enregistrer"

### Ajouter une catégorie (📁)

1. **Cliquer** sur le bouton orange "**Catégorie**" en haut
2. Une **modale** s'ouvre
3. **Saisir** le nom de la nouvelle catégorie
4. **Cliquer** sur "Ajouter"

### Supprimer une catégorie (🗑️)

1. **Cliquer** sur l'icône poubelle rouge dans l'**en-tête de la catégorie** (barre colorée)
2. Une **confirmation** s'affiche (attention: supprime aussi toutes les règles de cette catégorie!)
3. **Confirmer** pour supprimer

### Ajouter un périphérique (💻➕)

1. **Aller** dans l'onglet "**Parc Informatique**"
2. **Cliquer** sur le bouton bleu "**+ Ajouter Périphérique**" en haut
3. Une **modale** s'ouvre avec un formulaire
4. **Remplir** les champs:
   - Hostname (requis)
   - Adresse IP/Masque (requis)
   - Adresse MAC (optionnel)
   - Type (liste déroulante: PC, Serveur, Routeur, etc.)
   - Description (optionnel)
5. **Cliquer** sur "Enregistrer"

### Modifier un périphérique (✏️)

1. **Dans le parc informatique**, cliquer sur l'icône crayon bleue
2. Une **modale** s'ouvre avec les données actuelles
3. **Modifier** les champs
4. **Cliquer** sur "Enregistrer"

### Supprimer un périphérique (🗑️)

1. **Cliquer** sur l'icône poubelle rouge
2. **Confirmer** la suppression

## 🎨 Apparence des boutons

### Nouveaux boutons agrandis (24x24px)

**Icône Modifier (bleu):**
```
┌────────┐
│ ✏️ 🔵 │ Fond bleu clair, icône crayon
└────────┘
```

**Icône Supprimer (rouge):**
```
┌────────┐
│ 🗑️ 🔴 │ Fond rouge clair, icône poubelle
└────────┘
```

**Effet au survol:**
- Le fond devient plus foncé
- Curseur devient une main pointant
- Animation de transition douce

## 🆕 Amélirations apportées

### Avant (version précédente):
- ❌ Boutons trop petits (20px)
- ❌ Pas de fond coloré
- ❌ Difficile à voir
- ❌ Pas de tooltip

### Maintenant:
- ✅ Boutons agrandis (24px → +20%)
- ✅ Fond coloré avec contraste
- ✅ Centrage dans la colonne
- ✅ Tooltips au survol
- ✅ Animation hover

## 📊 Comparaison visuelle

### Colonne "ACTIONS"

```
┌─────────────┐
│   ACTIONS   │ ← En-tête centré
├─────────────┤
│  ✏️ 🔵 🗑️ 🔴 │ ← Boutons agrandis avec fond
│  ✏️ 🔵 🗑️ 🔴 │
│  ✏️ 🔵 🗑️ 🔴 │
└─────────────┘
```

## 🔍 Si vous ne voyez toujours pas les boutons

### Vérifications:

1. **Largeur de colonne**: La colonne "ACTIONS" est maintenant plus large (120px pour les ports, 140px pour le parc)
2. **Scroll horizontal**: Assurez-vous qu'il n'y a plus de scroll horizontal
3. **Résolution**: Testez en 1920x1080 (résolution recommandée)
4. **Navigateur**: Utilisez Chrome, Firefox ou Edge (à jour)
5. **Cache**: Faites Ctrl+F5 pour recharger sans cache

### Sur la version Standalone:

Les boutons **affichent seulement les icônes** (lecture seule):
- ✏️ Affiche "(lecture seule)" au survol
- 🗑️ Affiche "(lecture seule)" au survol
- Les clics ne font rien (pas de backend)

## 🎯 Résumé des actions disponibles

| Action | Onglet | Emplacement | Icône |
|--------|--------|-------------|-------|
| Ajouter port | Ports | Bouton haut | ➕ |
| Modifier port | Ports | Tableau ACTIONS | ✏️ 🔵 |
| Supprimer port | Ports | Tableau ACTIONS | 🗑️ 🔴 |
| Ajouter catégorie | Ports | Bouton haut | 📁 |
| Supprimer catégorie | Ports | En-tête catégorie | 🗑️ |
| Ajouter périphérique | Parc | Bouton haut | ➕ |
| Modifier périphérique | Parc | Tableau ACTIONS | ✏️ 🔵 |
| Supprimer périphérique | Parc | Tableau ACTIONS | 🗑️ 🔴 |
| Export CSV | Les deux | Bouton haut | 📥 |
| Export xlsx | Les deux | Bouton haut | 📥 |
| Export pfSense | Ports | Bouton haut | 🟣 |

## 💡 Astuces

1. **Tooltip**: Survolez les boutons pour voir leur fonction
2. **Confirmation**: Les suppressions demandent toujours confirmation
3. **Auto-remplissage**: Dans le formulaire de port, sélectionner une "Destination" remplit automatiquement l'"Adresse IP"
4. **Tri**: Dans le parc informatique, cliquez sur les en-têtes de colonnes pour trier
5. **Toggle État**: Dans le tableau des ports, cliquez sur le toggle (rouge/vert) pour activer/désactiver une règle

---

**Date de mise à jour**: 17 Novembre 2024  
**Version**: 2.1 (Boutons agrandis)
