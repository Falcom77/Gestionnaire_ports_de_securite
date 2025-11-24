GESTIONNAIRE ports de sécurité - VERSION STANDALONE COMPLÈTE V2.5
=================================================================

🎉 APPLICATION 100% AUTONOME - AUCUN SERVEUR REQUIS !

UTILISATION ULTRA-SIMPLE:
--------------------------
1. Double-cliquez sur index.html
2. L'application s'ouvre avec toutes vos données !
3. Tout fonctionne immédiatement ✅

Les données sont automatiquement chargées depuis data.js
et sauvegardées dans le navigateur (localStorage)

STRUCTURE:
- index.html : Page principale
- style.css : Tous les styles
- app.js : Toute la logique JavaScript
- data.js : VOS DONNÉES (67 ports + 6 périphériques) ⭐ À ÉDITER ICI
- data.json : [OBSOLÈTE - Gardé pour référence]
- logo.png : Votre logo (à ajouter)
- logo.svg : Logo temporaire CELLITECH

FONCTIONNALITÉS:
✅ Ajouter/Modifier/Supprimer des ports
✅ Ajouter/Modifier/Supprimer des périphériques
✅ Ajouter/Supprimer des catégories
✅ Toggle actif/inactif pour les ports
✅ Tri du parc informatique
✅ Mode sombre/clair 🌓
✅ Changement de langue FR/EN 🌍
✅ Menu latéral avec toutes les actions
✅ Export CSV (ports et périphériques)
✅ Export configuration pfSense
✅ Recharger depuis data.json 🔄
✅ Sauvegarde automatique dans le navigateur

TOUS LES BOUTONS SONT FONCTIONNELS !

MODIFIER VOS DONNÉES:
----------------------
Pour ajouter/modifier vos règles de port et périphériques:

MÉTHODE 1 - Via l'interface (Recommandé):
- Utilisez les boutons dans le menu (☰)
- Vos modifications sont sauvegardées automatiquement

MÉTHODE 2 - Éditer data.js directement:
1. Ouvrez data.js avec un éditeur de texte
2. Modifiez les données (respectez la syntaxe JSON)
3. Sauvegardez le fichier
4. Dans l'application : Menu (☰) → DATA → "Recharger depuis data.js"
   OU rechargez simplement la page (F5)

Pour réinitialiser aux données initiales:
- Menu (☰) → DATA → "Recharger depuis data.js"
- Ou console navigateur (F12) : localStorage.clear() puis F5

AJUSTEMENT DE LA TAILLE DU LOGO:
---------------------------------
Le logo garde automatiquement ses proportions.
Taille actuelle maximum : 300px de largeur

Pour augmenter/diminuer la taille du logo:
1. Ouvrez style.css
2. Cherchez ".logo { max-width: 300px;"
3. Changez 300px par la valeur souhaitée
   - 200px = petit
   - 300px = moyen (actuel)
   - 400px = grand
   - 500px = très grand

Le logo s'adaptera automatiquement en hauteur pour garder les proportions.
