# 🔍 Comparaison des versions - Application pfSense

## 🌐 Version WEB (Preview Emergent)

**URL**: https://netportal-2.preview.emergentagent.com

### ✅ Tous les boutons présents

**Onglet "Règles de Ports":**
```
Header:
┌────────────────────────────────────────────────────────┐
│ ☀️ | 📁 Catégorie | ➕ Ajouter Port | 🟣 pfSense | 📥 Export Complet │
└────────────────────────────────────────────────────────┘
```

**Onglet "Parc Informatique":**
```
Header:
┌──────────────────────────────────────────────┐
│ ☀️ | ➕ Ajouter Périphérique | 📥 Export Complet │
└──────────────────────────────────────────────┘
```

**Colonne ACTIONS (dans les tableaux):**
```
ACTIONS
───────
✏️ 🗑️  ← Modifier / Supprimer
✏️ 🗑️
✏️ 🗑️
```

### 🎯 Fonctionnalités disponibles

| Fonctionnalité | Disponible | Backend | Persistance |
|----------------|------------|---------|-------------|
| Ajouter port | ✅ | ✅ | ✅ |
| Modifier port | ✅ | ✅ | ✅ |
| Supprimer port | ✅ | ✅ | ✅ |
| Ajouter catégorie | ✅ | ✅ | ✅ |
| Supprimer catégorie | ✅ | ✅ | ✅ |
| Ajouter périphérique | ✅ | ✅ | ✅ |
| Modifier périphérique | ✅ | ✅ | ✅ |
| Supprimer périphérique | ✅ | ✅ | ✅ |
| Toggle État port | ✅ | ✅ | ✅ |
| Tri parc informatique | ✅ | - | - |
| Export CSV | ✅ | ✅ | - |
| Export .xlsx | ✅ | ✅ | - |
| Export pfSense | ✅ | ✅ | - |
| Mode sombre/clair | ✅ | - | LocalStorage |

---

## 📦 Version STANDALONE (Fichier HTML local)

**Fichiers disponibles:**

### ❌ Ancien fichier (À NE PAS UTILISER)

```
pfsense_standalone_full.html (29 KB)
  ├── Créé le: 17 Nov (01:14)
  ├── Boutons: Petits (20px)
  ├── Catégories: Incomplètes
  └── Status: OBSOLÈTE ❌
```

### ✅ Nouveau fichier (À UTILISER)

```
pfsense_standalone_complet.html (47 KB)
  ├── Créé le: 17 Nov (04:20)
  ├── Mise à jour: 17 Nov (04:45)
  ├── Boutons: Agrandis (24px) avec fond coloré
  ├── Tous services: 67 dans 8 catégories
  ├── Tous périphériques: 6
  └── Status: À JOUR ✅
```

### 🎯 Fonctionnalités disponibles (Standalone)

| Fonctionnalité | Disponible | Backend | Persistance |
|----------------|------------|---------|-------------|
| **Consultation** | ✅ | ❌ | ❌ |
| Ajouter port | ❌ | ❌ | ❌ |
| Modifier port | 👁️ (visuel) | ❌ | ❌ |
| Supprimer port | 👁️ (visuel) | ❌ | ❌ |
| Ajouter catégorie | ❌ | ❌ | ❌ |
| Supprimer catégorie | ❌ | ❌ | ❌ |
| Ajouter périphérique | ❌ | ❌ | ❌ |
| Modifier périphérique | 👁️ (visuel) | ❌ | ❌ |
| Supprimer périphérique | 👁️ (visuel) | ❌ | ❌ |
| Toggle État port | ✅ (local) | ❌ | ❌ |
| Tri parc informatique | ✅ | - | - |
| Export CSV | ✅ | - | - |
| Mode sombre/clair | ✅ | - | LocalStorage |

**Note**: 👁️ = Les boutons sont visibles mais ne font rien (lecture seule)

### 📊 Boutons dans la version standalone

**Boutons du header:**
```
┌──────────────────────────────────────┐
│ ☀️ | 📥 Export Ports CSV | 📥 Export Parc CSV │
└──────────────────────────────────────┘
```

**Boutons d'action dans les tableaux:**
```
ACTIONS
───────
✏️ 🗑️  ← Icônes visibles mais clics sans effet
✏️ 🗑️
✏️ 🗑️
```

---

## 🔍 Comment identifier quelle version vous utilisez

### Version WEB:
1. **URL commence par** `https://netportal-2.preview.emergentagent.com`
2. **Tous les boutons** fonctionnent
3. **Les modifications** sont sauvegardées
4. **Internet requis**

### Version Standalone:
1. **URL commence par** `file:///` ou chemin local
2. **Boutons limités** (pas de CRUD)
3. **Aucune sauvegarde** (sauf export)
4. **Fonctionne offline**

---

## 🎯 Si vous ne voyez PAS les boutons

### Sur la version WEB:
1. **Actualisez** la page (Ctrl + F5)
2. **Videz le cache** du navigateur
3. **Vérifiez** que vous êtes bien sur l'onglet correct :
   - Onglet "Ports" → Boutons Catégorie, Ajouter Port, pfSense
   - Onglet "Parc" → Bouton Ajouter Périphérique
4. **Testez** un autre navigateur

### Sur la version Standalone:
1. **Vérifiez** que vous utilisez le bon fichier:
   - ✅ `pfsense_standalone_complet.html` (47 KB)
   - ❌ PAS `pfsense_standalone_full.html` (29 KB)
2. **Vérifiez** la taille du fichier
3. **Ouvrez** dans Chrome/Firefox/Edge
4. **Vérifiez** que JavaScript est activé

---

## 📥 Où télécharger la bonne version

### Depuis le serveur Emergent:

```bash
# Localisation du fichier
/app/pfsense_standalone_complet.html

# Vérification
ls -lh /app/pfsense_standalone*.html

# Résultat attendu:
# -rw-r--r-- 1 root root 47K Nov 17 04:45 pfsense_standalone_complet.html  ✅
# -rw-r--r-- 1 root root 29K Nov 17 01:14 pfsense_standalone_full.html     ❌
```

### Vérification du contenu:

```bash
# Dans le titre de la page HTML:
grep -i "title" /app/pfsense_standalone_complet.html

# Doit contenir:
# "Version Standalone Complète"  ✅
```

---

## ✅ Checklist de vérification

### Version WEB (Preview)
- [ ] URL = `https://netportal-2.preview.emergentagent.com`
- [ ] Bouton "Catégorie" visible (orange)
- [ ] Bouton "+ Ajouter Port" visible (bleu)
- [ ] Bouton "pfSense" visible (violet)
- [ ] Bouton "+ Ajouter Périphérique" visible dans onglet Parc
- [ ] Boutons ✏️ et 🗑️ visibles dans colonne ACTIONS
- [ ] Boutons avec fond coloré (bleu clair / rouge clair)
- [ ] Tooltip au survol des boutons

### Version Standalone
- [ ] Fichier = `pfsense_standalone_complet.html`
- [ ] Taille = 47 KB (pas 29 KB)
- [ ] Date = 17 Nov 2024 après 04:00
- [ ] Boutons ✏️ et 🗑️ visibles
- [ ] Boutons avec fond coloré
- [ ] Export CSV fonctionne
- [ ] Tri du parc informatique fonctionne
- [ ] Mode sombre/clair fonctionne

---

## 🆘 Résolution des problèmes

### "Je ne vois aucun bouton sur la version WEB"

**Causes possibles:**
1. Cache navigateur
2. Extensions navigateur (AdBlock, etc.)
3. JavaScript désactivé
4. Connexion réseau

**Solutions:**
```
1. Ctrl + Shift + Delete → Vider le cache
2. Désactiver les extensions
3. F12 → Console → Vérifier les erreurs
4. Tester en navigation privée
5. Tester un autre navigateur
```

### "Je ne vois pas les boutons sur la version Standalone"

**Causes possibles:**
1. Mauvais fichier (ancien)
2. JavaScript désactivé
3. Fichier corrompu

**Solutions:**
```
1. Vérifier le nom du fichier: pfsense_standalone_complet.html
2. Vérifier la taille: doit être ~47 KB
3. Vérifier la date: 17 Nov 2024
4. Activer JavaScript dans le navigateur
5. Re-télécharger le fichier
```

---

## 📝 Résumé

| Aspect | Version WEB | Version Standalone |
|--------|-------------|--------------------|
| **Boutons visibles** | ✅ Tous | ✅ Tous (lecture seule) |
| **CRUD complet** | ✅ Oui | ❌ Non |
| **Export** | ✅ CSV + XLSX | ✅ CSV uniquement |
| **Persistance** | ✅ Base de données | ❌ Aucune |
| **Internet requis** | ✅ Oui | ⚠️ Premier chargement |
| **Mise à jour auto** | ✅ Oui | ❌ Non |

**Recommandation**: Utilisez la **version WEB** pour toutes les modifications. La version **Standalone** est idéale pour consultation hors ligne ou présentations.

---

**Date**: 17 Novembre 2024  
**Versions:**
- Web: Toujours à jour (auto-déployée)
- Standalone: v2.1 (17/11/2024 - 47 KB)
