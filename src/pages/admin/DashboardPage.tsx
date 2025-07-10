import React, { useState, useEffect, useMemo } from 'react';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Icons } from '../../components/icons';
import { GoogleGenAI } from "@google/genai";
import { Product, Order } from '../../data/mock-data';
import Modal from '../../components/ui/Modal';
import ProductCard from '../../components/ProductCard';
import Input from '../../components/ui/Input';
import { useData } from '../../contexts/DataContext';
import { useNotification } from '../../contexts/NotificationContext';

const AIPreviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  suggestions: Product[];
  onAccept: (suggestions: Product[]) => void;
  isLoading: boolean;
  error: string | null;
}> = ({ isOpen, onClose, suggestions, onAccept, isLoading, error }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary-dark dark:text-white">AI Product Suggestions</h2>
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Icons.RefreshCcw className="h-8 w-8 animate-spin text-accent" />
            <p className="ml-4 text-lg">Generating ideas...</p>
          </div>
        )}
        {error && !isLoading && (
          <div className="text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-md">
            <p className="font-bold">An error occurred:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && suggestions.length > 0 && (
          <>
            <p className="text-gray-600 dark:text-gray-400">Here are some new product ideas. Would you like to add them to your inventory?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-2">
              {suggestions.map((p, index) => (
                <ProductCard key={`${p.id}-${index}`} product={p} />
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button variant="accent" onClick={() => onAccept(suggestions)}>Accept Suggestions</Button>
            </div>
          </>
        )}
        {!isLoading && !error && suggestions.length === 0 && (
          <p>No suggestions were generated. Try again.</p>
        )}
      </div>
    </Modal>
  );
};

const SalesAnalyticsCard: React.FC<{orders: Order[]}> = ({ orders }) => {
    type TimeRange = 'Today' | 'This Week' | 'This Month' | 'Custom';
    const [timeRange, setTimeRange] = useState<TimeRange>('This Month');
    const [customDates, setCustomDates] = useState<{start: string, end: string}>({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const filteredOrders = useMemo(() => {
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date(now);

        switch(timeRange) {
            case 'Today':
                startDate.setHours(0,0,0,0);
                break;
            case 'This Week':
                startDate = new Date(now.setDate(now.getDate() - now.getDay()));
                startDate.setHours(0,0,0,0);
                break;
            case 'This Month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                startDate.setHours(0,0,0,0);
                break;
            case 'Custom':
                startDate = new Date(customDates.start);
                endDate = new Date(customDates.end);
                break;
        }

        return orders.filter(o => {
            const orderDate = new Date(o.date);
            return orderDate >= startDate && orderDate <= endDate && o.status === 'Delivered';
        });

    }, [orders, timeRange, customDates]);

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;

    return (
        <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <CardTitle>Sales Analytics</CardTitle>
                    <CardDescription>Track sales performance over time.</CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {(['Today', 'This Week', 'This Month'] as TimeRange[]).map(range => (
                        <Button key={range} variant={timeRange === range ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange(range)}>{range}</Button>
                    ))}
                    <Button variant={timeRange === 'Custom' ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange('Custom')}>Custom</Button>
                </div>
            </CardHeader>
            <CardContent>
                {timeRange === 'Custom' && (
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <div className="space-y-1 w-full sm:w-auto">
                            <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                            <Input type="date" id="startDate" value={customDates.start} onChange={e => setCustomDates(d => ({...d, start: e.target.value}))} />
                        </div>
                        <div className="space-y-1 w-full sm:w-auto">
                            <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
                            <Input type="date" id="endDate" value={customDates.end} onChange={e => setCustomDates(d => ({...d, end: e.target.value}))} />
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                        <p className="text-3xl font-bold">Ksh {totalRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Delivered Orders</p>
                        <p className="text-3xl font-bold">{totalOrders}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { products, categories, orders, addProducts } = useData();
  const { showToast } = useNotification();

  const handleAIRefresh = async () => {
    setIsModalOpen(true);
    setIsLoading(true);
    setError(null);
    setSuggestedProducts([]);

    if (!process.env.API_KEY) {
        setError("API_KEY environment variable not found.");
        setIsLoading(false);
        return;
    }
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const existingProductNames = products.map(p => p.name).join(', ');
      const existingCategoryNames = categories.map(c => c.name).join(', ');
      
      const prompt = `
        Based on the following list of existing smart device products: ${existingProductNames}.
        And the existing categories: ${existingCategoryNames}.
        Suggest 3 new, trendy, and exciting smart device products that would complement this store. 
        Return the response as a valid JSON array. Each object in the array must be a product with the following structure:
        { "id": "prod_aixxx", "name": "Product Name", "price": 12345, "imageUrls": ["https://picsum.photos/seed/..."], "category": "Existing Category Name", "colors": ["Color1", "Color2"], "stock": 50, "description": "A compelling product description." }
        Ensure the "price" and "stock" are numbers, and "category" is one of the existing categories.
        Generate a unique seed for each picsum.photos URL.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
      });
      
      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      
      const parsedData = JSON.parse(jsonStr);

      if (Array.isArray(parsedData)) {
          const validProducts = parsedData.filter(p => p.name && p.price && p.category && p.imageUrls && p.id);
          setSuggestedProducts(validProducts);
      } else {
          throw new Error("AI response was not a JSON array.");
      }
      
    } catch (e: any) {
      console.error("Gemini API Error:", e);
      setError(e.message || "Failed to fetch suggestions from AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestions = (suggestions: Product[]) => {
    addProducts(suggestions);
    showToast(`${suggestions.length} new products have been added!`, 'success');
    setIsModalOpen(false);
  };

  const totalRevenue = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const newOrdersToday = orders.filter(o => {
    const today = new Date().toISOString().split('T')[0];
    return o.date === today;
  }).length;


  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary-dark dark:text-white">Admin Dashboard</h1>
        
        <SalesAnalyticsCard orders={orders} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                 <CardDescription>An overview of your store's activity.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold">Ksh {totalRevenue.toLocaleString()}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{newOrdersToday} new orders today</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Products in Store</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                 </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
                    <p className="text-2xl font-bold">{categories.length}</p>
                 </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Use AI to optimize your product listings and keep your store fresh.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <p className="text-gray-600 dark:text-gray-300 flex-1">Get new product suggestions for your inventory.</p>
                  <Button onClick={handleAIRefresh} disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? <Icons.RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <Icons.Bot className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Generating...' : 'Suggest Products'}
                  </Button>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
      <AIPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        suggestions={suggestedProducts}
        onAccept={handleAcceptSuggestions}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
};

export default DashboardPage;