import React, { useState, useEffect } from 'react';
import { apiService, type FinancialSummary, type TopProductAnalysis } from '../services/api';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [topProduct, setTopProduct] = useState<TopProductAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [financial, top] = await Promise.all([
        apiService.getFinancialSummary().catch(() => ({ totalAmount: 0, currency: 'EUR', purchaseCount: 0 })),
        apiService.getTopProduct().catch(() => null)
      ]);
      
      setFinancialSummary(financial);
      setTopProduct(top);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Tableau de Bord</h2>
        <p>Vue d'ensemble de vos achats et dépenses</p>
      </div>

      <div className="dashboard-grid">
        {/* Fonctionnalité 1: Ajout d'achat */}
        <div className="dashboard-card feature-card">
          <div className="card-icon">➕</div>
          <div className="card-content">
            <h3>Ajouter un Achat</h3>
            <p>Enregistrez vos nouveaux achats avec prix et date</p>
            <div className="card-features">
              <span className="feature-tag">✓ Validation prix positif</span>
              <span className="feature-tag">✓ Ajout de produits</span>
              <span className="feature-tag">✓ Notes optionnelles</span>
            </div>
          </div>
        </div>

        {/* Fonctionnalité 2: Historique */}
        <div className="dashboard-card feature-card">
          <div className="card-icon">📋</div>
          <div className="card-content">
            <h3>Historique des Achats</h3>
            <p>Consultez tous vos achats triés par date</p>
            <div className="card-features">
              <span className="feature-tag">✓ Tri chronologique</span>
              <span className="feature-tag">✓ Détails complets</span>
              <span className="feature-tag">✓ Recherche facile</span>
            </div>
          </div>
        </div>

        {/* Fonctionnalité 3: Analyse - Top produit */}
        <div className="dashboard-card stats-card">
          <div className="card-icon">🏆</div>
          <div className="card-content">
            <h3>Produit le Plus Acheté</h3>
            {topProduct ? (
              <div className="stats-content">
                <div className="stat-main">
                  <span className="stat-value">{topProduct.productName}</span>
                  <span className="stat-label">{topProduct.occurrences} achat{topProduct.occurrences > 1 ? 's' : ''}</span>
                </div>
                {topProduct.categoryName && (
                  <div className="stat-category">
                    Catégorie: {topProduct.categoryName}
                  </div>
                )}
              </div>
            ) : (
              <div className="no-data">
                <p>Aucune donnée disponible</p>
                <small>Ajoutez des achats pour voir les statistiques</small>
              </div>
            )}
          </div>
        </div>

        {/* Fonctionnalité 4: Bilan financier */}
        <div className="dashboard-card stats-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Bilan Financier</h3>
            {financialSummary ? (
              <div className="stats-content">
                <div className="stat-main">
                  <span className="stat-value">{formatPrice(financialSummary.totalAmount)}</span>
                  <span className="stat-label">Total dépensé</span>
                </div>
                <div className="stat-secondary">
                  <span className="stat-count">{financialSummary.purchaseCount}</span>
                  <span className="stat-count-label">achat{financialSummary.purchaseCount > 1 ? 's' : ''} enregistré{financialSummary.purchaseCount > 1 ? 's' : ''}</span>
                </div>
              </div>
            ) : (
              <div className="no-data">
                <p>Aucune donnée disponible</p>
                <small>Commencez par ajouter des achats</small>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <button onClick={fetchDashboardData} className="refresh-dashboard-btn">
          🔄 Actualiser les données
        </button>
      </div>

      <div className="dashboard-info">
        <div className="info-section">
          <h4>🎯 Fonctionnalités Disponibles</h4>
          <ul>
            <li><strong>Ajout d'achat</strong> - Formulaire complet avec validation</li>
            <li><strong>Historique</strong> - Liste triée du plus récent au plus ancien</li>
            <li><strong>Top produit</strong> - Analyse par nombre d'occurrences</li>
            <li><strong>Bilan financier</strong> - Montant total et statistiques</li>
          </ul>
        </div>
      </div>
    </div>
  );
};