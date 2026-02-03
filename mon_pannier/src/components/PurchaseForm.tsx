import React, { useState, useEffect } from 'react';
import './PurchaseForm.css';

interface Product {
  id: number;
  name: string;
  category?: { name: string };
}

interface PurchaseFormProps {
  onSubmit: (purchase: { productId: number; price: number; purchaseDate: string; notes?: string }) => void;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({ onSubmit }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    productId: '',
    price: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) {
      newErrors.productId = 'Veuillez sélectionner un produit';
    }

    if (!formData.price) {
      newErrors.price = 'Le prix est obligatoire';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Le prix doit être positif';
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'La date est obligatoire';
    } else if (new Date(formData.purchaseDate) > new Date()) {
      newErrors.purchaseDate = 'La date ne peut pas être dans le futur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit({
        productId: parseInt(formData.productId),
        price: parseFloat(formData.price),
        purchaseDate: formData.purchaseDate,
        notes: formData.notes || undefined
      });

      // Réinitialiser le formulaire
      setFormData({
        productId: '',
        price: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="purchase-form">
      <h2>Ajouter un Achat</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productId">Produit *</label>
          <select
            id="productId"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className={errors.productId ? 'error' : ''}
          >
            <option value="">Sélectionner un produit</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} {product.category && `(${product.category.name})`}
              </option>
            ))}
          </select>
          {errors.productId && <span className="error-message">{errors.productId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Prix (€) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            placeholder="0.00"
            className={errors.price ? 'error' : ''}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="purchaseDate">Date d'achat *</label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className={errors.purchaseDate ? 'error' : ''}
          />
          {errors.purchaseDate && <span className="error-message">{errors.purchaseDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes (optionnel)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes sur cet achat..."
            rows={3}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Ajout en cours...' : 'Ajouter l\'achat'}
        </button>
      </form>
    </div>
  );
};