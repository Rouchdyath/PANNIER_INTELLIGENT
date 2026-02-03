# 🚀 Guide de Déploiement - Gestion des Courses

## 📋 Vue d'ensemble

Cette application se compose de :
- **Frontend** : React + TypeScript + Vite
- **Backend** : NestJS + TypeORM
- **Base de données** : PostgreSQL

## 🗄️ 1. Déploiement de la Base de Données (Neon)

### Étapes :
1. Allez sur [neon.tech](https://neon.tech)
2. Créez un compte gratuit
3. Créez un nouveau projet "gestion-courses"
4. Copiez la chaîne de connexion PostgreSQL
5. Dans le Query Editor de Neon, exécutez le script SQL suivant :

```sql
-- Création des tables
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(255),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    purchase_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de données de test
INSERT INTO categories (name, description) VALUES 
('Alimentaire', 'Produits alimentaires et boissons'),
('Hygiène', 'Produits d''hygiène et de beauté'),
('Ménage', 'Produits d''entretien ménager'),
('Électronique', 'Appareils et accessoires électroniques');

INSERT INTO products (name, description, brand, category_id) VALUES 
('Riz Basmati', 'Riz basmati de qualité premium', 'Uncle Ben''s', 1),
('Savon de Marseille', 'Savon naturel traditionnel', 'Le Petit Marseillais', 2),
('Liquide vaisselle', 'Dégraissant efficace', 'Paic', 3);
```

## 🔧 2. Déploiement du Backend (Railway)

### Étapes :
1. Allez sur [railway.app](https://railway.app)
2. Connectez-vous avec GitHub
3. Cliquez sur "New Project" → "Deploy from GitHub repo"
4. Sélectionnez votre repository `PANNIER_INTELLIGENT`
5. Choisissez le dossier `backend` comme root directory
6. Configurez les variables d'environnement :

### Variables d'environnement Railway :
```
DATABASE_URL=postgresql://[votre-url-neon-complète]
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://[votre-app].vercel.app
```

### Configuration Railway :
- **Root Directory** : `backend`
- **Build Command** : `npm run build`
- **Start Command** : `npm run start:prod`

## 🌐 3. Déploiement du Frontend (Vercel)

### Étapes :
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur "New Project"
4. Sélectionnez votre repository `PANNIER_INTELLIGENT`
5. Configurez le projet :

### Configuration Vercel :
- **Framework Preset** : Vite
- **Root Directory** : `mon_pannier`
- **Build Command** : `npm run build`
- **Output Directory** : `dist`
- **Install Command** : `npm install`

### Variables d'environnement Vercel :
```
VITE_API_URL=https://[votre-backend-railway].railway.app
```

## 🔗 4. Configuration finale

### Après déploiement :
1. **Testez l'API backend** : `https://[votre-backend].railway.app`
2. **Testez le frontend** : `https://[votre-app].vercel.app`
3. **Vérifiez la connexion** entre frontend et backend
4. **Testez toutes les fonctionnalités** :
   - Ajout d'achat
   - Historique
   - Analyses
   - Bilan financier

## 🐛 Dépannage

### Problèmes courants :
- **CORS Error** : Vérifiez que `FRONTEND_URL` est correctement configuré dans Railway
- **Database Connection** : Vérifiez que `DATABASE_URL` est correct dans Railway
- **API Not Found** : Vérifiez que `VITE_API_URL` pointe vers Railway dans Vercel

## 📱 URLs finales

Une fois déployé, vous aurez :
- **Frontend** : `https://[nom-app].vercel.app`
- **Backend API** : `https://[nom-app].railway.app`
- **Base de données** : Hébergée sur Neon

---

## ✅ Checklist de déploiement

- [ ] Base de données créée sur Neon
- [ ] Script SQL exécuté
- [ ] Backend déployé sur Railway
- [ ] Variables d'environnement configurées sur Railway
- [ ] Frontend déployé sur Vercel
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Tests de toutes les fonctionnalités
- [ ] Application accessible publiquement

🎉 **Félicitations ! Votre application est maintenant déployée et accessible au monde entier !**