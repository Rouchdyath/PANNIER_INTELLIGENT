import { PurchaseManager } from './components/PurchaseManager';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🛒 Gestion des Courses</h1>
      </header>
      
      <main className="app-main">
        <PurchaseManager />
      </main>
    </div>
  );
}

export default App;
