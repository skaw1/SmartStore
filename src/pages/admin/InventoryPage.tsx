
import React, { useState, useMemo } from 'react';
import { Product, Category, Order } from '../../data/mock-data';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Icons } from '../../components/icons';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useData } from '../../contexts/DataContext';
import { useNotification } from '../../contexts/NotificationContext';
import Textarea from '../../components/ui/Textarea';

const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}> = ({ isOpen, onClose, onConfirm, title, description }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <Icons.Trash2 className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white" id="modal-title">
                {title}
            </h3>
            <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
                </p>
            </div>
        </div>
    </div>
    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
      <Button variant="destructive" onClick={onConfirm}>
        Remove
      </Button>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
    </div>
  </Modal>
);


const InventoryPage: React.FC = () => {
  const { 
    products, 
    categories, 
    orders,
    addProduct, 
    updateProduct, 
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useData();
  const { showToast } = useNotification();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'product' | 'category' | null>(null);
  const [currentItem, setCurrentItem] = useState<Product | Category | null>(null);

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', description: '', onConfirm: () => {} });

  const openModal = (type: 'product' | 'category', item: Product | Category | null = null) => {
    setModalType(type);
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setCurrentItem(null);
    setConfirmModal(prev => ({...prev, isOpen: false}));
  };

  const handleProductSave = (product: Product) => {
    if (currentItem && 'stock' in currentItem) {
      updateProduct(product);
      showToast('Product updated successfully!', 'success');
    } else {
      addProduct(product);
      showToast('Product added successfully!', 'success');
    }
    closeModal();
  };
  
  const handleCategorySave = (category: Category) => {
    if (currentItem) {
      updateCategory(category);
       showToast('Category updated successfully!', 'success');
    } else {
      addCategory({ ...category, imageUrl: 'https://picsum.photos/seed/newcat/400/400' });
       showToast('Category added successfully!', 'success');
    }
    closeModal();
  };

  const handleRemoveRequest = (type: 'product' | 'category', item: Product | Category) => {
    setConfirmModal({
        isOpen: true,
        title: `Remove ${item.name}`,
        description: `Are you sure you want to remove this ${type}? This action cannot be undone.`,
        onConfirm: () => {
            if (type === 'product') {
                deleteProduct(item.id);
            } else {
                deleteCategory(item.id);
            }
            showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully.`, 'success');
            closeModal();
        }
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary-dark dark:text-white">Inventory Management</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Products</CardTitle>
            <CardDescription>Add, edit, or remove products from your store.</CardDescription>
          </div>
          <Button onClick={() => openModal('product')}>
            <Icons.PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </CardHeader>
        <CardContent>
          <ProductTable products={products} orders={orders} onEdit={(p) => openModal('product', p)} onRemove={(p) => handleRemoveRequest('product', p)} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Categories</CardTitle>
            <CardDescription>Add, edit, or remove product categories.</CardDescription>
          </div>
           <Button onClick={() => openModal('category')}>
            <Icons.PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          <CategoryTable categories={categories} products={products} onEdit={(c) => openModal('category', c)} onRemove={(c) => handleRemoveRequest('category', c)} />
        </CardContent>
      </Card>

      <ConfirmationModal {...confirmModal} onClose={closeModal} />

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {modalType === 'product' && <ProductForm product={currentItem as Product | null} onSave={handleProductSave} onCancel={closeModal} categories={categories} />}
          {modalType === 'category' && <CategoryForm category={currentItem as Category | null} onSave={handleCategorySave} onCancel={closeModal} />}
        </Modal>
      )}
    </div>
  );
};

// --- Sub-components for Inventory Page ---

const ProductTable: React.FC<{ products: Product[], orders: Order[], onEdit: (p: Product) => void, onRemove: (p: Product) => void }> = ({ products, orders, onEdit, onRemove }) => {
    const productsInOrders = useMemo(() => {
        const ids = new Set<string>();
        orders.forEach(o => o.items.forEach(item => ids.add(item.productId)));
        return ids;
    }, [orders]);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                <th scope="col" className="px-6 py-3">Product Name</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Stock</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map(p => {
                    const isInUse = productsInOrders.has(p.id);
                    return (
                        <tr key={p.id} className="bg-white border-b dark:bg-primary-dark dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{p.name}</td>
                            <td className="px-6 py-4">{p.category}</td>
                            <td className={`px-6 py-4 font-bold ${p.stock < 10 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>{p.stock}</td>
                            <td className="px-6 py-4">Ksh {p.price.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right space-x-2">
                            <Button size="icon" variant="ghost" onClick={() => onEdit(p)}><Icons.Edit className="h-4 w-4" /></Button>
                            <div className="relative inline-block" title={isInUse ? 'Cannot remove product that is part of an order.' : 'Remove product'}>
                                <Button size="icon" variant="ghost" onClick={() => onRemove(p)} disabled={isInUse}>
                                    <Icons.Trash2 className={`h-4 w-4 transition-colors ${isInUse ? 'text-gray-400 cursor-not-allowed' : 'text-red-500'}`} />
                                </Button>
                            </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
            </table>
        </div>
    );
};

const CategoryTable: React.FC<{ categories: Category[], products: Product[], onEdit: (c: Category) => void, onRemove: (c: Category) => void }> = ({ categories, products, onEdit, onRemove }) => {
    const productsInCategory = useMemo(() => {
        const categoryNames = new Set<string>();
        products.forEach(p => categoryNames.add(p.category));
        return categoryNames;
    }, [products]);

    return (
        <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
            <th scope="col" className="px-6 py-3">Category Name</th>
            <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
        </thead>
        <tbody>
            {categories.map(c => {
                const isInUse = productsInCategory.has(c.name);
                return (
                    <tr key={c.id} className="bg-white border-b dark:bg-primary-dark dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{c.name}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                        <Button size="icon" variant="ghost" onClick={() => onEdit(c)}><Icons.Edit className="h-4 w-4" /></Button>
                        <div className="relative inline-block" title={isInUse ? "Cannot remove category with assigned products." : "Remove category"}>
                            <Button size="icon" variant="ghost" onClick={() => onRemove(c)} disabled={isInUse}>
                                <Icons.Trash2 className={`h-4 w-4 transition-colors ${isInUse ? 'text-gray-400 cursor-not-allowed' : 'text-red-500'}`} />
                            </Button>
                        </div>
                        </td>
                    </tr>
                );
            })}
        </tbody>
        </table>
    </div>
    );
};

const ProductForm: React.FC<{ product: Product | null, onSave: (p: Product) => void, onCancel: () => void, categories: Category[] }> = ({ product, onSave, onCancel, categories }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>(product || { name: '', price: 0, imageUrls: [], category: '', colors: [], stock: 0, description: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
     setFormData(prev => {
        if (name === 'price' || name === 'stock') {
            return {...prev, [name]: parseInt(value, 10) || 0 };
        }
        if (name === 'colors' || name === 'imageUrls') {
            return {...prev, [name]: value.split(',').map(s => s.trim()).filter(Boolean) };
        }
        return {...prev, [name]: value };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({...(formData as Product), id: product?.id || ''});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-2">
      <h2 className="text-xl font-bold text-primary-dark dark:text-white">{product ? 'Edit Product' : 'Add New Product'}</h2>
      <div><label className="font-medium">Name</label><Input name="name" value={formData.name} onChange={handleChange} required /></div>
      
      <div className="grid grid-cols-2 gap-4">
        <div><label className="font-medium">Price (Ksh)</label><Input name="price" type="number" value={formData.price} onChange={handleChange} required /></div>
        <div><label className="font-medium">Stock</label><Input name="stock" type="number" value={formData.stock} onChange={handleChange} required /></div>
      </div>
      
      <div>
        <label className="font-medium">Category</label>
        <select name="category" value={formData.category} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            <option value="">Select a category</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

       <div>
        <label className="font-medium">Colors</label>
        <Input name="colors" value={formData.colors.join(', ')} onChange={handleChange} placeholder="e.g. Red, Blue, Green" />
        <p className="text-xs text-gray-500 mt-1">Separate color names with a comma.</p>
       </div>

       <div>
        <label className="font-medium">Description</label>
        <Textarea name="description" value={formData.description || ''} onChange={handleChange} required rows={4} />
       </div>

       <div>
        <label className="font-medium">Image URLs</label>
        <Textarea name="imageUrls" value={formData.imageUrls.join(',\n')} onChange={handleChange} required rows={4} />
        <p className="text-xs text-gray-500 mt-1">Separate URLs with a comma. The first URL will be the main image.</p>
       </div>

      <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white dark:bg-primary-dark py-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Product</Button>
      </div>
    </form>
  )
};

const CategoryForm: React.FC<{ category: Category | null, onSave: (c: Category) => void, onCancel: () => void }> = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Category>>(category || { name: '', imageUrl: '' });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Category);
  };
  
  return (
     <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-primary-dark dark:text-white">{category ? 'Edit Category' : 'Add New Category'}</h2>
      <div><label>Name</label><Input name="name" value={formData.name} onChange={handleChange} required /></div>
      <div><label>Image URL</label><Input name="imageUrl" value={formData.imageUrl} onChange={handleChange} required /></div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Category</Button>
      </div>
    </form>
  )
};

export default InventoryPage;