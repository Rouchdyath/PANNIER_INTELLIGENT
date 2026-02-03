const API_BASE_URL = 'http://localhost:3000';

export interface CreatePurchaseDto {
  productId: number;
  price: number;
  purchaseDate: string;
  notes?: string;
}

export interface Purchase {
  id: number;
  price: number;
  purchaseDate: string;
  notes?: string;
  product: {
    id: number;
    name: string;
    category?: {
      name: string;
    };
  };
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  category?: {
    id: number;
    name: string;
  };
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface FinancialSummary {
  totalAmount: number;
  currency: string;
  purchaseCount: number;
}

export interface TopProductAnalysis {
  productName: string;
  occurrences: number;
  categoryName?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Purchases
  async createPurchase(data: CreatePurchaseDto): Promise<Purchase> {
    return this.request<Purchase>('/purchases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPurchases(): Promise<Purchase[]> {
    return this.request<Purchase[]>('/purchases');
  }

  async getFinancialSummary(): Promise<FinancialSummary> {
    return this.request<FinancialSummary>('/purchases/financial-summary');
  }

  async getTopProduct(): Promise<TopProductAnalysis> {
    return this.request<TopProductAnalysis>('/purchases/top-product');
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products');
  }

  async createProduct(data: { name: string; description?: string; brand?: string; categoryId?: number }): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async createCategory(data: { name: string; description?: string }): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();