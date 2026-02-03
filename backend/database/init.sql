-- Script d'initialisation de la base de données PostgreSQL
-- Créer la base de données (à exécuter en tant que superuser)
CREATE DATABASE courses_bd;

-- Se connecter à la base de données gestion_courses
\c gestion_courses;

-- Les tables seront créées automatiquement par TypeORM avec synchronize: true

-- Données de test pour les catégories
INSERT INTO categories (name, description, "createdAt", "updatedAt") VALUES
('Alimentation', 'Produits alimentaires et boissons', NOW(), NOW()),
('Hygiène', 'Produits d''hygiène et de beauté', NOW(), NOW()),
('Entretien', 'Produits d''entretien ménager', NOW(), NOW()),
('Électronique', 'Appareils et accessoires électroniques', NOW(), NOW());

-- Données de test pour les produits
INSERT INTO products (name, description, brand, category_id, "createdAt", "updatedAt") VALUES
('Pain de mie', 'Pain de mie complet', 'Harry''s', 1, NOW(), NOW()),
('Lait', 'Lait demi-écrémé 1L', 'Lactel', 1, NOW(), NOW()),
('Shampoing', 'Shampoing cheveux normaux', 'L''Oréal', 2, NOW(), NOW()),
('Liquide vaisselle', 'Liquide vaisselle citron', 'Paic', 3, NOW(), NOW()),
('Smartphone', 'Smartphone Android', 'Samsung', 4, NOW(), NOW());

-- Données de test pour les achats
INSERT INTO purchases (product_id, price, purchase_date, notes, "createdAt", "updatedAt") VALUES
(1, 2.50, '2024-01-15', 'Promotion -20%', NOW(), NOW()),
(2, 1.20, '2024-01-15', NULL, NOW(), NOW()),
(1, 2.80, '2024-01-20', NULL, NOW(), NOW()),
(3, 4.50, '2024-01-22', NULL, NOW(), NOW()),
(4, 3.20, '2024-01-25', NULL, NOW(), NOW()),
(1, 2.50, '2024-01-28', 'Même promotion', NOW(), NOW()),
(2, 1.25, '2024-02-01', 'Prix augmenté', NOW(), NOW());