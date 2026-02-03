import React, { useState, useEffect } from 'react';
import { apiService, type Purchase } from '../services/api';
import './PurchaseHistory.css';

interface PurchaseHistoryProps {
  refreshTrigger?: number;
}

export const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({ refreshTrigger }) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchPurchases();
  }, [refreshTrigger]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getPurchases();
      setPurchases(data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      setError('Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="purchase-history">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="purchase-history">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button onClick={fetchPurchases} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="purchase-history">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Aucun achat enregistré</h3>
          <p>Commencez par ajouter votre premier achat !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="purchase-history">
      <div className="history-header">
        <h2>Historique des Achats</h2>
        <div className="summary">
          <span className="total-items">{purchases.length} achat{purchases.length > 1 ? 's' : ''}</span>
          <span className="total-amount">Total: {formatPrice(getTotalAmount())}</span>
        </div>
      </div>

      <div className="purchases-list">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="purchase-item">
            <div className="purchase-main">
              <div className="product-info">
                <h4 className="product-name">{purchase.product.name}</h4>
                {purchase.product.category && (
                  <span className="category-badge">{purchase.product.category.name}</span>
                )}
              </div>
              <div className="purchase-details">
                <span className="price">{formatPrice(parseFloat(purchase.price.toString()))}</span>
                <span className="date">{formatDate(purchase.purchaseDate)}</span>
              </div>
            </div>
            {purchase.notes && (
              <div className="purchase-notes">
                <span className="notes-label">Note:</span>
                <span className="notes-text">{purchase.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="history-footer">
        <button onClick={fetchPurchases} className="refresh-btn">
          🔄 Actualiser
        </button>
      </div>
    </div>
  );
};