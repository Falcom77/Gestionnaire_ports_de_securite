# 📖 Instructions - Gestionnaire pfSense

## 🚀 Comment lancer l'application

### ⚠️ IMPORTANT : Utiliser un serveur web local

L'application **NE FONCTIONNE PAS** correctement si vous ouvrez simplement `index.html` en double-cliquant dessus (mode `file://`).

**Vous DEVEZ utiliser un serveur web local.**

### 🖥️ Méthode 1 : Python (Recommandé)

1. Ouvrez un terminal dans le dossier `standalone_app`
2. Lancez la commande :
   ```bash
   python3 -m http.server 8000
   ```
   ou sur Windows :
   ```bash
   python -m http.server 8000
   ```
3. Ouvrez votre navigateur et allez sur : **http://localhost:8000**

### 🌐 Méthode 2 : Node.js (si installé)

1. Installez `http-server` globalement :
   ```bash
   npm install -g http-server
   ```
2. Dans le dossier `standalone_app`, lancez :
   ```bash
   http-server -p 8000
   ```
3. Ouvrez : **http://localhost:8000**

### 📱 Méthode 3 : Extension VSCode

Si vous utilisez Visual Studio Code :
1. Installez l'extension "Live Server"
2. Clic droit sur `index.html` → "Open with Live Server"

---

## 💾 Gestion des données

### 📂 Fichier data.json

Le fichier `data.json` contient toutes vos règles de ports et périphériques.

### 🔄 localStorage vs data.json

- **Premier lancement** : L'application charge `data.json` et sauvegarde dans le localStorage du navigateur
- **Lancements suivants** : L'application utilise le localStorage (plus rapide)
- **Problème** : Si vous modifiez `data.json`, les changements ne sont pas visibles automatiquement

### ✅ Solution : Bouton "Recharger depuis data.json"

1. Modifiez votre fichier `data.json`
2. Ouvrez l'application dans votre navigateur
3. Cliquez sur le menu (☰) en haut à droite
4. Section **DATA** → **"Recharger depuis data.json"**
5. Confirmez le rechargement
6. ✅ Vos données sont à jour !

### 🌍 Synchronisation entre navigateurs

Chaque navigateur (Firefox, Edge, Chrome) a son propre localStorage.

Pour synchroniser les données :
1. Éditez `data.json` avec vos données
2. Dans **chaque navigateur**, utilisez le bouton "Recharger depuis data.json"
3. Tous les navigateurs auront les mêmes données

---

## 🎨 Fonctionnalités

### 🌐 Changement de langue (FR/EN)

Bouton **FR** / **EN** en haut à droite du header

### 🌓 Mode sombre / clair

Bouton ☀️ / 🌙 en haut à droite du header

### 📋 Menu latéral

Bouton ☰ (hamburger) en haut à droite pour accéder à :
- **ACTIONS** : Ajouter Port, Périphérique, Catégorie
- **EXPORTS** : Exporter en CSV, pfSense, Parc Informatique
- **DATA** : Recharger depuis data.json

### ✏️ Gestion des données

- **Ajouter** : Via le menu latéral
- **Modifier** : Bouton ✏️ (crayon) dans les tableaux
- **Supprimer** : Bouton 🗑️ (poubelle) dans les tableaux
- **Activer/Désactiver** : Toggle vert/rouge dans les tableaux

---

## ❓ Problèmes courants

### "Failed to fetch" ou "Tableau vide"

➡️ **Cause** : Vous ouvez `index.html` en mode `file://`  
➡️ **Solution** : Lancez un serveur web local (voir ci-dessus)

### "Les modifications dans data.json ne sont pas visibles"

➡️ **Cause** : L'application utilise le localStorage  
➡️ **Solution** : Utilisez le bouton "Recharger depuis data.json" dans le menu

### "Différences entre Firefox et Edge"

➡️ **Cause** : Chaque navigateur a son propre localStorage  
➡️ **Solution** : Rechargez `data.json` dans chaque navigateur

---

## 📤 Export des données

Vous pouvez exporter vos données à tout moment :
1. Menu → EXPORTS
2. Choisissez le format :
   - **Export CSV Ports** : Liste des règles de port
   - **Export pfSense** : Configuration compatible pfSense
   - **Export Parc Informatique** : Liste des périphériques

---

## 🎯 Structure des fichiers

```
standalone_app/
├── index.html          # Page principale
├── style.css           # Styles de l'application
├── app.js              # Logique JavaScript
├── data.json           # VOS DONNÉES (à éditer)
├── logo.png            # Votre logo (remplacez-le)
├── INSTRUCTIONS.md     # Ce fichier
└── README.txt          # Instructions de démarrage rapide
```

---

## 👤 Créé par

**Falcom** - 2025/2026

Application de gestion de règles pfSense  
Version standalone - Aucune dépendance serveur requise
