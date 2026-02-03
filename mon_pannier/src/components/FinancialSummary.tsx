import React, { useState, useEffect } from 'react';
import { apiService, type Purchase } from '../services/api';
import './FinancialSummary.css';

export const FinancialSummary: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '30' | '7' | 'month' | 'year'>('all');

  useEffect(() => {
    fetchFinancialData();
  }, [selectedPeriod]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const purchasesData = await apiService.getPurchases().catch(() => []);

      // Filtrer les achats selon la période sélectionnée
      const filteredPurchases = filterPurchasesByPeriod(purchasesData, selectedPeriod);
      
      setPurchases(filteredPurchases);
    } catch (error) {
      console.error('Erreur lors du chargement du bilan financier:', error);
      setError('Erreur lors du chargement du bilan financier');
    } finally {
      setLoading(false);
    }
  };

  const filterPurchasesByPeriod = (purchases: Purchase[], period: string): Purchase[] => {
    if (period === 'all') return purchases;
    
    const now = new Date();
    let cutoffDate: Date;
    
    switch (period) {
      case '7':
        cutoffDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        break;
      case '30':
        cutoffDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        break;
      case 'month':
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        cutoffDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return purchases;
    }
    
    return purchases.filter(purchase => 
      new Date(purchase.purchaseDate) >= cutoffDate
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTotalAmount = () => {
    return purchases.reduce((total, purchase) => total + parseFloat(purchase.price.toString()), 0);
  };

  const getAverageAmount = () => {
    if (purchases.length === 0) return 0;
    return getTotalAmount() / purchases.length;
  };

  const getDailyExpenses = () => {
    const dailyExpenses: { [key: string]: number } = {};
    
    purchases.forEach(purchase => {
      const date = new Date(purchase.purchaseDate).toISOString().split('T')[0];
      if (!dailyExpenses[date]) {
        dailyExpenses[date] = 0;
      }
      dailyExpenses[date] += parseFloat(purchase.price.toString());
    });

    return Object.entries(dailyExpenses)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  };

  const getMonthlyExpenses = () => {
    const monthlyExpenses: { [key: string]: number } = {};
    
    purchases.forEach(purchase => {
      const date = new Date(purchase.purchaseDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyExpenses[monthKey]) {
        monthlyExpenses[monthKey] = 0;
      }
      monthlyExpenses[monthKey] += parseFloat(purchase.price.toString());
    });

    return Object.entries(monthlyExpenses)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 6);
  };

  const getExpensesByCategory = () => {
    const categoryExpenses: { [key: string]: number } = {};
    
    purchases.forEach(purchase => {
      const categoryName = purchase.product.category?.name || 'Sans catégorie';
      if (!categoryExpenses[categoryName]) {
        categoryExpenses[categoryName] = 0;
      }
      categoryExpenses[categoryName] += parseFloat(purchase.price.toString());
    });

    return Object.entries(categoryExpenses)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case '7': return 'des 7 derniers jours';
      case '30': return 'des 30 derniers jours';
      case 'month': return 'de ce mois';
      case 'year': return 'de cette année';
      default: return 'de toute la période';
    }
  };

  if (loading) {
    return (
      <div className="financial-summary">
        <div className="financial-loading">
          <div className="loading-spinner"></div>
          <p>Chargement du bilan financier...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="financial-summary">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button onClick={fetchFinancialData} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = getTotalAmount();
  const averageAmount = getAverageAmount();
  const dailyExpenses = getDailyExpenses();
  const monthlyExpenses = getMonthlyExpenses();
  const categoryExpenses = getExpensesByCategory();

  return (
    <div className="financial-summary">
      <div className="financial-header">
        <h2>💰 Bilan Financier</h2>
        <div className="period-selector">
          <label>Période d'analyse :</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="period-select"
          >
            <option value="all">Toute la période</option>
            <option value="year">Cette année</option>
            <option value="month">Ce mois</option>
            <option value="30">30 derniers jours</option>
            <option value="7">7 derniers jours</option>
          </select>
        </div>
      </div>

      {purchases.length === 0 ? (
        <div className="empty-financial">
          <div className="empty-icon">💸</div>
          <h3>Aucune dépense pour cette période</h3>
          <p>Ajoutez des achats pour voir le bilan financier</p>
        </div>
      ) : (
        <div className="financial-content">
          {/* Résumé principal */}
          <div className="financial-overview">
            <div className="overview-card total">
              <div className="card-icon">💰</div>
              <div className="card-content">
                <span className="card-value">{formatPrice(totalAmount)}</span>
                <span className="card-label">Total dépensé {getPeriodLabel()}</span>
              </div>
            </div>
            <div className="overview-card average">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <span className="card-value">{formatPrice(averageAmount)}</span>
                <span className="card-label">Montant moyen par achat</span>
              </div>
            </div>
            <div className="overview-card count">
              <div className="card-icon">🛒</div>
              <div className="card-content">
                <span className="card-value">{purchases.length}</span>
                <span className="card-label">Nombre d'achats</span>
              </div>
            </div>
          </div>

          {/* Dépenses par catégorie */}
          <div className="financial-section">
            <h3>📂 Dépenses par Catégorie</h3>
            <div className="category-expenses">
              {categoryExpenses.map((item) => (
                <div key={item.category} className="category-expense-item">
                  <div className="category-info">
                    <span className="category-name">{item.category}</span>
                    <span className="category-percentage">
                      {((item.amount / totalAmount) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-fill" 
                      style={{ width: `${(item.amount / totalAmount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="category-amount">
                    {formatPrice(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dépenses quotidiennes */}
          <div className="financial-section">
            <h3>📅 Dépenses Quotidiennes Récentes</h3>
            <div className="daily-expenses">
              {dailyExpenses.map((item) => (
                <div key={item.date} className="daily-expense-item">
                  <div className="expense-date">
                    {new Date(item.date).toLocaleDateString('fr-FR', {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit'
                    })}
                  </div>
                  <div className="expense-bar">
                    <div 
                      className="expense-fill" 
                      style={{ 
                        width: `${(item.amount / Math.max(...dailyExpenses.map(d => d.amount))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="expense-amount">
                    {formatPrice(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Évolution mensuelle */}
          {monthlyExpenses.length > 1 && (
            <div className="financial-section">
              <h3>📈 Évolution Mensuelle</h3>
              <div className="monthly-expenses">
                {monthlyExpenses.map((item) => (
                  <div key={item.month} className="monthly-expense-item">
                    <div className="month-label">
                      {new Date(item.month + '-01').toLocaleDateString('fr-FR', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="month-bar">
                      <div 
                        className="month-fill" 
                        style={{ 
                          width: `${(item.amount / Math.max(...monthlyExpenses.map(m => m.amount))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="month-amount">
                      {formatPrice(item.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistiques détaillées */}
          <div className="financial-section">
            <h3>📋 Statistiques Détaillées</h3>
            <div className="detailed-stats">
              <div className="stat-row">
                <span className="stat-label">Dépense la plus élevée :</span>
                <span className="stat-value">
                  {formatPrice(Math.max(...purchases.map(p => parseFloat(p.price.toString()))))}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Dépense la plus faible :</span>
                <span className="stat-value">
                  {formatPrice(Math.min(...purchases.map(p => parseFloat(p.price.toString()))))}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Nombre de jours avec achats :</span>
                <span className="stat-value">
                  {new Set(purchases.map(p => new Date(p.purchaseDate).toDateString())).size}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Dépense moyenne par jour :</span>
                <span className="stat-value">
                  {formatPrice(totalAmount / new Set(purchases.map(p => new Date(p.purchaseDate).toDateString())).size)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="financial-actions">
        <button onClick={fetchFinancialData} className="refresh-financial-btn">
          🔄 Actualiser le bilan
        </button>
      </div>
    </div>
  );
};