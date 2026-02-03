# Configuration de la Base de Données PostgreSQL

## Prérequis

1. **Installer PostgreSQL** sur votre système :
   - Windows : Télécharger depuis https://www.postgresql.org/download/windows/
   - macOS : `brew install postgresql`
   - Linux : `sudo apt-get install postgresql postgresql-contrib`

2. **Démarrer le service PostgreSQL** :
   - Windows : Le service démarre automatiquement
   - macOS : `brew services start postgresql`
   - Linux : `sudo systemctl start postgresql`

## Configuration

1. **Copier le fichier d'environnement** :
   ```bash
   cp .env.example .env
   ```

2. **Modifier les variables d'environnement** dans `.env` :
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=gestion_courses
   ```

3. **Créer la base de données** :
   ```bash
   # Se connecter à PostgreSQL
   psql -U postgres
   
   # Créer la base de données
   CREATE DATABASE gestion_courses;
   
   # Quitter psql
   \q
   ```

4. **Démarrer l'application** :
   ```bash
   npm run start:dev
   ```

   TypeORM créera automatiquement les tables grâce à `synchronize: true`.

## Données de Test (Optionnel)

Pour ajouter des données de test :

```bash
psql -U postgres -d gestion_courses -f database/init.sql
```

## Structure des Tables

### Categories
- `id` : Identifiant unique
- `name` : Nom de la catégorie (unique)
- `description` : Description optionnelle
- `createdAt`, `updatedAt` : Timestamps

### Products
- `id` : Identifiant unique
- `name` : Nom du produit
- `description` : Description optionnelle
- `brand` : Marque optionnelle
- `category_id` : Référence vers la catégorie
- `createdAt`, `updatedAt` : Timestamps

### Purchases
- `id` : Identifiant unique
- `product_id` : Référence vers le produit
- `price` : Prix d'achat (> 0)
- `purchase_date` : Date d'achat
- `notes` : Notes optionnelles
- `createdAt`, `updatedAt` : Timestamps

## Commandes Utiles

```bash
# Voir les logs de l'application
npm run start:dev

# Construire l'application
npm run build

# Lancer les tests
npm run test

# Se connecter à la base de données
psql -U postgres -d gestion_courses
```