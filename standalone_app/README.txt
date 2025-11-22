GESTIONNAIRE pfSense - VERSION FONCTIONNELLE COMPLÈTE V2.0
===========================================================

UTILISATION:
1. IMPORTANT : Utilisez un serveur local (pas file://)
   python3 -m http.server 8000
   Puis ouvrez : http://localhost:8000/

2. Toutes les fonctionnalités sont opérationnelles
3. Les données sont sauvegardées dans le navigateur (localStorage)

STRUCTURE:
- index.html : Page principale
- style.css : Tous les styles
- app.js : Toute la logique JavaScript
- data.json : Données initiales (67 ports + 6 périphériques)
- logo.png : Votre logo (à ajouter)
- logo.svg : Logo temporaire CELLITECH

FONCTIONNALITÉS:
✅ Ajouter/Modifier/Supprimer des ports
✅ Ajouter/Modifier/Supprimer des périphériques
✅ Ajouter/Supprimer des catégories
✅ Toggle actif/inactif pour les ports
✅ Tri du parc informatique
✅ Mode sombre/clair
✅ Export CSV (ports et périphériques)
✅ Export configuration pfSense
✅ Sauvegarde automatique dans le navigateur

TOUS LES BOUTONS SONT FONCTIONNELS !

Pour réinitialiser les données:
- Ouvrez la console du navigateur (F12)
- Tapez: localStorage.clear()
- Rechargez la page
