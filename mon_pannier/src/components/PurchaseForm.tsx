import React, { useState, useEffect } from 'react';
import './PurchaseForm.css';

interface Product {
  id: number;
  name: string;
  category?: { name: string };
}

interface Category {
  id: number;
  name: string;
}

interface PurchaseFormProps {
  onSubmit: (purchase: { productId: number; price: number; purchaseDate: string; notes?: string }) => void;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({ onSubmit }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    categoryId: ''
  });
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
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name.trim()) {
      alert('Le nom du produit est obligatoire');
      return;
    }

    try {
      const productData = {
        name: newProduct.name,
        brand: newProduct.brand || undefined,
        categoryId: newProduct.categoryId ? parseInt(newProduct.categoryId) : undefined
      };

      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const createdProduct = await response.json();
        await fetchProducts(); // Recharger la liste
        setFormData(prev => ({ ...prev, productId: createdProduct.id.toString() }));
        setNewProduct({ name: '', brand: '', categoryId: '' });
        setShowAddProduct(false);
      } else {
        alert('Erreur lors de la création du produit');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du produit');
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

  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="purchase-form">
      <h2>Ajouter un Achat</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productId">Produit *</label>
          <div className="product-select-container">
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
            <button
              type="button"
              className="add-product-btn"
              onClick={() => setShowAddProduct(!showAddProduct)}
            >
              {showAddProduct ? '✕' : '+'}
            </button>
          </div>
          {errors.productId && <span className="error-message">{errors.productId}</span>}
        </div>

        {showAddProduct && (
          <div className="add-product-form">
            <h3>Ajouter un nouveau produit</h3>
            <div className="form-group">
              <label htmlFor="newProductName">Nom du produit *</label>
              <input
                type="text"
                id="newProductName"
                name="name"
                value={newProduct.name}
                onChange={handleNewProductChange}
                placeholder="Ex: Yaourt nature"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newProductBrand">Marque (optionnel)</label>
              <input
                type="text"
                id="newProductBrand"
                name="brand"
                value={newProduct.brand}
                onChange={handleNewProductChange}
                placeholder="Ex: Danone"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newProductCategory">Catégorie (optionnel)</label>
              <select
                id="newProductCategory"
                name="categoryId"
                value={newProduct.categoryId}
                onChange={handleNewProductChange}
              >
                <option value="">Aucune catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-product-actions">
              <button type="button" onClick={handleAddProduct} className="confirm-btn">
                Ajouter le produit
              </button>
              <button type="button" onClick={() => setShowAddProduct(false)} className="cancel-btn">
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="price">Prix (FCFA) *</label>
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