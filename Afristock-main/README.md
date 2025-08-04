# Afristock - Application de Gestion de Stock Avancée

## 📝 Description

Afristock est une application complète de gestion de stock conçue pour les entreprises avec une ou plusieurs boutiques. Elle permet une gestion claire et efficace des produits, ventes, alertes et factures, avec la possibilité de fonctionner en mode local ou centralisé. L'application inclut des fonctionnalités avancées de sécurité, de gestion des rôles, de notifications en temps réel et de file d'attente d'emails.

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

### 🔹 Authentification & gestion des rôles
- Connexion obligatoire avec système JWT (JSON Web Token)
- Rôles possibles :
  - `admin` (gère tout)
  - `manager` (gère les produits)
  - `employee` (ventes uniquement)
- Système de permissions granulaire par rôle
- Journalisation des actions pour plus de traçabilité

### 🔹 Notifications en temps réel
- Système de notifications WebSocket (simulation)
- Alertes instantanées pour les événements critiques
- Interface utilisateur pour afficher les notifications

### 🔹 File d'attente d'emails
- Système de file d'attente pour l'envoi d'emails
- Gestion asynchrone des envois avec retry
- Suivi des statuts d'envoi (envoyé, échoué, en attente)

## 🔐 Spécification des rôles dans le système Afristock

### 👤 Rôle : ADMIN (👑)

L'administrateur représente le **propriétaire ou le responsable d'entreprise**. Il a un accès **complet** à toutes les fonctionnalités.

#### ✅ Ce que l'admin peut faire :

##### 🔒 Connexion & Profil
- Se connecter au système via identifiants admin
- Modifier ses informations personnelles (nom, mot de passe)
- Se déconnecter

##### 🧑‍💼 Gestion des utilisateurs
- Créer un **nouveau compte vendeur**
- Modifier un compte vendeur (nom, identifiant, mot de passe, rôle)
- Supprimer un compte vendeur
