# IMMO_TN - Guide de Démarrage Rapide

## 🚀 Démarrage Rapide (5 minutes)

### Étape 1: Installation des Dépendances

```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### Étape 2: Configuration de la Base de Données

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE immobilier_db;
exit;

# Retour au dossier backend
cd backend

# Copier et éditer .env
cp .env.example .env
# Éditer DB_PASSWORD et JWT_SECRET

# Exécuter les migrations
npm run migrate
```

### Étape 3: Lancer l'Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Puis scanner le QR code avec Expo Go
```

## 📱 Installation Expo Go

1. Télécharger **Expo Go** depuis:
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
   - [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)

2. Scanner le QR code affiché dans le terminal

## 🔧 Configuration de l'API

**Pour émulateur Android:**
```javascript
// frontend/src/utils/constants.js
export const API_BASE_URL = 'http://10.0.2.2:3000/api';
```

**Pour appareil réel:**
```javascript
// Trouver votre IP
ipconfig (Windows) ou ifconfig (Mac/Linux)

// Utiliser votre IP
export const API_BASE_URL = 'http://192.168.1.XX:3000/api';
```

## 👥 Créer un Compte de Test

1. Lancer l'app
2. Cliquer sur "S'inscrire"
3. Remplir le formulaire
4. Se connecter avec vos identifiants

## ❓ Problèmes Courants

**Le serveur ne démarre pas:**
```bash
# Vérifier que le port 3000 est libre
netstat -ano | findstr :3000
# Tuer le processus si nécessaire
```

**Expo ne se connecte pas:**
```bash
# S'assurer d'être sur le même réseau WiFi
# Redémarrer avec cache vidé
expo start -c
```

**Erreur de base de données:**
```bash
# Vérifier les credentials dans .env
# Re-exécuter les migrations
npm run migrate
```

## 📚 Prochaines Étapes

1. Explorez l'application mobile
2. Testez les différentes fonctionnalités
3. Ajoutez une propriété de test
4. Testez le chat et l'assistant IA

## 🆘 Support

En cas de problème:
- 📧 Email: rayenchraiet2000@gmail.com
- 📱 Tel: +216 94599198
- 💬 Consultez la documentation complète dans README.md
