# 🏠 IMMO_TN - Application Immobilière Tunisienne (React Native)

<div align="center">

**Une application mobile moderne pour la gestion immobilière en Tunisie**

[![React Native](https://img.shields.io/badge/React_Native-0.73-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.0-4479A1?style=for-the-badge&logo=postgresql)](https://postgresql.org)
[![Expo](https://img.shields.io/badge/Expo-50.x-000020?style=for-the-badge&logo=expo)](https://expo.dev)

</div>

---

## 📱 Aperçu

IMMO_TN est une application mobile complète développée avec **React Native** et **Node.js**, conçue pour simplifier la recherche, la publication et la gestion de biens immobiliers en Tunisie. L'application offre une expérience utilisateur moderne avec des fonctionnalités avancées comme l'IA, les notifications en temps réel, la messagerie intégrée, le mode sombre/clair, et le support multilingue (🇫🇷 Français, 🇬🇧 English, 🇹🇳 العربية).

## ✨ Fonctionnalités Principales

### 🏘️ Gestion Immobilière
- 🔍 **Recherche Avancée** - Filtres par type, prix, localisation, superficie
- 📍 **Carte Interactive** - Visualisation géographique avec React Native Maps
- 💰 **Types de Transactions** - Vente, location, location saisonnière
- 📸 **Galerie Photos** - Upload et affichage d'images avec Expo Image Picker
- ❤️ **Favoris** - Sauvegarde des propriétés préférées avec AsyncStorage

### 👤 Profil Utilisateur
- 🖼️ **Photo de Profil** - Upload et modification avec Expo Image Picker
- 📝 **Édition Complète** - Nom, téléphone, bio personnalisée
- 🏢 **Mes Propriétés** - Gestion complète de vos annonces
- 📊 **Statistiques** - Suivi de vos publications

### 💬 Communication
- 📨 **Messagerie Intégrée** - Chat en temps réel entre utilisateurs
- 🟢 **Statut En Ligne** - Indicateur de présence et dernier vu
- 🔔 **Notifications** - Système complet avec AsyncStorage
- ⏰ **Historique** - Conservation des conversations

### 🤖 Intelligence Artificielle
- 💡 **Assistant IA** - Chatbot intelligent avec réponses contextuelles
- 🗣️ **Support Multilingue** - Français, Anglais et Arabe
- 📝 **Suggestions Rapides** - Recommandations personnalisées
- 🔍 **Recherche Intelligente** - Compréhension du langage naturel

### 🎨 Personnalisation
- 🌓 **Mode Sombre/Clair** - Basculement entre thèmes
- 🌍 **Multilingue** - Support FR/EN/AR avec persistance
- ⚙️ **Écran Paramètres** - Gestion complète des préférences
- 🎨 **Thème Dynamique** - Couleurs adaptatives

### 🗺️ Carte Interactive
- 📍 **Localisation GPS Réelle** - Suivi en temps réel
- 🗺️ **Marqueurs de Propriétés** - Toutes les annonces sur la carte
- 🛣️ **Routage Basé sur Routes** - Directions réelles via OSRM
- ⏱️ **Distance & Durée** - Temps de trajet calculé
- 🔵 **Visualisation Route** - Ligne bleue suivant les routes

### 🐛 Debug & Tests
- 🔍 **Écran de Debug** - Tests API en temps réel
- ✅ **Vérification Santé** - Backend health check
- 🔐 **Statut Auth** - Vérification du token
- 📊 **Configuration** - Affichage détaillé
- 🧪 **Tests Automatisés** - Suite de tests intégrée

### 👥 Équipe de Développement
- 🎨 **Section Développeurs** - Présentation de l'équipe
- 📞 **Contacts Directs** - Email, téléphone, LinkedIn, GitHub
- 🌟 **Profils Détaillés** - Rôles et contributions

### 🔐 Sécurité
- 🔑 **Authentification JWT** - Connexion sécurisée
- 🔒 **Hachage Bcrypt** - Protection des mots de passe
- 🛡️ **Validation** - Vérification des données côté serveur
- 🚫 **Protection CORS** - Sécurité des requêtes API

## 🏗️ Architecture Technique

### Frontend (React Native + Expo)
```
frontend/
├── App.js                        # Point d'entrée et navigation
├── app.json                      # Configuration Expo
├── package.json                  # Dépendances
├── src/
│   ├── context/                  # State Management avec Context API
│   │   ├── AuthContext.js
│   │   └── NotificationContext.js
│   ├── screens/                  # Écrans de l'application
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── home/
│   │   │   └── HomeScreen.js
│   │   ├── property/
│   │   │   ├── PropertyDetailsScreen.js
│   │   │   └── AddPropertyScreen.js
│   │   ├── messages/
│   │   │   ├── MessagesScreen.js
│   │   │   └── ChatScreen.js
│   │   ├── profile/
│   │   │   ├── ProfileScreen.js
│   │   │   ├── EditProfileScreen.js
│   │   │   ├── MyPropertiesScreen.js
│   │   │   └── FavoritesScreen.js
│   │   ├── notifications/
│   │   │   └── NotificationsScreen.js
│   │   ├── ai/
│   │   │   └── AIAssistantScreen.js
│   │   ├── map/
│   │   │   └── MapScreen.js
│   │   └── about/
│   │       └── AboutScreen.js
│   ├── services/                 # Services API
│   │   └── api.js
│   └── utils/                    # Utilitaires et constantes
│       └── constants.js
└── assets/                       # Images et ressources
```

### Backend (Node.js + Express)
```
backend/
├── server.js                     # Serveur principal
├── .env.example                  # Configuration environnement
├── package.json                  # Dépendances Node.js
├── src/
│   ├── config/
│   │   └── database.js          # Configuration MySQL
│   ├── controllers/             # Logique métier
│   │   ├── auth.controller.js
│   │   ├── property.controller.js
│   │   ├── message.controller.js
│   │   ├── favorite.controller.js
│   │   ├── notification.controller.js
│   │   ├── ai.controller.js
│   │   └── user.controller.js
│   ├── routes/                  # Routes API
│   │   ├── auth.routes.js
│   │   ├── property.routes.js
│   │   ├── message.routes.js
│   │   ├── favorite.routes.js
│   │   ├── notification.routes.js
│   │   ├── ai.routes.js
│   │   └── user.routes.js
│   ├── middleware/              # Middleware
│   │   └── auth.middleware.js
│   └── database/
│       └── migrate.js           # Script de migration
└── uploads/                     # Fichiers uploadés
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (18.x+)
- MySQL (8.0+)
- Expo CLI
- Git
- Un émulateur Android/iOS ou un appareil physique

# Créer la base de données PostgreSQL
psql -U postgres
CREATE DATABASE immobilier_db;
exit;

# Exécuter les migrations
npm run migrate

# (Optionnel) Peupler avec des données de test
npm run seed dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Éditer le fichier .env avec vos informations
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=immobilier_db
# JWT_SECRET=your_secret_key
# OPENAI_API_KEY=your_openai_key (optionnel)

# Créer la base de données
mysql -u root -p
CREATE DATABASE immobilier_db;
exit;

# Exécuter les migrations
npm run migrate

# Démarrer le serveur
npm start
# Ou en mode développement
npm run dev
```

Le serveur démarrera sur `http://localhost:3000`

### 2️⃣ Configuration Frontend

```bash
# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Configurer l'URL de l'API
# Éditer: src/utils/constants.js
# Pour Android Emulator: http://10.0.2.2:3000/api
# Pour appareil réel: http://YOUR_COMPUTER_IP:3000/api

# Installer Expo CLI globalement (si pas déjà fait)
npm install -g expo-cli

# Démarrer l'application
npm start
# ou
expo start

# Scanner le QR code avec Expo Go sur votre téléphone
# ou appuyer sur 'a' pour Android, 'i' pour iOS
```

### 3️⃣ Build pour Production

```bash
cd frontend

# Build Android (AAB pour Play Store)
expo build:android -t app-bundle

# Build Android (APK pour test)
expo build:android -t apk

# Build iOS
expo build:ios

# Ou utiliser EAS Build (recommandé)
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## 📦 Technologies Utilisées

### Frontend
| Technologie | Version | Usage |
|------------|---------|--------|
| **React Native** | 0.73.6 | Framework mobile cross-platform |
| **Expo** | ~50.0 | Outils de développement |
| **React Navigation** | 6.x | Navigation et routing |
| **AsyncStorage** | 1.21.0 | Stockage local persistant |
| **Axios** | 1.6.0 | Client HTTP |
| **React Native Maps** | 1.10.0 | Cartes interactives |
| **Expo Image Picker** | 14.7.1 | Sélection d'images |
| **Expo Location** | 16.5.5 | Géolocalisation |
| **React Native Paper** | 5.12.3 | Composants UI Material Design |
| **Date-fns** | 3.0.0 | Manipulation de dates |

| **Express.js** | 4.18.2 | Framework web Node.js |
| **PostgreSQL** | 8.16.3 | Base de données relationnelle |
| **JWT** | 9.0.2 | Authentification sécurisée |
| **Express.js** | 4.18.2 | Framework web Node.js |
| **MySQL2** | 3.6.5 | Base de données relationnelle |
| **JWT** | 9.0.2 | Authentification sécurisée |
| **Bcryptjs** | 2.4.3 | Hachage des mots de passe |
| **Multer** | 1.4.5 | Upload de fichiers |
| **CORS** | 2.8.5 | Gestion CORS |
| **Helmet** | 7.1.0 | Sécurité HTTP |
| **Axios** | 1.6.2 | Client HTTP (pour OpenAI) |

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Properties
- `GET /api/properties` - Liste des propriétés
- `GET /api/properties/:id` - Détails d'une propriété
- `POST /api/properties` - Créer une propriété
- `PUT /api/properties/:id` - Modifier une propriété
- `DELETE /api/properties/:id` - Supprimer une propriété
- `GET /api/properties/user/my-properties` - Mes propriétés

### Messages
- `GET /api/messages/conversations` - Liste des conversations
- `GET /api/messages/:userId` - Messages avec un utilisateur
- `POST /api/messages` - Envoyer un message
- `DELETE /api/messages/:id` - Supprimer un message

### Favorites
- `GET /api/favorites` - Liste des favoris
- `POST /api/favorites` - Ajouter aux favoris
- `DELETE /api/favorites/:propertyId` - Retirer des favoris

### Notifications
- `GET /api/notifications` - Liste des notifications
- `PUT /api/notifications/:id/read` - Marquer comme lu
- `PUT /api/notifications/read-all` - Tout marquer comme lu
- `DELETE /api/notifications/:id` - Supprimer une notification

### AI Assistant
- `POST /api/ai/chat` - Chat avec l'IA
- `GET /api/ai/suggestions` - Obtenir des suggestions

### User
- `GET /api/users/:id` - Profil utilisateur
- `PUT /api/users/profile` - Mettre à jour le profil
- `PUT /api/users/password` - Changer le mot de passe

## 🗄️ Structure de la Base de Données

### Tables
- **users** - Utilisateurs de l'application
- **properties** - Propriétés immobilières
- **messages** - Messages entre utilisateurs
- **favorites** - Propriétés favorites
- **notifications** - Notifications système

## 🔒 Sécurité

- ✅ Authentification JWT avec tokens sécurisés
- ✅ Hachage bcrypt des mots de passe (10 rounds)
- ✅ Protection CORS configurée
- ✅ Validation des entrées côté serveur
- ✅ Sanitization des données
- ✅ Headers de sécurité avec Helmet
- ✅ Protection contre les injections SQL

## 📋 Configuration Requise

### Serveur de Production
- **RAM**: Minimum 2GB
- **CPU**: 2 cores recommandé
- **Stockage**: 10GB minimum
- **PostgreSQL**: 12.0+
- **Node.js**: 18.x LTS

### Application Mobile
- **Android**: Version 5.0 (API 21) minimum
- **iOS**: Version 12.0 minimum
- **Espace**: 100 MB minimum
- **Internet**: Connexion requise

## 🚀 Déploiement

### Backend (Options)

1. **Render.com** (Recommandé)
```bash
# 1. Créer un compte sur render.com
# 2. Créer un nouveau Web Service
# 3. Connecter votre repo GitHub
# 4. Configurer les variables d'environnement
# 5. Déployer automatiquement
```

2. **Railway.app**
```bash
# 1. Installer Railway CLI
npm install -g railway
# 2. Login et init
railway login
railway init
# 3. Déployer
railway up
```

3. **VPS (DigitalOcean, AWS, etc.)**
```bash
# Installation PM2
npm install -g pm2
# Démarrer l'app
pm2 start server.js --name immo-api
pm2 save
pm2 startup
```

### Frontend (Expo/EAS)

```bash
# 1. Créer un compte Expo
expo register

# 2. Login
expo login

# 3. Build avec EAS
npm install -g eas-cli
eas build:configure
eas build --platform android
eas build --platform ios

# 4. Submit aux stores
eas submit --platform android
eas submit --platform ios
```

## 👥 Équipe de Développement

<table>
  <tr>
    <td align="center">
      <b>Rayen Chraiet</b><br />
      <sub>Lead Developer & Project Manager</sub><br />
      📧 rayenchraiet2000@gmail.com<br />
      📱 +216 94599198
    </td>
    <td align="center">
      <b>Sihem Barghouda</b><br />
      <sub>Backend Developer</sub>
    </td>
    <td align="center">
      <b>Zeineb Khaled</b><br />
      <sub>UI/UX Designer</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Eya Ben Slama</b><br />
      <sub>Frontend Developer</sub>
    </td>
    <td align="center">
      <b>Rim Ayari</b><br />
      <sub>QA Engineer</sub>
    </td>
  </tr>
</table>

## 📞 Contact & Support

- **Email**: rayenchraiet2000@gmail.com
- **LinkedIn**: [Rayen Chraiet](https://linkedin.com/in/rayen-chraiet-16b671337)
- **GitHub**: [@chraietrayen](https://github.com/chraietrayen)
- **Téléphone**: +216 94599198

## 🐛 Dépannage

### Problèmes courants

**Erreur de connexion à l'API**
```bash
# Vérifier l'URL de l'API dans constants.js
# Pour émulateur Android: http://10.0.2.2:3000/api
# Pour appareil réel: http://YOUR_IP:3000/api
```

**Expo ne démarre pas**
```bash
# Nettoyer le cache
expo start -c
# Ou
rm -rf node_modules
npm install
```

**Erreur de base de données**
```bash
# Re-exécuter les migrations
cd backend
npm run migrate
```

## 📄 Licence

Ce projet est privé et confidentiel. Tous droits réservés © 2025 IMMO_TN Team.

## 🎉 Changelog

### Version 1.0.0 (Décembre 2025)
- 🎨 Interface utilisateur moderne et intuitive
- 🏠 Gestion complète des propriétés (CRUD)
- 💬 Messagerie en temps réel
- 🤖 Assistant IA intelligent avec suggestions
- 📍 Carte interactive avec routage GPS
- 🔔 Système de notifications push
- ❤️ Système de favoris avec compteur
- 👤 Profil utilisateur complet avec statistiques
- 🌓 Mode sombre/clair avec persistance
- 🌍 Support multilingue (FR/EN/AR)
- ⚙️ Écran de paramètres avancé
- 🔐 Sécurité renforcée (JWT, bcrypt)
- 🐛 Écran de debug et tests intégrés
- 🗺️ Routage basé sur routes réelles (OSRM)
- 📊 Filtres avancés (prix, ville, type, transaction)

---

<div align="center">

**Développé avec ❤️ en Tunisie 🇹🇳**

*Version 1.0.0 - Décembre 2025*

**Propulsé par React Native, Node.js et PostgreSQL**

</div>
