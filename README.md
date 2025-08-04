# Projet Afristock

## Présentation générale

Afristock est une application complète de gestion de stock destinée aux commerces de détail. Elle permet la gestion des produits, des ventes, des factures, des utilisateurs, des alertes, et propose des rapports détaillés. Le projet est divisé en deux parties principales : un frontend web et un backend API.

---

## Frontend

### Technologies utilisées

- HTML, CSS, JavaScript vanilla
- Architecture modulaire avec plusieurs pages HTML et fichiers JS dédiés
- Pages principales :
  - `login.html` : page de connexion utilisateur
  - `dashboard.html` : tableau de bord principal
  - `vente.html` : gestion des ventes
  - `facture.html` et `factures.html` : création et consultation des factures
  - `add_product.html` : ajout de nouveaux produits
  - `choose_mode.html` : sélection du mode d’utilisation
  - Autres pages pour la gestion des utilisateurs, rapports, mouvements de stock, import/export, etc.

### Modules JavaScript clés

- `auth.js` : gestion de l’authentification et des sessions
- `userManagement.js` : gestion des données utilisateurs et état de session
- `produit.js` : fonctionnalités liées aux produits
- `vente.js` : gestion des ventes et interactions UI
- `facture.js` : gestion des factures
- `mode.js` : logique de sélection de mode
- `notifications.js`, `emailQueue.js` : gestion des notifications et envoi d’emails
- `import_export.js` : import/export de données
- `security.js` : utilitaires liés à la sécurité

### Lancement du frontend

- Les fichiers frontend sont dans le dossier `Afristock-main`.
- Il est recommandé de servir le frontend via un serveur HTTP local pour éviter les problèmes CORS et d’origine.
- Un serveur Node.js simple est fourni (`server.js`) pour servir le frontend sur `http://localhost:3000`.
- Pour démarrer le serveur :
  ```bash
  node server.js
  ```
- Accéder ensuite à l’application via `http://localhost:3000/login.html`.

---

## Backend

### Technologies utilisées

- Node.js avec framework Express
- Base de données MongoDB (connexion dans `utils/db.js`)
- Authentification JWT avec gestion des rôles (RBAC)
- Documentation API Swagger (`docs/swagger.yaml`)
- Middlewares pour sécurité (helmet, cors), limitation de débit, journalisation, gestion des erreurs

### Endpoints API

- `/api/auth` : routes d’authentification (connexion, inscription, déconnexion, réinitialisation mot de passe, profil)
- `/api/users` : gestion des utilisateurs (CRUD, protégée par JWT et RBAC)
- `/api/alerts` : gestion des alertes (protégée)
- `/api/docs` : documentation API protégée par clé API
- `/api-docs` : interface Swagger publique

### Tests

- Les tests sont dans `backend/__tests__` et couvrent utilisateurs, authentification, documentation.
- Utilisation de Jest et Supertest.
- Pour lancer les tests :
  ```bash
  cd backend
  npm test
  ```

### Lancement du backend

- Assurez-vous que MongoDB est démarré et accessible.
- Configurez les variables d’environnement dans `.env` ou `config/config.js`.
- Démarrez le serveur backend :
  ```bash
  npm start
  ```
- Le serveur écoute sur le port configuré (par défaut 4000).

---

## Notes de développement

- CORS est configuré pour autoriser l’origine du frontend.
- Les tokens JWT sécurisent les endpoints API.
- RBAC permet une gestion fine des permissions.
- Les notifications et envois d’emails sont gérés par des services dédiés.
- Les notifications temps réel utilisent WebSocket (Socket.IO).
- La documentation API est dynamique et sécurisée par clé API.

---

## Résolution des problèmes courants

- En cas d’erreur CORS, assurez-vous que le frontend est servi via HTTP et que le backend autorise l’origine correspondante.
- Ne pas ouvrir les fichiers HTML directement dans le navigateur, utiliser le serveur local.
- Vérifiez la configuration des routes et middlewares en cas d’erreurs backend.
- Pour les tests, assurez-vous que les dépendances et l’environnement sont correctement configurés.

---

## Contact

Pour toute question ou contribution, contactez le mainteneur du projet sur ce email
fauconn316@gmail.com

---

Ce README vous offre une vue complète et détaillée pour comprendre, développer, tester et déployer le projet Afristock.
