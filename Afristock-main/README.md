# StockMaster - Application de Gestion de Stock

## 📝 Description

StockMaster est une application complète de gestion de stock conçue pour les entreprises avec une ou plusieurs boutiques. Elle permet une gestion claire et efficace des produits, ventes, alertes et factures, avec la possibilité de fonctionner en mode local ou en ligne.

## 🎯 Fonctionnalités

### 🔹 Gestion des produits
- Ajouter, modifier, supprimer un produit
- Champs : nom, marque, prix d'entrée, prix de vente, quantité, dimensions
- Possibilité d'ajouter une image du produit

### 🔹 Gestion du stock
- Affichage de tous les produits avec leurs quantités
- Réduction automatique du stock à chaque vente
- Alerte quand le stock est bas (ex : < 5 unités)

### 🔹 Vente & enregistrement
- Interface intuitive pour enregistrer une vente
- Sélection du produit + quantité vendue
- Calcul automatique du total
- Mise à jour immédiate du stock

### 🔹 Génération de factures
- Création automatique d'une facture avec :
  - Nom du client, téléphone, adresse
  - Liste des produits achetés, quantité, prix unitaire, total
- Facture imprimable ou exportable en PDF

### 🔹 Gestion des boutiques
- Création de nouvelles boutiques
- Chaque boutique a sa propre configuration et ses données
- Choix de mode (individuel ou partagé) stocké et reconnu automatiquement

### 🔹 Authentification & rôles
- Connexion obligatoire
- Rôles possibles : `admin` (gère tout), `vendeur` (ventes uniquement)
- Journalisation des actions (optionnel)

## 🚀 Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-compte/stockmaster.git
```

2. Ouvrez le fichier `login.html` dans votre navigateur

3. Connectez-vous avec les identifiants de votre boutique

## 🖥️ Utilisation

### 🔑 Connexion
Au démarrage, l'utilisateur doit se connecter avec :
- Son **identifiant de boutique** (ex : `BoutiqueDakar`)
- Un **mot de passe**

### ⚙️ Choix du mode de fonctionnement
Une fois connecté, il peut choisir :
- 🔹 **Mode "Stock individuel"** : La boutique utilise un fichier local (ou localStorage)
- 🔸 **Mode "Stock partagé"** : La boutique utilise le même stock que d'autres via un serveur

## 📁 Structure du projet

```
/stockmaster/
├── login.html               ← page de connexion
├── choose_mode.html         ← choisir "stock individuel" ou "stock partagé"
├── dashboard.html           ← tableau de bord des produits
├── add_product.html         ← formulaire d'ajout/modif produit
├── vente.html               ← interface pour faire une vente
├── facture.html             ← facture générée automatiquement
│
├── js/
│   ├── auth.js              ← gestion de la connexion
│   ├── mode.js              ← choix de mode
│   ├── produit.js           ← ajout/modif produits
│   ├── vente.js             ← traitement des ventes
│   ├── facture.js           ← génération facture
│   ├── api.js               ← connexion au serveur (stock partagé)
│
├── css/
│   └── style.css
│
├── data/
│   ├── stock_boutique_dakar.json
│   └── stock_boutique_thies.json
```

## 🛠️ Technologies utilisées

- HTML5
- CSS3
- JavaScript (ES6+)
- localStorage pour le stockage local

## 📱 Compatibilité

L'application est compatible avec tous les navigateurs modernes et fonctionne sur :
- Ordinateurs de bureau
- Tablettes
- Smartphones

## 🔐 Sécurité

- Authentification locale (stock local) ou serveur (stock centralisé)
- Les mots de passe sont stockés de manière sécurisée
- Journalisation des actions pour plus de traçabilité

## 🤝 Support

Pour tout problème ou question, veuillez créer une issue sur GitHub ou contacter notre équipe de support.

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus d'informations.
# Afristock
