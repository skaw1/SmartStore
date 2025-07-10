
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, Category, Order, StoreSettings, Review, SocialLink, QuickLink, PaymentMethod, PRODUCTS_DATA, CATEGORIES_DATA, ORDERS_DATA, STORE_SETTINGS_DATA, REVIEWS_DATA } from '../data/mock-data';

interface DataContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  reviews: Review[];
  settings: StoreSettings;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addProducts: (newProducts: Product[]) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'stockDeducted'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: Order['paymentStatus']) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  addReview: (review: Omit<Review, 'id' | 'status' | 'date'>) => void;
  updateReviewStatus: (reviewId: string, status: Review['status']) => void;
  deleteUserData: (customerName: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const getFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        }
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
    }
    return defaultValue;
};

const setInLocalStorage = <T,>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => getFromLocalStorage('products', PRODUCTS_DATA));
  const [categories, setCategories] = useState<Category[]>(() => getFromLocalStorage('categories', CATEGORIES_DATA));
  const [orders, setOrders] = useState<Order[]>(() => getFromLocalStorage('orders', ORDERS_DATA));
  const [reviews, setReviews] = useState<Review[]>(() => getFromLocalStorage('reviews', REVIEWS_DATA));
  const [settings, setSettings] = useState<StoreSettings>(() => getFromLocalStorage('settings', STORE_SETTINGS_DATA));

  useEffect(() => { setInLocalStorage('products', products); }, [products]);
  useEffect(() => { setInLocalStorage('categories', categories); }, [categories]);
  useEffect(() => { setInLocalStorage('orders', orders); }, [orders]);
  useEffect(() => { setInLocalStorage('reviews', reviews); }, [reviews]);
  useEffect(() => { setInLocalStorage('settings', settings); }, [settings]);

  const updateStock = (productId: string, quantity: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: p.stock + quantity } : p
    ));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: `prod${Date.now()}` };
    setProducts(prev => [newProduct, ...prev]);
  };

  const addProducts = (newProducts: Product[]) => {
    const uniqueNewProducts = newProducts.filter(np => !products.some(p => p.id === np.id));
    setProducts(prev => [...uniqueNewProducts, ...prev]);
  };
  
  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  
  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: `cat${Date.now()}` };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };
  
  const deleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const addOrder = (order: Omit<Order, 'id' | 'stockDeducted'>): Order => {
    const newOrder: Order = {
      ...order,
      id: `ORD${Date.now()}`,
      stockDeducted: false,
    };
    
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: Order['paymentStatus']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedOrder = {...o, paymentStatus};
        // Deduct stock on manual payment confirmation if not already deducted
        if (paymentStatus === 'Paid' && !o.stockDeducted) {
          updatedOrder.items.forEach(item => updateStock(item.productId, -item.quantity));
          updatedOrder.stockDeducted = true;
        }
        return updatedOrder;
      }
      return o;
    }));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedOrder = {...o, status};
        
        // Auto-update payment for Cash on Delivery
        if (status === 'Delivered' && updatedOrder.paymentMethod === 'Payment on Delivery') {
            updatedOrder.paymentStatus = 'Paid';
        }

        // Deduct stock on delivery if not already paid and deducted
        if (status === 'Delivered' && !o.stockDeducted) {
          updatedOrder.items.forEach(item => updateStock(item.productId, -item.quantity));
          updatedOrder.stockDeducted = true;
        }

        // Restock if a previously stock-deducted order is cancelled
        if (status === 'Cancelled' && o.stockDeducted) {
          updatedOrder.items.forEach(item => updateStock(item.productId, item.quantity));
          updatedOrder.stockDeducted = false;
        }
        return updatedOrder;
      }
      return o;
    }));
  };

  const addReview = (review: Omit<Review, 'id' | 'status' | 'date'>) => {
    const newReview: Review = {
        ...review,
        id: `rev${Date.now()}`,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const updateReviewStatus = (reviewId: string, status: Review['status']) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status } : r));
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({...prev, ...newSettings }));
  };

  const deleteUserData = (customerName: string) => {
    setOrders(prev => prev.filter(o => o.customerName !== customerName));
    setReviews(prev => prev.filter(r => r.customerName !== customerName));
    console.log(`Deleted all data for user: ${customerName}`);
  };


  const value = {
    products,
    categories,
    orders,
    reviews,
    settings,
    addProduct,
    addProducts,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateSettings,
    addReview,
    updateReviewStatus,
    deleteUserData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
