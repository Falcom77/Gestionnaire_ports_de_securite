# Gestionnaire de Ports pfSense

Application web complète pour gérer et exporter les règles de pare-feu pfSense.

## 🚀 Fonctionnalités

### ✅ Gestion des Ports
- **Visualisation par catégories** : Gaming, VPN, Monitoring, Database, Infrastructure, Administration, Network, Home Automation
- **Codes couleurs** : Vert = actif, Rouge = inactif
- **Icônes par catégorie** : Identification visuelle rapide
- **Toggle on/off** : Activer/désactiver rapidement les règles

### 📝 Formulaire d'Édition
- Ajouter de nouvelles règles
- Modifier les règles existantes
- Supprimer les règles
- Champs disponibles :
  - Service/Application
  - Port Interne
  - Port Externe
  - Protocole (TCP/UDP/TCP+UDP)
  - Description
  - Catégorie
  - Destination (VM/PC)
  - Adresse IP
  - Adresse MAC
  - État (actif/inactif)

### 💾 Export Multiple
1. **Export CSV** : Format standard avec séparateur ";" pour Excel
2. **Export pfSense** : Format texte avec règles prêtes à configurer
3. **Format JSON** : Via l'API (http://localhost:8001/api/ports)

## 📊 Catégories Pré-configurées

### 🎮 Gaming
- Steam (4 règles)
- Satisfactory Server (3 règles)
- SCUM (2 règles)

### 🔐 VPN
- OpenVPN
- OCserv (OpenVPN Connect)
- WireGuard
- IPSec

### 📈 Monitoring
- Grafana
- Prometheus
- Loki
- Tempo
- Mimir
- Alloy

### 🗄️ Database
- InfluxDB
- PostgreSQL
- MySQL

### 🏗️ Infrastructure
- Kubernetes
- OpenTelemetry (gRPC + HTTP)

### ⚙️ Administration
- SSH
- RDP
- Proxmox
- QNAP
- IMM-2

### 🌐 Network
- Wake on LAN

### 🏠 Home Automation
- Home Assistant

## 🔌 API Endpoints

### GET /api/ports
Récupère toutes les règles de ports
```bash
curl http://localhost:8001/api/ports
```

### GET /api/ports?category=Gaming
Filtre par catégorie
```bash
curl http://localhost:8001/api/ports?category=Gaming
```

### GET /api/ports/categories
Liste toutes les catégories
```bash
curl http://localhost:8001/api/ports/categories
```

### POST /api/ports
Créer une nouvelle règle
```bash
curl -X POST http://localhost:8001/api/ports \
  -H "Content-Type: application/json" \
  -d '{
    "service": "Mon Service",
    "port_internal": "8080",
    "port_external": "18080",
    "protocol": "TCP",
    "description": "Description",
    "category": "Administration",
    "is_active": true
  }'
```

### PUT /api/ports/{port_id}
Modifier une règle existante
```bash
curl -X PUT http://localhost:8001/api/ports/{port_id} \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}'
```

### DELETE /api/ports/{port_id}
Supprimer une règle
```bash
curl -X DELETE http://localhost:8001/api/ports/{port_id}
```

### GET /api/export/csv
Télécharger le fichier CSV
```bash
curl http://localhost:8001/api/export/csv -o pfsense_ports.csv
```

### GET /api/export/pfsense
Télécharger les règles pfSense
```bash
curl http://localhost:8001/api/export/pfsense -o pfsense_rules.txt
```

## 🎨 Interface Utilisateur

### Page Principale
- Tableau organisé par catégories avec dégradés de couleurs
- Bouton toggle pour activer/désactiver chaque règle
- Badges colorés pour les protocoles :
  - Bleu : TCP
  - Vert : UDP
  - Jaune : TCP/UDP
- Actions : Éditer, Supprimer

### Boutons d'Action (Header)
- **Ajouter** : Ouvrir le formulaire de création
- **Export CSV** : Télécharger le fichier CSV
- **Export pfSense** : Télécharger les règles formatées

### Modal de Formulaire
- Design moderne avec dégradé bleu-violet
- Formulaire en deux colonnes
- Validation des champs obligatoires
- Boutons : Enregistrer, Annuler

## 🛠️ Technologies Utilisées

### Backend
- **FastAPI** : Framework API haute performance
- **MongoDB** : Base de données NoSQL
- **Motor** : Driver MongoDB asynchrone
- **Pydantic** : Validation des données

### Frontend
- **React 19** : Interface utilisateur réactive
- **Tailwind CSS** : Styling moderne et responsive
- **Lucide React** : Icônes SVG
- **Axios** : Client HTTP

## 🔒 Sécurité

### Ports Externes Aléatoires
- Tous les ports externes utilisent des numéros aléatoires (30000-58999)
- Aucun conflit entre les ports
- Ports standards (443, SMB, etc.) marqués "N/A" ne doivent pas être modifiés

### Recommandations
1. Toujours utiliser des ports externes non standard
2. Limiter l'accès par IP quand possible
3. Activer uniquement les règles nécessaires
4. Documenter chaque règle avec une description claire
5. Renseigner les adresses IP et MAC pour traçabilité

## 📝 Configuration pfSense

### Import Manuel
1. Télécharger l'export pfSense (bouton "Export pfSense")
2. Ouvrir le fichier texte généré
3. Pour chaque règle, dans pfSense :
   - Aller dans **Firewall > NAT > Port Forward**
   - Cliquer sur **Add**
   - Remplir les champs selon le fichier :
     - Protocol : TCP/UDP/Both
     - Destination port range : Port externe
     - Redirect target IP : IP de destination
     - Redirect target port : Port interne
   - Sauvegarder et appliquer

### Exemple de Règle
```
# Grafana
# Description: Interface web Grafana
Protocol: TCP
External Port: 33100
Internal IP: 192.168.1.50
Internal Port: 3000
Destination: VM-Monitoring
```

Configuration pfSense correspondante :
- Interface : WAN
- Protocol : TCP
- Destination port range : 33100
- Redirect target IP : 192.168.1.50
- Redirect target port : 3000
- Description : Grafana - Interface web

## 🎯 Workflow Recommandé

1. **Planification** : Identifier tous les services à exposer
2. **Création** : Ajouter les règles via l'interface web
3. **Configuration** : Remplir IP, MAC, destination pour chaque règle
4. **Test** : Activer une règle à la fois et tester
5. **Export** : Télécharger le CSV pour documentation
6. **Import pfSense** : Utiliser l'export pfSense pour configurer le pare-feu
7. **Maintenance** : Mettre à jour régulièrement

## 🌟 Avantages

- ✅ **Centralisation** : Toutes vos règles au même endroit
- ✅ **Visual** : Codes couleurs et icônes pour identification rapide
- ✅ **Flexible** : Ajout/modification facile
- ✅ **Export** : Multiples formats d'export
- ✅ **Documentation** : Description et métadonnées pour chaque règle
- ✅ **Sécurisé** : Ports externes aléatoires, activation sélective
- ✅ **Responsive** : Interface adaptée mobile/tablette/desktop

## 📱 Accessibilité

L'application est accessible depuis :
- **Frontend** : https://pf-port-forward.preview.emergentagent.com
- **API Backend** : https://pf-port-forward.preview.emergentagent.com/api

## 🤝 Support

Pour toute question ou problème :
1. Vérifier les logs backend : `tail -f /var/log/supervisor/backend.*.log`
2. Vérifier les logs frontend : `tail -f /var/log/supervisor/frontend.*.log`
3. Tester l'API directement : `curl http://localhost:8001/api/ports`

---

**Créé pour simplifier la gestion des ports pfSense** 🛡️
