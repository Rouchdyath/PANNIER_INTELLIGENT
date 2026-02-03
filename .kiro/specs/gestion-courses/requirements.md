# Document d'Exigences - Système de Gestion des Courses

## Introduction

Le système de gestion des courses permet aux utilisateurs de suivre leurs achats, d'analyser leurs habitudes de consommation et de gérer leur budget. L'application offre des fonctionnalités d'ajout d'achats, d'historique, d'analyse des produits les plus achetés et de bilan financier.

## Glossaire

- **Système**: L'application de gestion des courses
- **Utilisateur**: Personne utilisant l'application pour gérer ses courses
- **Achat**: Enregistrement d'un produit acheté avec son prix et sa date
- **Produit**: Article acheté identifié par son nom
- **Historique**: Liste chronologique des achats effectués
- **Période**: Intervalle de temps défini pour l'analyse des données

## Exigences

### Exigence 1: Ajout d'Achats

**User Story:** En tant qu'utilisateur, je veux ajouter un nouvel achat, afin de pouvoir enregistrer mes dépenses et suivre mes habitudes de consommation.

#### Critères d'Acceptation

1. QUAND un utilisateur saisit un nom de produit, un prix positif et une date d'achat, LE Système DOIT créer un nouvel enregistrement d'achat
2. QUAND un utilisateur tente de saisir un prix négatif ou nul, LE Système DOIT rejeter la saisie et afficher un message d'erreur
3. QUAND un utilisateur tente de saisir un nom de produit vide, LE Système DOIT rejeter la saisie et maintenir l'état actuel
4. QUAND un achat est ajouté avec succès, LE Système DOIT vider le formulaire et confirmer l'ajout
5. QUAND un achat est créé, LE Système DOIT persister les données immédiatement

### Exigence 2: Affichage de l'Historique

**User Story:** En tant qu'utilisateur, je veux consulter l'historique de mes achats, afin de pouvoir revoir mes dépenses passées.

#### Critères d'Acceptation

1. QUAND un utilisateur accède à l'historique, LE Système DOIT afficher tous les achats triés par date du plus récent au plus ancien
2. POUR chaque achat affiché, LE Système DOIT montrer le nom du produit, le prix et la date d'achat
3. QUAND aucun achat n'existe, LE Système DOIT afficher un message indiquant que l'historique est vide
4. QUAND l'historique est mis à jour, LE Système DOIT rafraîchir automatiquement l'affichage

### Exigence 3: Analyse du Produit le Plus Acheté

**User Story:** En tant qu'utilisateur, je veux connaître le produit que j'achète le plus souvent, afin d'analyser mes habitudes de consommation.

#### Critères d'Acceptation

1. QUAND un utilisateur demande l'analyse du top produit, LE Système DOIT calculer le nombre d'occurrences de chaque produit
2. QUAND plusieurs produits existent, LE Système DOIT identifier et afficher le nom du produit avec le plus grand nombre d'occurrences
3. QUAND plusieurs produits ont le même nombre d'occurrences maximum, LE Système DOIT afficher l'un d'entre eux de manière cohérente
4. QUAND aucun achat n'existe, LE Système DOIT indiquer qu'aucune analyse n'est possible
5. QUAND le calcul est effectué, LE Système DOIT baser l'analyse sur le nombre d'achats et non sur les montants

### Exigence 4: Bilan Financier

**User Story:** En tant qu'utilisateur, je veux connaître le montant total de mes dépenses, afin de suivre mon budget.

#### Critères d'Acceptation

1. QUAND un utilisateur consulte le bilan financier, LE Système DOIT calculer et afficher la somme totale de tous les prix des achats
2. QUAND aucun achat n'existe, LE Système DOIT afficher un montant total de zéro
3. QUAND de nouveaux achats sont ajoutés, LE Système DOIT mettre à jour automatiquement le montant total
4. QUAND le montant est affiché, LE Système DOIT formater la valeur avec la devise appropriée

### Exigence 5: Persistance des Données

**User Story:** En tant qu'utilisateur, je veux que mes données soient sauvegardées, afin de ne pas perdre mes informations entre les sessions.

#### Critères d'Acceptation

1. QUAND un achat est créé, LE Système DOIT le sauvegarder dans la base de données immédiatement
2. QUAND l'application est redémarrée, LE Système DOIT récupérer tous les achats précédemment sauvegardés
3. QUAND une opération de sauvegarde échoue, LE Système DOIT informer l'utilisateur et maintenir les données en mémoire
4. QUAND les données sont récupérées, LE Système DOIT valider leur intégrité avant de les afficher

### Exigence 6: Interface Utilisateur

**User Story:** En tant qu'utilisateur, je veux une interface claire et intuitive, afin de pouvoir utiliser facilement l'application.

#### Critères d'Acceptation

1. QUAND l'application se charge, LE Système DOIT afficher une interface avec les sections principales clairement identifiées
2. QUAND un utilisateur interagit avec un formulaire, LE Système DOIT fournir des retours visuels appropriés
3. QUAND une erreur survient, LE Système DOIT afficher des messages d'erreur clairs et compréhensibles
4. QUAND les données sont en cours de chargement, LE Système DOIT indiquer visuellement l'état de chargement