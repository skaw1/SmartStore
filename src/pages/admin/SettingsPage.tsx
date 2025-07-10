
import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { StoreSettings, SocialLink, QuickLink, PaymentMethod } from '../../data/mock-data';
import { Icons } from '../../components/icons';
import Modal from '../../components/ui/Modal';
import { useData } from '../../contexts/DataContext';
import { useNotification } from '../../contexts/NotificationContext';

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

const HeroPreview: React.FC<{ settings: StoreSettings }> = ({ settings }) => {
    const heroStyle = settings.heroImageUrl
        ? { backgroundImage: `url('${settings.heroImageUrl}')` }
        : {};

    const heroClasses = settings.heroImageUrl
        ? 'bg-cover bg-center'
        : 'bg-gradient-to-br from-gray-900 via-primary-dark to-gray-800';

    return (
        <div className="mt-8 rounded-lg overflow-hidden border dark:border-gray-700">
            <h4 className="text-sm font-semibold p-3 bg-gray-100 dark:bg-gray-900/50 border-b dark:border-gray-700 text-primary-dark dark:text-gray-300">Live Preview</h4>
            <section
                className={`w-full text-white relative ${heroClasses}`}
                style={heroStyle}
            >
                <div className="flex flex-col items-center justify-center p-10 text-center bg-black/40 backdrop-blur-sm min-h-[200px]">
                    <h1
                        className="text-2xl font-bold tracking-tight"
                        style={{ color: settings.heroTextColor }}
                    >
                        {settings.heroTitle}
                    </h1>
                    <p
                        className="mt-2 max-w-md text-sm"
                        style={{ color: settings.heroTextColor, opacity: 0.9 }}
                    >
                        {settings.heroSubtitle}
                    </p>
                    <Button size="sm" variant="accent" className="mt-6" disabled>
                        Explore Now
                    </Button>
                </div>
            </section>
        </div>
    );
};

const BrandingPreview: React.FC<{ settings: StoreSettings }> = ({ settings }) => {
    const previewStyle = {
        '--color-accent': settings.accentColor,
        '--color-accent-text': settings.accentTextColor,
    } as React.CSSProperties;

    return (
        <div style={previewStyle}>
            <h4 className="text-sm font-semibold mb-2 text-primary-dark dark:text-gray-300">Live Preview</h4>
            <div className="rounded-lg border dark:border-gray-700 p-4 space-y-4 bg-gray-50 dark:bg-gray-900/30">
                <div className="flex flex-wrap items-center gap-4">
                    <Button variant="accent">Accent Button</Button>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-sm font-medium text-accent hover:underline">
                        An Accent Link
                    </a>
                </div>
                <div>
                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input Field</label>
                     <Input placeholder="Focus to see accent color" />
                </div>
            </div>
        </div>
    );
};


const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useData();
  const { showToast } = useNotification();
  const [localSettings, setLocalSettings] = useState<StoreSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'social' | 'quickLink' | 'paymentMethod' | null>(null);
  const [currentItem, setCurrentItem] = useState<SocialLink | QuickLink | PaymentMethod | null>(null);
  
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', description: '', onConfirm: () => {} });

  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(localSettings));
  }, [settings, localSettings]);

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLocalSettings(prev => ({...prev, [id]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLocalSettings(prev => ({ ...prev, logoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateSettings(localSettings);
    showToast('Settings saved successfully!', 'success');
  };

  const openModal = (type: 'social' | 'quickLink' | 'paymentMethod', item: SocialLink | QuickLink | PaymentMethod | null = null) => {
    setModalType(type);
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setCurrentItem(null);
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const handleItemSave = (
    type: 'social' | 'quickLink' | 'paymentMethod',
    itemData: SocialLink | QuickLink | PaymentMethod
  ) => {
    const listName = `${type}s` as 'socials' | 'quickLinks' | 'paymentMethods';
    const list = localSettings[listName] as any[];

    if (itemData.id) { // Editing existing item
      setLocalSettings(prev => ({ ...prev, [listName]: list.map(item => item.id === itemData.id ? itemData : item) }));
    } else { // Adding new item
      const newItem = { ...itemData, id: `${type.slice(0, 3)}${Date.now()}` };
      setLocalSettings(prev => ({ ...prev, [listName]: [...list, newItem] }));
    }
    closeModal();
  };

  const handleRemoveRequest = (type: 'social' | 'quickLink' | 'paymentMethod', item: {id: string; name?: string; text?: string}) => {
    const listName = `${type}s` as 'socials' | 'quickLinks' | 'paymentMethods';
    const itemName = item.name || item.text || 'item';
    
    setConfirmModal({
        isOpen: true,
        title: `Remove ${itemName}`,
        description: `Are you sure you want to remove this ${type}? This change will be saved when you click "Save All Changes".`,
        onConfirm: () => {
            const list = localSettings[listName] as any[];
            setLocalSettings(prev => ({...prev, [listName]: list.filter(s => s.id !== item.id)}));
            closeModal();
        }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark dark:text-white">Store Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your store's appearance and details.</p>
        </div>
        <Button onClick={handleSave} disabled={!hasChanges}>
            {hasChanges ? 'Save All Changes' : 'All Changes Saved'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>Update your shop's public details and contact info.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="shopName" className="font-medium text-gray-800 dark:text-gray-300">Shop Name</label>
              <Input id="shopName" value={localSettings.shopName} onChange={handleGeneralChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="contactEmail" className="font-medium text-gray-800 dark:text-gray-300">Contact Email</label>
              <Input id="contactEmail" type="email" value={localSettings.contactEmail} onChange={handleGeneralChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="font-medium text-gray-800 dark:text-gray-300">Location / Address</label>
              <Input id="location" value={localSettings.location} onChange={handleGeneralChange} />
            </div>
             <div className="space-y-2">
              <label htmlFor="whatsappNumber" className="font-medium text-gray-800 dark:text-gray-300">WhatsApp Number</label>
              <Input id="whatsappNumber" placeholder="+254712345678" value={localSettings.whatsappNumber} onChange={handleGeneralChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Store Branding</CardTitle>
            <CardDescription>Customize your store's logo and theme color.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <label className="font-medium text-gray-800 dark:text-gray-300">Store Logo</label>
                <div className="flex items-center gap-4">
                    {localSettings.logoUrl && (
                        <img src={localSettings.logoUrl} alt="Logo Preview" className="h-16 w-16 rounded-md object-contain bg-gray-100 dark:bg-gray-800 p-1" />
                    )}
                    <div className="flex-grow space-y-2">
                        <Input id="logoUrl" value={localSettings.logoUrl} onChange={handleGeneralChange} placeholder="Enter image URL" />
                        <div>
                            <label htmlFor="logoUpload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary-dark text-white hover:bg-primary-dark/90 dark:bg-gray-200 dark:text-primary-dark dark:hover:bg-gray-200/90">
                                <Icons.Upload className="mr-2 h-4 w-4" /> Upload Logo
                            </label>
                            <input id="logoUpload" type="file" className="hidden" accept="image/png, image/jpeg, image/svg+xml" onChange={handleImageUpload} />
                        </div>
                    </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Upload a logo or paste an image URL. Recommended size: 256x256px.</p>
            </div>
            <div className="space-y-2">
                <label htmlFor="accentColor" className="font-medium text-gray-800 dark:text-gray-300">Accent Color</label>
                <div className="flex items-center gap-2">
                    <Input id="accentColor" type="color" value={localSettings.accentColor} onChange={handleGeneralChange} className="w-16 h-10 p-1" />
                    <Input type="text" value={localSettings.accentColor} onChange={handleGeneralChange} id="accentColor" className="w-28" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">This color will be used for buttons, links, and highlights across the store.</p>
            </div>
            <div className="space-y-2">
                <label htmlFor="accentTextColor" className="font-medium text-gray-800 dark:text-gray-300">Accent Text Color</label>
                <div className="flex items-center gap-2">
                    <Input id="accentTextColor" type="color" value={localSettings.accentTextColor} onChange={handleGeneralChange} className="w-16 h-10 p-1" />
                    <Input type="text" value={localSettings.accentTextColor} onChange={handleGeneralChange} id="accentTextColor" className="w-28" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">This color will be used for text on accent-colored elements for better visibility.</p>
            </div>
            <BrandingPreview settings={localSettings} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Hero Section Customization</CardTitle>
          <CardDescription>Control the appearance of the main banner on your homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
              <label htmlFor="heroTitle" className="font-medium text-gray-800 dark:text-gray-300">Hero Title</label>
              <Input id="heroTitle" value={localSettings.heroTitle} onChange={handleGeneralChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="heroSubtitle" className="font-medium text-gray-800 dark:text-gray-300">Hero Subtitle</label>
              <Input id="heroSubtitle" value={localSettings.heroSubtitle} onChange={handleGeneralChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="heroImageUrl" className="font-medium text-gray-800 dark:text-gray-300">Background Image URL</label>
              <Input id="heroImageUrl" placeholder="https://example.com/image.png" value={localSettings.heroImageUrl} onChange={handleGeneralChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="heroTextColor" className="font-medium text-gray-800 dark:text-gray-300">Text Color</label>
              <div className="flex items-center gap-2">
                <Input id="heroTextColor" type="color" value={localSettings.heroTextColor} onChange={handleGeneralChange} className="w-16 h-10 p-1" />
                <Input type="text" value={localSettings.heroTextColor} onChange={handleGeneralChange} id="heroTextColor" className="w-28" />
              </div>
            </div>
            <HeroPreview settings={localSettings} />
        </CardContent>
      </Card>

      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Add links to your social media profiles.</CardDescription>
              </div>
              <Button onClick={() => openModal('social')}><Icons.PlusCircle className="mr-2 h-4 w-4" /> Add Social</Button>
          </CardHeader>
          <CardContent>
              <CrudTable 
                items={localSettings.socials}
                onEdit={(item) => openModal('social', item as SocialLink)}
                onDelete={(item) => handleRemoveRequest('social', item)}
                columns={[
                    { key: 'icon', header: 'Icon', render: (item) => { const Icon = Icons[(item as SocialLink).icon]; return <Icon className="h-5 w-5" />; }},
                    { key: 'name', header: 'Name' },
                    { key: 'url', header: 'URL' },
                ]}
              />
          </CardContent>
      </Card>
      
       <Card>
          <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Footer Quick Links</CardTitle>
                <CardDescription>Manage the links that appear in your store's footer.</CardDescription>
              </div>
              <Button onClick={() => openModal('quickLink')}><Icons.PlusCircle className="mr-2 h-4 w-4" /> Add Link</Button>
          </CardHeader>
          <CardContent>
              <CrudTable 
                items={localSettings.quickLinks}
                onEdit={(item) => openModal('quickLink', item as QuickLink)}
                onDelete={(item) => handleRemoveRequest('quickLink', item)}
                columns={[
                    { key: 'text', header: 'Link Text' },
                    { key: 'url', header: 'URL' },
                ]}
              />
          </CardContent>
      </Card>

      <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage the payment options available at checkout.</CardDescription>
                </div>
                <Button onClick={() => openModal('paymentMethod')}><Icons.PlusCircle className="mr-2 h-4 w-4" /> Add Method</Button>
            </CardHeader>
            <CardContent>
                <CrudTable 
                    items={localSettings.paymentMethods || []}
                    onEdit={(item) => openModal('paymentMethod', item as PaymentMethod)}
                    onDelete={(item) => handleRemoveRequest('paymentMethod', item)}
                    columns={[
                        { key: 'logo', header: 'Logo', render: (item) => <img src={(item as PaymentMethod).logoUrl} alt={(item as PaymentMethod).name} className="h-8 bg-white p-1 rounded-md object-contain"/> },
                        { key: 'name', header: 'Name' },
                        { key: 'details', header: 'Details' },
                    ]}
                />
            </CardContent>
        </Card>

      <ConfirmationModal {...confirmModal} onClose={closeModal} />
      
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {modalType === 'social' && <SocialForm social={currentItem as SocialLink | null} onSave={(data) => handleItemSave('social', data)} onCancel={closeModal} />}
          {modalType === 'quickLink' && <QuickLinkForm link={currentItem as QuickLink | null} onSave={(data) => handleItemSave('quickLink', data)} onCancel={closeModal} />}
          {modalType === 'paymentMethod' && <PaymentMethodForm method={currentItem as PaymentMethod | null} onSave={(data) => handleItemSave('paymentMethod', data)} onCancel={closeModal} />}
        </Modal>
      )}

    </div>
  );
};

// Generic table for CRUD operations
const CrudTable: React.FC<{ items: any[], onEdit: (item: any) => void, onDelete: (item: any) => void, columns: {key: string, header: string, render?: (item: any) => React.ReactNode}[] }> = ({ items, onEdit, onDelete, columns }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    {columns.map(c => <th key={c.key} scope="col" className="px-6 py-3">{c.header}</th>)}
                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr key={item.id} className="bg-white border-b dark:bg-primary-dark dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        {columns.map(c => (
                            <td key={c.key} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {c.render ? c.render(item) : item[c.key]}
                            </td>
                        ))}
                        <td className="px-6 py-4 text-right space-x-2">
                            <Button size="icon" variant="ghost" onClick={() => onEdit(item)}><Icons.Edit className="h-4 w-4" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => onDelete(item)}><Icons.Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// Form for Social Links Modal
const SocialForm: React.FC<{ social: SocialLink | null, onSave: (s: SocialLink) => void, onCancel: () => void }> = ({ social, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<SocialLink>>(social || { name: '', url: '', icon: 'Twitter' });
  const availableIcons = ['Twitter', 'Facebook', 'Instagram', 'Linkedin', 'Youtube'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value as any }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as SocialLink);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 dark:text-gray-300">
      <h2 className="text-xl font-bold text-primary-dark dark:text-white">{social ? 'Edit Social Link' : 'Add New Social Link'}</h2>
      <div><label>Name</label><Input name="name" value={formData.name} onChange={handleChange} required /></div>
      <div><label>URL</label><Input name="url" type="url" value={formData.url} onChange={handleChange} required /></div>
      <div>
        <label>Icon</label>
        <select name="icon" value={formData.icon} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            {availableIcons.map(iconName => <option key={iconName} value={iconName}>{iconName}</option>)}
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Link</Button>
      </div>
    </form>
  );
};

// Form for Quick Links Modal
const QuickLinkForm: React.FC<{ link: QuickLink | null, onSave: (l: QuickLink) => void, onCancel: () => void }> = ({ link, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<QuickLink>>(link || { text: '', url: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as QuickLink);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 dark:text-gray-300">
      <h2 className="text-xl font-bold text-primary-dark dark:text-white">{link ? 'Edit Quick Link' : 'Add New Quick Link'}</h2>
      <div><label>Link Text</label><Input name="text" value={formData.text} onChange={handleChange} required /></div>
      <div><label>URL</label><Input name="url" value={formData.url} onChange={handleChange} required /></div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Link</Button>
      </div>
    </form>
  );
};

// Form for Payment Methods Modal
const PaymentMethodForm: React.FC<{ method: PaymentMethod | null, onSave: (m: PaymentMethod) => void, onCancel: () => void }> = ({ method, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<PaymentMethod>>(method || { name: '', details: '', logoUrl: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as PaymentMethod);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 dark:text-gray-300">
      <h2 className="text-xl font-bold text-primary-dark dark:text-white">{method ? 'Edit Payment Method' : 'Add New Payment Method'}</h2>
      <div><label>Name (e.g., M-Pesa, Visa)</label><Input name="name" value={formData.name} onChange={handleChange} required /></div>
      <div><label>Details (e.g., Paybill: 123456)</label><Input name="details" value={formData.details} onChange={handleChange} required /></div>
      <div><label>Logo URL (.png preferred)</label><Input name="logoUrl" type="url" value={formData.logoUrl} onChange={handleChange} required /></div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Method</Button>
      </div>
    </form>
  );
};

export default SettingsPage;