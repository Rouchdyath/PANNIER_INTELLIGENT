import { useState } from 'react';
import { PurchaseForm } from './components/PurchaseForm';
import { apiService, type CreatePurchaseDto } from './services/api';
import './App.css';

function App() {
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handlePurchaseSubmit = async (purchaseData: CreatePurchaseDto) => {
    try {
      await apiService.createPurchase(purchaseData);
      setMessage('Achat ajouté avec succès !');
      setMessageType('success');
      
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
    <div className="app">
      <header className="app-header">
        <h1>🛒 Gestion des Courses</h1>
      </header>
      
      <main className="app-main">
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
        
        <PurchaseForm onSubmit={handlePurchaseSubmit} />
      </main>
    </div>
  );
}

export default App;
