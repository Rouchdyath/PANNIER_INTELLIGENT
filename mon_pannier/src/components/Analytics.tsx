import React, { useState, useEffect } from 'react';
import { apiService, type Purchase } from '../services/api';
import './Analytics.css';

export const Analytics: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '30' | '7'>('all');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const purchasesData = await apiService.getPurchases().catch(() => []);

      // Filtrer les achats selon la période sélectionnée
      const filteredPurchases = filterPurchasesByPeriod(purchasesData, selectedPeriod);
      
      setPurchases(filteredPurchases);
    } catch (error) {
      console.error('Erreur lors du chargement des analyses:', error);
      setError('Erreur lors du chargement des analyses');
    } finally {
      setLoading(false);
    }
  };

  const filterPurchasesByPeriod = (purchases: Purchase[], period: string): Purchase[] => {
    if (period === 'all') return purchases;
    
    const now = new Date();
    const daysAgo = period === '30' ? 30 : 7;
    const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    return purchases.filter(purchase => 
      new Date(purchase.purchaseDate) >= cutoffDate
    );
  };

  const getProductStats = () => {
    const productCounts: { [key: string]: { count: number; totalAmount: number; product: string; category?: string } } = {};
    
    purchases.forEach(purchase => {
      const productName = purchase.product.name;
      if (!productCounts[productName]) {
        productCounts[productName] = {
          count: 0,
          totalAmount: 0,
          product: productName,
          category: purchase.product.category?.name
        };
      }
      productCounts[productName].count++;
      productCounts[productName].totalAmount += parseFloat(purchase.price.toString());
    });

    return Object.values(productCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getCategoryStats = () => {
    const categoryCounts: { [key: string]: { count: number; totalAmount: number } } = {};
    
    purchases.forEach(purchase => {
      const categoryName = purchase.product.category?.name || 'Sans catégorie';
      if (!categoryCounts[categoryName]) {
        categoryCounts[categoryName] = { count: 0, totalAmount: 0 };
      }
      categoryCounts[categoryName].count++;
      categoryCounts[categoryName].totalAmount += parseFloat(purchase.price.toString());
    });

    return Object.entries(categoryCounts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case '7': return 'des 7 derniers jours';
      case '30': return 'des 30 derniers jours';
      default: return 'de toute la période';
    }
  };

  if (loading) {
    return (
      <div className="analytics">
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des analyses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button onClick={fetchAnalyticsData} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const productStats = getProductStats();
  const categoryStats = getCategoryStats();

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>📊 Analyse des Achats</h2>
        <div className="period-selector">
          <label>Période d'analyse :</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value as 'all' | '30' | '7')}
            className="period-select"
          >
            <option value="all">Toute la période</option>
            <option value="30">30 derniers jours</option>
            <option value="7">7 derniers jours</option>
          </select>
        </div>
      </div>

      {purchases.length === 0 ? (
        <div className="empty-analytics">
          <div className="empty-icon">📈</div>
          <h3>Aucune donnée pour cette période</h3>
          <p>Ajoutez des achats pour voir les analyses</p>
        </div>
      ) : (
        <div className="analytics-content">
          {/* Résumé général */}
          <div className="analytics-summary">
            <div className="summary-card">
              <div className="summary-icon">🛒</div>
              <div className="summary-content">
                <span className="summary-value">{purchases.length}</span>
                <span className="summary-label">Achats {getPeriodLabel()}</span>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-content">
                <span className="summary-value">
                  {formatPrice(purchases.reduce((sum, p) => sum + parseFloat(p.price.toString()), 0))}
                </span>
                <span className="summary-label">Total dépensé</span>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📦</div>
              <div className="summary-content">
                <span className="summary-value">{new Set(purchases.map(p => p.product.name)).size}</span>
                <span className="summary-label">Produits différents</span>
              </div>
            </div>
          </div>

          {/* Top produits */}
          <div className="analytics-section">
            <h3>🏆 Top 5 des Produits les Plus Achetés</h3>
            <p className="section-subtitle">Classement par nombre d'occurrences {getPeriodLabel()}</p>
            <div className="top-products">
              {productStats.map((product, index) => (
                <div key={product.product} className="product-rank-item">
                  <div className="rank-badge">
                    <span className="rank-number">{index + 1}</span>
                  </div>
                  <div className="product-info">
                    <h4>{product.product}</h4>
                    {product.category && <span className="product-category">{product.category}</span>}
                  </div>
                  <div className="product-stats">
                    <div className="stat-item">
                      <span className="stat-value">{product.count}</span>
                      <span className="stat-label">achat{product.count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{formatPrice(product.totalAmount)}</span>
                      <span className="stat-label">total</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analyse par catégories */}
          <div className="analytics-section">
            <h3>📂 Analyse par Catégories</h3>
            <p className="section-subtitle">Répartition des achats par catégorie</p>
            <div className="category-stats">
              {categoryStats.map((category) => (
                <div key={category.name} className="category-item">
                  <div className="category-header">
                    <span className="category-name">{category.name}</span>
                    <span className="category-percentage">
                      {((category.count / purchases.length) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-fill" 
                      style={{ width: `${(category.count / purchases.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="category-details">
                    <span>{category.count} achat{category.count > 1 ? 's' : ''}</span>
                    <span>{formatPrice(category.totalAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tendances récentes */}
          <div className="analytics-section">
            <h3>📈 Achats Récents</h3>
            <p className="section-subtitle">Vos 5 derniers achats</p>
            <div className="recent-purchases">
              {purchases.slice(0, 5).map((purchase) => (
                <div key={purchase.id} className="recent-purchase-item">
                  <div className="purchase-product">
                    <span className="product-name">{purchase.product.name}</span>
                    {purchase.product.category && (
                      <span className="product-category">{purchase.product.category.name}</span>
                    )}
                  </div>
                  <div className="purchase-details">
                    <span className="purchase-price">{formatPrice(parseFloat(purchase.price.toString()))}</span>
                    <span className="purchase-date">
                      {new Date(purchase.purchaseDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="analytics-actions">
        <button onClick={fetchAnalyticsData} className="refresh-analytics-btn">
          🔄 Actualiser les analyses
        </button>
      </div>
    </div>
  );
};