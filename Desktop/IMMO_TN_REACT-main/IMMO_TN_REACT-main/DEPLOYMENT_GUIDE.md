# Déploiement de IMMO_TN - Guide Complet

## 📋 Table des Matières
1. [Préparation](#préparation)
2. [Déploiement Backend](#déploiement-backend)
3. [Déploiement Frontend](#déploiement-frontend)
4. [Configuration DNS](#configuration-dns)
5. [Monitoring](#monitoring)

---

## 🎯 Préparation

### Checklist Pré-Déploiement

- [ ] Tests locaux réussis
- [ ] Base de données configurée
- [ ] Variables d'environnement préparées
- [ ] Domaine acheté (optionnel)
- [ ] Certificat SSL (automatique avec services cloud)

---

## 🖥️ Déploiement Backend

### Option 1: Render.com (Recommandé - Gratuit)

#### Étape 1: Créer un Compte
1. Aller sur [render.com](https://render.com)
2. S'inscrire avec GitHub
3. Connecter votre repository

#### Étape 2: Créer un Web Service
```yaml
Name: immo-tn-api
Environment: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

#### Étape 3: Ajouter une Base de Données
```yaml
Name: immo-tn-db
Database: MySQL
Plan: Free
```

#### Étape 4: Variables d'Environnement
```env
DB_HOST=<render-db-host>
DB_USER=<render-db-user>
DB_PASSWORD=<render-db-password>
DB_NAME=<render-db-name>
DB_PORT=3306
PORT=3000
NODE_ENV=production
JWT_SECRET=<votre-secret-securise>
OPENAI_API_KEY=<votre-clé-openai>
CORS_ORIGIN=*
```

#### Étape 5: Déployer
- Push sur GitHub déclenche automatiquement le déploiement
- URL de l'API: `https://immo-tn-api.onrender.com`

### Option 2: Railway.app

```bash
# Installer Railway CLI
npm install -g railway

# Login
railway login

# Créer un nouveau projet
railway init

# Ajouter MySQL
railway add mysql

# Déployer
railway up

# Obtenir l'URL
railway domain
```

### Option 3: VPS (DigitalOcean, AWS, etc.)

#### Configuration Serveur Ubuntu
```bash
# Se connecter au VPS
ssh root@your-server-ip

# Mettre à jour le système
apt update && apt upgrade -y

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Installer MySQL
apt install -y mysql-server

# Configurer MySQL
mysql_secure_installation

# Installer PM2
npm install -g pm2

# Cloner le projet
git clone https://github.com/votre-repo/immo-tn.git
cd immo-tn/backend

# Installer les dépendances
npm install --production

# Configurer .env
nano .env

# Créer la base de données
mysql -u root -p < src/database/migrate.js

# Démarrer avec PM2
pm2 start server.js --name immo-api
pm2 save
pm2 startup

# Installer Nginx
apt install -y nginx

# Configurer Nginx
nano /etc/nginx/sites-available/immo-api
```

#### Configuration Nginx
```nginx
server {
    listen 80;
    server_name api.votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer le site
ln -s /etc/nginx/sites-available/immo-api /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Installer Certbot pour SSL
apt install -y certbot python3-certbot-nginx
certbot --nginx -d api.votre-domaine.com
```

---

## 📱 Déploiement Frontend

### Option 1: EAS Build (Expo Application Services)

#### Configuration Initiale
```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter à Expo
eas login

# Configurer le projet
cd frontend
eas build:configure
```

#### Fichier eas.json
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "buildType": "archive"
      }
    },
    "development": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### Build Android
```bash
# Build AAB pour Play Store
eas build --platform android --profile production

# Build APK pour test
eas build --platform android --profile development

# Télécharger le fichier
# URL fournie après le build
```

#### Build iOS
```bash
# Nécessite un compte Apple Developer ($99/an)
eas build --platform ios --profile production

# Submit à l'App Store
eas submit --platform ios
```

### Option 2: Build Local

#### Android
```bash
cd frontend

# Générer le bundle
expo build:android -t app-bundle

# Ou APK
expo build:android -t apk

# Le fichier sera disponible sur exp.host
```

#### iOS
```bash
# Nécessite macOS et Xcode
expo build:ios

# Suivre les instructions Expo
```

---

## 🌐 Configuration DNS

Si vous avez un domaine:

```dns
Type    Name    Value                   TTL
A       api     <votre-ip-serveur>      3600
CNAME   www     immo-tn.com             3600
```

---

## 📊 Monitoring

### Backend avec PM2
```bash
# Voir les logs
pm2 logs immo-api

# Monitoring
pm2 monit

# Redémarrer
pm2 restart immo-api

# Arrêter
pm2 stop immo-api
```

### Base de Données
```bash
# Se connecter
mysql -u root -p

# Voir les bases
SHOW DATABASES;

# Backup
mysqldump -u root -p immobilier_db > backup.sql

# Restore
mysql -u root -p immobilier_db < backup.sql
```

---

## 🔐 Sécurité en Production

### Backend
- ✅ Utiliser HTTPS (SSL/TLS)
- ✅ Configurer CORS strictement
- ✅ Implémenter rate limiting
- ✅ Masquer les erreurs détaillées
- ✅ Utiliser des mots de passe forts
- ✅ Sauvegardes régulières

### Frontend
- ✅ Minifier le code
- ✅ Obfusquer le code sensible
- ✅ Ne pas stocker de secrets dans le code
- ✅ Utiliser HTTPS pour les API

---

## 📈 Optimisation

### Backend
```javascript
// Activer la compression
const compression = require('compression');
app.use(compression());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

### Base de Données
```sql
-- Indexer les colonnes fréquemment recherchées
CREATE INDEX idx_city ON properties(city);
CREATE INDEX idx_price ON properties(price);
CREATE INDEX idx_user ON properties(user_id);
```

---

## 🆘 Troubleshooting

### Backend ne démarre pas
```bash
# Vérifier les logs
pm2 logs immo-api

# Vérifier la base de données
mysql -u root -p -e "SHOW DATABASES;"

# Vérifier les ports
netstat -tulpn | grep 3000
```

### App mobile ne se connecte pas
1. Vérifier l'URL de l'API dans `constants.js`
2. Tester l'API dans le navigateur
3. Vérifier le CORS
4. Vérifier le firewall du serveur

---

## 📞 Support

Pour toute question sur le déploiement:
- 📧 Email: rayenchraiet2000@gmail.com
- 📱 Tel: +216 94599198

---

**Bon déploiement! 🚀**
