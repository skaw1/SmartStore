import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Icons } from '../../components/icons';
import StarRating from '../../components/StarRating';
import { Review } from '../../data/mock-data';

const ReviewsPage: React.FC = () => {
    const { reviews, products, updateReviewStatus } = useData();

    const pendingReviews = reviews.filter(r => r.status === 'Pending');
    const processedReviews = reviews.filter(r => r.status !== 'Pending');

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-primary-dark dark:text-white">Review Management</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Pending Reviews</CardTitle>
                    <CardDescription>Approve or reject new customer reviews here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pendingReviews.length > 0 ? (
                        pendingReviews.map(review => {
                            const product = products.find(p => p.id === review.productId);
                            return (
                                <Card key={review.id} className="p-4 bg-gray-50 dark:bg-gray-900/50">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <p className="font-semibold">{review.customerName} on <span className="text-accent">{product?.name || 'Unknown Product'}</span></p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{review.comment}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            <StarRating rating={review.rating} />
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="text-red-500 border-red-500 hover:bg-red-50" onClick={() => updateReviewStatus(review.id, 'Rejected')}>
                                                    <Icons.Reject className="h-4 w-4 mr-2"/> Reject
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => updateReviewStatus(review.id, 'Approved')}>
                                                    <Icons.Approve className="h-4 w-4 mr-2"/> Approve
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    ) : (
                        <p className="text-center py-8 text-gray-500">No pending reviews.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Processed Reviews</CardTitle>
                    <CardDescription>A log of all previously moderated reviews.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                <th scope="col" className="px-6 py-3">Product</th>
                                <th scope="col" className="px-6 py-3">Customer</th>
                                <th scope="col" className="px-6 py-3">Rating</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedReviews.map(review => {
                                     const product = products.find(p => p.id === review.productId);
                                     return (
                                        <tr key={review.id} className="bg-white border-b dark:bg-primary-dark dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{product?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">{review.customerName}</td>
                                            <td className="px-6 py-4"><StarRating rating={review.rating} size="sm" /></td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${review.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/80 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-300'}`}>
                                                    {review.status}
                                                </span>
                                            </td>
                                        </tr>
                                     )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReviewsPage;