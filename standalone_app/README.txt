GESTIONNAIRE pfSense - VERSION FONCTIONNELLE COMPLÈTE V2.0
===========================================================

⚠️ IMPORTANT - TABLEAU VIDE ?
Si le tableau est vide, c'est normal ! Voir solution ci-dessous.

UTILISATION CORRECTE:
---------------------
1. OBLIGATOIRE : Utilisez un serveur local (pas double-clic!)
   
   Terminal/Console:
   cd /chemin/vers/standalone_app
   python3 -m http.server 8000
   
   Puis ouvrez : http://localhost:8000/

2. Toutes les fonctionnalités sont opérationnelles
3. Les données sont sauvegardées dans le navigateur (localStorage)

POURQUOI UN SERVEUR LOCAL ?
----------------------------
Le double-clic sur index.html ouvre en mode file://
Le navigateur bloque alors le chargement de data.json (sécurité CORS)
= Tableau vide

Avec un serveur local (http://localhost):
✅ data.json se charge correctement
✅ 67 ports et 6 périphériques s'affichent
✅ Toutes les fonctionnalités marchent

Voir PROBLEME_TABLEAU_VIDE.txt pour plus de détails

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

RECHARGER LES DONNÉES DEPUIS data.json:
-----------------------------------------
Si vous modifiez data.json et que les changements ne s'affichent pas:
1. Ouvrez l'application
2. Menu (☰) → Section DATA
3. Cliquez sur "Recharger depuis data.json"
4. Confirmez le rechargement
✅ Vos nouvelles données sont chargées !

Pour réinitialiser complètement:
- Ouvrez la console du navigateur (F12)
- Tapez: localStorage.clear()
- Rechargez la page

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
