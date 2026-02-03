# Plan d'Implémentation : Système de Gestion des Courses

## Vue d'Ensemble

Implémentation progressive du système de gestion des courses en commençant par les entités de base, puis les fonctionnalités d'ajout d'achats, et enfin les fonctionnalités d'analyse. Chaque étape construit sur la précédente avec validation incrémentale.

## Tâches

- [ ] 1. Configuration de la structure de base et entités
  - [x] 1.1 Créer l'entité Purchase avec TypeORM
    - Définir les propriétés : id, productName, price, purchaseDate, createdAt, updatedAt
    - Ajouter les contraintes de validation (prix positif, nom non vide)
    - Configurer les index pour optimiser les requêtes
    - _Exigences: 5.1, 5.4_
  
  - [ ]* 1.2 Écrire les tests de propriété pour l'entité Purchase
    - **Propriété 4: Persistance immédiate**
    - **Valide: Exigences 1.5, 5.1**
  
  - [x] 1.3 Créer les DTOs pour la validation des données
    - CreatePurchaseDto avec validation des champs
    - TopProductAnalysisDto pour les réponses d'analyse
    - FinancialSummaryDto pour le bilan financier
    - _Exigences: 1.1, 1.2, 1.3_

- [ ] 2. Implémentation du service métier des achats
  - [x] 2.1 Créer le PurchasesService avec les méthodes de base
    - Méthode create() avec validation métier
    - Méthode findAll() avec tri par date
    - Gestion des erreurs et validation des données
    - _Exigences: 1.1, 1.2, 1.3, 2.1_
  
  - [ ]* 2.2 Écrire les tests de propriété pour la création d'achats
    - **Propriété 1: Création d'achat avec données valides**
    - **Valide: Exigences 1.1**
  
  - [ ]* 2.3 Écrire les tests de propriété pour la validation
    - **Propriété 2: Rejet des prix invalides**
    - **Propriété 3: Rejet des noms de produits invalides**
    - **Valide: Exigences 1.2, 1.3**
  
  - [ ]* 2.4 Écrire les tests de propriété pour l'historique
    - **Propriété 5: Tri chronologique de l'historique**
    - **Propriété 6: Complétude des informations d'achat**
    - **Valide: Exigences 2.1, 2.2**

- [ ] 3. Implémentation du contrôleur REST API
  - [x] 3.1 Créer le PurchasesController avec les endpoints de base
    - POST /purchases pour créer un achat
    - GET /purchases pour récupérer l'historique
    - Gestion des erreurs HTTP et validation des DTOs
    - _Exigences: 1.1, 1.4, 2.1, 2.4_
  
  - [ ]* 3.2 Écrire les tests d'intégration pour l'API
    - Tests des endpoints avec données valides et invalides
    - Validation des codes de statut HTTP
    - _Exigences: 1.1, 1.2, 1.3, 2.1_

- [ ] 4. Point de contrôle - Fonctionnalité d'ajout d'achats
  - S'assurer que tous les tests passent, demander à l'utilisateur si des questions se posent.

- [ ] 5. Implémentation des fonctionnalités d'analyse
  - [ ] 5.1 Ajouter les méthodes d'analyse au PurchasesService
    - Méthode getTopProduct() pour calculer le produit le plus acheté
    - Méthode getFinancialSummary() pour calculer le bilan financier
    - Logique de calcul des occurrences et gestion des cas d'égalité
    - _Exigences: 3.1, 3.2, 3.3, 3.5, 4.1_
  
  - [ ]* 5.2 Écrire les tests de propriété pour l'analyse des produits
    - **Propriété 7: Calcul correct des occurrences**
    - **Propriété 8: Identification du produit le plus acheté**
    - **Propriété 9: Cohérence en cas d'égalité**
    - **Propriété 10: Analyse basée sur les occurrences**
    - **Valide: Exigences 3.1, 3.2, 3.3, 3.5**
  
  - [ ]* 5.3 Écrire les tests de propriété pour le bilan financier
    - **Propriété 11: Calcul correct du bilan financier**
    - **Propriété 12: Formatage monétaire**
    - **Valide: Exigences 4.1, 4.4**
  
  - [ ] 5.4 Ajouter les endpoints d'analyse au contrôleur
    - GET /purchases/top-product pour le produit le plus acheté
    - GET /purchases/financial-summary pour le bilan financier
    - _Exigences: 3.1, 3.4, 4.1, 4.2_

- [ ] 6. Implémentation de l'interface utilisateur React
  - [x] 6.1 Créer le composant PurchaseForm
    - Formulaire avec champs : nom du produit, prix, date
    - Validation côté client et gestion des erreurs
    - Soumission et réinitialisation du formulaire
    - _Exigences: 1.1, 1.2, 1.3, 1.4, 6.3_
  
  - [x] 6.2 Créer le composant PurchaseHistory
    - Affichage de la liste des achats triée par date
    - Formatage des données (prix, date)
    - Gestion de l'état vide
    - _Exigences: 2.1, 2.2, 2.3_
  
  - [x] 6.3 Créer les composants d'analyse
    - TopProductAnalysis pour afficher le produit le plus acheté
    - FinancialSummary pour afficher le bilan financier
    - Gestion des cas d'état vide
    - _Exigences: 3.2, 3.4, 4.1, 4.2_
  
  - [ ]* 6.4 Écrire les tests de composants React
    - Tests de rendu et d'interaction pour chaque composant
    - Tests de validation côté client
    - _Exigences: 1.4, 2.4, 4.3_

- [ ] 7. Intégration et services de communication
  - [ ] 7.1 Créer le service API client
    - Fonctions pour appeler les endpoints REST
    - Gestion des erreurs réseau et timeout
    - Configuration des headers et authentification si nécessaire
    - _Exigences: 5.3, 6.3_
  
  - [ ] 7.2 Créer les hooks personnalisés React
    - usePurchases pour gérer l'état des achats
    - useTopProduct pour l'analyse du produit le plus acheté
    - useFinancialSummary pour le bilan financier
    - _Exigences: 2.4, 4.3_
  
  - [ ] 7.3 Intégrer tous les composants dans l'application principale
    - Composant PurchaseManager orchestrant tous les sous-composants
    - Gestion de l'état global et synchronisation
    - _Exigences: 6.1_

- [ ] 8. Gestion avancée des erreurs et validation
  - [ ] 8.1 Implémenter la gestion robuste des erreurs
    - Intercepteurs d'erreurs pour l'API
    - Messages d'erreur localisés en français
    - Fallback gracieux en cas d'échec
    - _Exigences: 5.3, 6.3_
  
  - [ ]* 8.2 Écrire les tests de propriété pour la gestion d'erreurs
    - **Propriété 13: Gestion des erreurs de persistance**
    - **Propriété 14: Validation des données récupérées**
    - **Propriété 15: Affichage des messages d'erreur**
    - **Valide: Exigences 5.3, 5.4, 6.3**

- [ ] 9. Point de contrôle final
  - S'assurer que tous les tests passent, demander à l'utilisateur si des questions se posent.

## Notes

- Les tâches marquées avec `*` sont optionnelles et peuvent être ignorées pour un MVP plus rapide
- Chaque tâche référence les exigences spécifiques pour la traçabilité
- Les points de contrôle assurent une validation incrémentale
- Les tests de propriété valident les propriétés de correction universelles
- Les tests unitaires valident des exemples spécifiques et des cas limites