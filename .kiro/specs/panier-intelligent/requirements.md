# Document des Exigences

## Introduction

L'application "Panier Intelligent" est un système de gestion des achats personnels qui permet aux utilisateurs de suivre leurs dépenses, analyser leurs habitudes d'achat et obtenir des insights sur leurs produits les plus achetés.

## Glossaire

- **Système**: L'application Panier Intelligent complète (frontend + backend)
- **Utilisateur**: Personne utilisant l'application pour gérer ses achats
- **Produit**: Article acheté avec un nom, prix et date d'achat
- **Achat**: Instance d'un produit acheté à une date donnée
- **Liste_Courses**: Collection de tous les achats enregistrés
- **Période**: Intervalle de temps défini pour l'analyse des données

## Exigences

### Exigence 1: Ajout d'Achats

**User Story:** En tant qu'utilisateur, je veux ajouter mes achats dans l'application, afin de pouvoir suivre mes dépenses et analyser mes habitudes de consommation.

#### Critères d'Acceptation

1. QUAND un utilisateur saisit un nom de produit, un prix positif et une date d'achat, ALORS LE Système DOIT créer un nouvel achat et l'ajouter à la Liste_Courses
2. QUAND un utilisateur tente de saisir un prix négatif ou nul, ALORS LE Système DOIT rejeter la saisie et afficher un message d'erreur
3. QUAND un utilisateur tente de saisir un nom de produit vide, ALORS LE Système DOIT rejeter la saisie et maintenir l'état actuel
4. QUAND un achat est ajouté avec succès, ALORS LE Système DOIT vider le formulaire et le préparer pour une nouvelle saisie
5. QUAND un achat est créé, ALORS LE Système DOIT persister immédiatement les données dans le backend

### Exigence 2: Affichage de la Liste des Courses

**User Story:** En tant qu'utilisateur, je veux voir tous mes achats organisés chronologiquement, afin de pouvoir consulter facilement mon historique récent.

#### Critères d'Acceptation

1. QUAND un utilisateur accède à la liste des courses, ALORS LE Système DOIT afficher tous les achats triés par date du plus récent au plus ancien
2. QUAND la liste est affichée, ALORS LE Système DOIT montrer pour chaque achat le nom du produit, le prix et la date d'achat
3. QUAND aucun achat n'existe, ALORS LE Système DOIT afficher un message informatif indiquant que la liste est vide
4. QUAND de nouveaux achats sont ajoutés, ALORS LE Système DOIT mettre à jour automatiquement l'affichage de la liste

### Exigence 3: Analyse du Produit le Plus Acheté

**User Story:** En tant qu'utilisateur, je veux connaître mon produit le plus acheté sur une période donnée, afin d'analyser mes habitudes de consommation.

#### Critères d'Acceptation

1. QUAND un utilisateur demande l'analyse du top produit, ALORS LE Système DOIT calculer le produit avec le plus grand nombre d'occurrences (pas le montant total)
2. QUAND plusieurs produits ont le même nombre d'occurrences maximum, ALORS LE Système DOIT retourner l'un d'entre eux de manière déterministe
3. QUAND aucun achat n'existe dans la période analysée, ALORS LE Système DOIT indiquer qu'aucune donnée n'est disponible
4. QUAND le calcul est effectué, ALORS LE Système DOIT afficher le nom du produit et le nombre d'occurrences

### Exigence 4: Bilan Financier

**User Story:** En tant qu'utilisateur, je veux connaître le montant total de mes dépenses, afin de suivre mon budget et mes habitudes financières.

#### Critères d'Acceptation

1. QUAND un utilisateur consulte le bilan financier, ALORS LE Système DOIT calculer et afficher la somme totale de tous les prix des achats dans la liste affichée
2. QUAND la liste des courses est vide, ALORS LE Système DOIT afficher un montant total de 0
3. QUAND de nouveaux achats sont ajoutés ou supprimés, ALORS LE Système DOIT recalculer automatiquement le montant total
4. QUAND le montant est affiché, ALORS LE Système DOIT utiliser un format monétaire approprié avec deux décimales

### Exigence 5: Architecture Frontend-Backend

**User Story:** En tant que développeur, je veux une architecture séparée frontend/backend, afin d'assurer la scalabilité et la maintenabilité de l'application.

#### Critères d'Acceptation

1. LE Frontend DOIT être implémenté en React et communiquer avec le backend via des API REST
2. LE Backend DOIT exposer des endpoints pour toutes les opérations CRUD sur les achats
3. QUAND le frontend fait une requête au backend, ALORS LE Système DOIT gérer les erreurs de communication et afficher des messages appropriés
4. QUAND des données sont échangées, ALORS LE Système DOIT utiliser le format JSON pour la sérialisation
5. LE Backend DOIT persister les données de manière durable (base de données ou fichier)

### Exigence 6: Gestion des Erreurs et Validation

**User Story:** En tant qu'utilisateur, je veux que l'application gère gracieusement les erreurs, afin d'avoir une expérience utilisateur fluide et informative.

#### Critères d'Acceptation

1. QUAND une erreur de validation se produit, ALORS LE Système DOIT afficher un message d'erreur clair et spécifique
2. QUAND une erreur de communication avec le backend se produit, ALORS LE Système DOIT informer l'utilisateur et proposer de réessayer
3. QUAND des données invalides sont reçues du backend, ALORS LE Système DOIT les rejeter et maintenir un état cohérent
4. QUAND une opération échoue, ALORS LE Système DOIT préserver l'état précédent et permettre à l'utilisateur de continuer