import React, { useState, useMemo, useEffect } from 'react';
import { Order, StoreSettings } from '../../data/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Icons } from '../../components/icons';
import Modal from '../../components/ui/Modal';
import { useData } from '../../contexts/DataContext';
import Textarea from '../../components/ui/Textarea';

const getStatusSelectClasses = (status: Order['status']) => {
  const base = "p-1.5 rounded-md border text-sm focus:ring-accent focus:border-accent font-medium transition-colors";
  switch (status) {
    case 'Pending':
      return `${base} bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-500/10 dark:border-yellow-500/20 dark:text-yellow-400`;
    case 'Active':
      return `${base} bg-cyan-100 border-cyan-200 text-cyan-800 dark:bg-cyan-500/10 dark:border-cyan-500/20 dark:text-cyan-400`;
    case 'Shipped':
      return `${base} bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400`;
    case 'Delivered':
      return `${base} bg-green-100 border-green-200 text-green-800 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400`;
    case 'Cancelled':
      return `${base} bg-red-100 border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400`;
    default:
      return `${base} bg-white dark:bg-gray-900/50 border-gray-300 dark:border-gray-600`;
  }
};

const getPaymentStatusClasses = (status: 'Paid' | 'Unpaid') => {
    const base = "p-1.5 rounded-md border text-sm focus:ring-accent focus:border-accent font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed";
    switch (status) {
        case 'Paid':
            return `${base} bg-green-100 border-green-200 text-green-800 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400`;
        case 'Unpaid':
            return `${base} bg-orange-100 border-orange-200 text-orange-800 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400`;
        default:
            return `${base} bg-white dark:bg-gray-900/50 border-gray-300 dark:border-gray-600`;
    }
};


const OrderShareModal: React.FC<{ order: Order, onClose: () => void, settings: StoreSettings }> = ({ order, onClose, settings }) => {
    
    const [clientMessage, setClientMessage] = useState('');
    
    useEffect(() => {
        const paymentInfo = order.paymentStatus === 'Paid'
            ? `Your payment of Ksh ${order.total.toLocaleString()} via ${order.paymentMethod} is confirmed.`
            : `Your order total is Ksh ${order.total.toLocaleString()}, to be paid upon delivery.`;

        let message = '';
        switch(order.status) {
            case 'Pending':
                message = `Hi ${order.customerName}, your ${settings.shopName} order #${order.id} has been received and is being processed. ${paymentInfo}`;
                break;
            case 'Active':
                message = `Hi ${order.customerName}, great news! Your ${settings.shopName} order #${order.id} is now active and being prepared for dispatch. ${paymentInfo}`;
                break;
            case 'Shipped':
                message = `Hi ${order.customerName}, your ${settings.shopName} order #${order.id} has been shipped! ${paymentInfo} You can track it here: https://simusmart.example.com/track/${order.id}`;
                break;
            case 'Delivered':
                message = `Hi ${order.customerName}, your ${settings.shopName} order #${order.id} has been delivered. We hope you enjoy your purchase! Thank you for shopping with ${settings.shopName}.`;
                break;
            case 'Cancelled':
                message = `Hi ${order.customerName}, regarding your ${settings.shopName} order #${order.id}, it has now been cancelled as per your request or store policy. Please contact us if you have any questions.`;
                break;
        }
        setClientMessage(message);

    }, [order, settings]);


    const riderMessageDefault = useMemo(() => {
        const paymentInstruction = order.paymentStatus === 'Unpaid'
            ? `COLLECT: Ksh ${order.total.toLocaleString()} CASH.`
            : `PAID via ${order.paymentMethod}. No collection needed.`;
            
        return `DISPATCH\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nAddress: ${order.customerAddress}\nPhone: ${order.customerPhone}\nItems: ${order.itemCount}\n\n**${paymentInstruction}**`;
    }, [order]);

    const [riderMessage, setRiderMessage] = useState(riderMessageDefault);
    
    const handleSend = (message: string, number?: string) => {
        const targetNumber = number?.replace(/\D/g, '') || '';
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${targetNumber}?text=${encodedMessage}`, '_blank');
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-primary-dark dark:text-white">Share Order #{order.id} ({order.status})</h2>
                
                <div className="space-y-2">
                    <label className="font-semibold text-gray-800 dark:text-gray-300">Message for Client</label>
                    <Textarea 
                        rows={5} 
                        value={clientMessage}
                        onChange={(e) => setClientMessage(e.target.value)}
                    />
                    <Button onClick={() => handleSend(clientMessage, order.customerPhone)} className="w-full" variant="accent">
                        <Icons.Whatsapp className="mr-2 h-4 w-4" />
                        Send to Client ({order.customerPhone}) via WhatsApp
                    </Button>
                </div>

                <div className="space-y-2">
                    <label className="font-semibold text-gray-800 dark:text-gray-300">Dispatch Details for Rider</label>
                    <Textarea 
                        rows={7} 
                        value={riderMessage}
                        onChange={(e) => setRiderMessage(e.target.value)}
                    />
                    <Button onClick={() => handleSend(riderMessage)} className="w-full">
                        <Icons.Whatsapp className="mr-2 h-4 w-4" />
                        Send to Rider via WhatsApp
                    </Button>
                </div>

                <div className="flex justify-end pt-2">
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                </div>
            </div>
        </Modal>
    );
};

const OrderDetailsModal: React.FC<{ order: Order, onClose: () => void }> = ({ order, onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose}>
        <div className="space-y-4">
        <h2 className="text-xl font-bold text-primary-dark dark:text-white">Order Details: {order.id}</h2>
        <div className="space-y-2 text-sm">
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Phone:</strong> {order.customerPhone}</p>
            <p><strong>Address:</strong> {order.customerAddress}</p>
            <p><strong>Total:</strong> Ksh {order.total.toLocaleString()} ({order.itemCount} items)</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
        </div>
        {order.paymentDetails && (
            <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-300 mt-4">Payment Confirmation Details</h3>
            <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                {order.paymentDetails}
            </pre>
            </div>
        )}
        <div className="flex justify-end pt-4">
            <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
        </div>
    </Modal>
  );
};

const OrderTable: React.FC<{
    orders: Order[],
    onStatusChange: (orderId: string, status: Order['status']) => void,
    onPaymentStatusChange: (orderId: string, status: Order['paymentStatus']) => void,
    onDetails: (order: Order) => void,
    onShare: (order: Order) => void
}> = ({ orders, onStatusChange, onPaymentStatusChange, onDetails, onShare }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Order ID</th>
                        <th scope="col" className="px-6 py-3">Customer</th>
                        <th scope="col" className="px-6 py-3 hidden md:table-cell">Date</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3 hidden sm:table-cell">Payment</th>
                        <th scope="col" className="px-6 py-3 hidden lg:table-cell">Total</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="bg-white border-b dark:bg-primary-dark dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{order.id}</td>
                            <td className="px-6 py-4">{order.customerName}</td>
                            <td className="px-6 py-4 hidden md:table-cell">{order.date}</td>
                            <td className="px-6 py-4">
                                <select value={order.status} onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])} className={getStatusSelectClasses(order.status)} aria-label={`Update status for order ${order.id}`}>
                                    <option value="Pending">Pending</option>
                                    <option value="Active">Active</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 hidden sm:table-cell">
                                <select value={order.paymentStatus} onChange={(e) => onPaymentStatusChange(order.id, e.target.value as Order['paymentStatus'])} className={getPaymentStatusClasses(order.paymentStatus)} disabled={order.paymentMethod === 'Payment on Delivery'} aria-label={`Update payment status for order ${order.id}`}>
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Paid">Paid</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 hidden lg:table-cell">Ksh {order.total.toLocaleString()}</td>
                            <td className="px-6 py-4 flex items-center space-x-1">
                                <Button variant="outline" size="sm" onClick={() => onDetails(order)}>Details</Button>
                                <Button variant="ghost" size="icon" onClick={() => onShare(order)} aria-label={`Share order ${order.id}`} className="h-9 w-9">
                                    <Icons.Whatsapp className="h-5 w-5" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {orders.length === 0 && <p className="text-center py-8 text-gray-500">No orders found.</p>}
        </div>
    );
};


const OrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderPaymentStatus, settings } = useData();
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    return orders.filter(order => order.id.toLowerCase().includes(searchQuery.toLowerCase()) || order.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [orders, searchQuery]);

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = filteredOrders.filter(o => o.date === today);
  const previousOrders = filteredOrders.filter(o => o.date !== today);


  const openShareModal = (order: Order) => {
      setSelectedOrder(order);
      setShareModalOpen(true);
  };
  
  const openDetailsModal = (order: Order) => {
      setSelectedOrder(order);
      setDetailsModalOpen(true);
  };

  const closeModal = () => {
      setShareModalOpen(false);
      setDetailsModalOpen(false);
      setSelectedOrder(null);
  };

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
  };

  const handlePaymentStatusChange = (orderId: string, status: Order['paymentStatus']) => {
    updateOrderPaymentStatus(orderId, status);
  };

  const tableProps = {
    onStatusChange: handleStatusChange,
    onPaymentStatusChange: handlePaymentStatusChange,
    onDetails: openDetailsModal,
    onShare: openShareModal,
  };


  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary-dark dark:text-white">Order Tracking</h1>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <CardTitle>Manage Orders</CardTitle>
                <div className="relative w-full md:w-auto md:max-w-xs">
                    <Input 
                        placeholder="Search by Order ID or Name..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary-dark dark:text-white">Today's Orders</h3>
              <OrderTable orders={todayOrders} {...tableProps} />
            </div>

            {previousOrders.length > 0 && (
              <div className="border-t pt-8 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-primary-dark dark:text-white">Previous Orders</h3>
                <OrderTable orders={previousOrders} {...tableProps} />
              </div>
            )}
             {filteredOrders.length === 0 && (
                <p className="text-center py-8 text-gray-500">No orders found matching your search.</p>
              )}
          </CardContent>
        </Card>
      </div>

      {isDetailsModalOpen && selectedOrder && (
          <OrderDetailsModal order={selectedOrder} onClose={closeModal} />
      )}

      {isShareModalOpen && selectedOrder && (
          <OrderShareModal order={selectedOrder} onClose={closeModal} settings={settings} />
      )}
    </>
  );
};

export default OrdersPage;