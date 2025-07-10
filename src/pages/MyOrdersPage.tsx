
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Order } from '../data/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Icons } from '../components/icons';
import Input from '../components/ui/Input';

const OrderStatusProgress: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const statuses: Array<Order['status']> = ['Pending', 'Active', 'Shipped', 'Delivered'];
    const currentIndex = statuses.indexOf(status);
    const isCancelled = status === 'Cancelled';

    if (isCancelled) {
        return (
            <div className="flex items-center gap-2 mt-4 text-red-500">
                <Icons.X className="h-5 w-5" />
                <p className="font-semibold">Order Cancelled</p>
            </div>
        )
    }

    return (
        <div className="w-full pt-4">
            <div className="flex justify-between">
                {statuses.map((s, index) => (
                    <div key={s} className="flex flex-col items-center flex-1 text-center">
                        <div className={`h-4 w-4 rounded-full ${index <= currentIndex ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <p className={`mt-2 text-xs font-medium ${index <= currentIndex ? 'text-primary-dark dark:text-white' : 'text-gray-400'}`}>{s}</p>
                    </div>
                ))}
            </div>
            <div className="relative h-1 bg-gray-300 dark:bg-gray-600 rounded-full -mt-5" style={{zIndex: -1}}>
                <div 
                    className="absolute top-0 left-0 h-1 bg-accent rounded-full transition-all duration-500" 
                    style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

export const MyOrdersPage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const { orders } = useData();

    if (!isAuthenticated || !user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <Icons.LogIn className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600" />
                <h1 className="mt-6 text-3xl font-bold text-primary-dark dark:text-white">Access Denied</h1>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Please log in to view your order history.</p>
                <Button asChild size="lg" variant="accent" className="mt-8">
                    <Link to="/login">Login</Link>
                </Button>
            </div>
        );
    }
    
    const myOrders = orders.filter(o => o.customerName === user.name);

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-dark dark:text-white">My Orders</h1>
                 <div className="relative w-full sm:w-auto sm:max-w-xs">
                    <Input placeholder="Track by Order ID..." className="pl-10"/>
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                </div>
            </div>

            {myOrders.length === 0 ? (
                 <div className="text-center py-20 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <Icons.Package className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600" />
                    <h2 className="mt-6 text-2xl font-semibold text-primary-dark dark:text-white">No Orders Found</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">You haven't placed any orders yet.</p>
                    <Button asChild size="lg" variant="accent" className="mt-8">
                        <Link to="/home">Start Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {myOrders.map(order => (
                        <Card key={order.id}>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                                    <div>
                                        <CardTitle>Order #{order.id}</CardTitle>
                                        <CardDescription>Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                                    </div>
                                    <p className="mt-2 sm:mt-0"><strong>Total: Ksh {order.total.toLocaleString()}</strong></p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <OrderStatusProgress status={order.status} />
                            </CardContent>
                            <CardFooter className="text-sm text-gray-500 dark:text-gray-400">
                                <p>This order will be delivered to: {order.customerAddress}</p>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
