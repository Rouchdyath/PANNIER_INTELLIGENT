import React, { useState } from 'react';
import { PurchaseForm } from './PurchaseForm';
import { PurchaseHistory } from './PurchaseHistory';
import { Dashboard } from './Dashboard';
import { apiService, type CreatePurchaseDto } from '../services/api';
import './PurchaseManager.css';

export const PurchaseManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form' | 'history'>('dashboard');
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePurchaseSubmit = async (purchaseData: CreatePurchaseDto) => {
    try {
      await apiService.createPurchase(purchaseData);
      setMessage('Achat ajouté avec succès !');
      setMessageType('success');
      
      // Déclencher le rafraîchissement de l'historique
      setRefreshTrigger(prev => prev + 1);
      
      // Passer automatiquement à l'historique pour voir le nouvel achat
      setTimeout(() => {
        setActiveTab('history');
      }, 1000);
      
      // Effacer le message après 3 secondes
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors de l\'ajout de l\'achat');
      setMessageType('error');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="purchase-manager">
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          ➕ Ajouter un Achat
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📋 Historique
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'dashboard' && (
          <Dashboard />
        )}
        {activeTab === 'form' && (
          <PurchaseForm onSubmit={handlePurchaseSubmit} />
        )}
        {activeTab === 'history' && (
          <PurchaseHistory refreshTrigger={refreshTrigger} />
        )}
      </div>
    </div>
  );
};