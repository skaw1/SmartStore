
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Icons } from '../components/icons';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import StarRating from '../components/StarRating';
import { useNotification } from '../contexts/NotificationContext';
import Textarea from '../components/ui/Textarea';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const { products, reviews, addReview, settings } = useData();
    const { addToCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const { showToast } = useNotification();
    
    const product = products.find(p => p.id === productId);
    const productReviews = reviews.filter(r => r.productId === productId && r.status === 'Approved');

    const [mainImage, setMainImage] = useState(product?.imageUrls[0] || '');
    const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
    const [newReviewRating, setNewReviewRating] = useState(0);
    const [newReviewComment, setNewReviewComment] = useState('');
    const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

    const averageRating = useMemo(() => {
        if (!productReviews || productReviews.length === 0) return 0;
        const total = productReviews.reduce((acc, review) => acc + review.rating, 0);
        return total / productReviews.length;
    }, [productReviews]);

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <Icons.Package className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600" />
                <h1 className="mt-6 text-3xl font-bold text-primary-dark dark:text-white">Product Not Found</h1>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Sorry, we couldn't find the product you're looking for.</p>
                <Button asChild size="lg" variant="accent" className="mt-8">
                    <Link to="/home">Go Back Home</Link>
                </Button>
            </div>
        );
    }

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newReviewRating > 0 && newReviewComment.trim() && user) {
            addReview({
                productId: product.id,
                customerName: user.name,
                rating: newReviewRating,
                comment: newReviewComment,
            });
            setIsReviewSubmitted(true);
            setNewReviewComment('');
            setNewReviewRating(0);
            showToast('Review submitted for approval!', 'success');
        } else {
            showToast('Please provide a rating and a comment.', 'error');
        }
    };
    
    // JSON-LD for Google Rich Snippets
    const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.imageUrls,
      "description": product.description,
      "sku": product.id,
      "brand": {
        "@type": "Brand",
        "name": settings.shopName
      },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "KES",
        "price": product.price,
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition"
      },
      ...(productReviews.length > 0 && {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": averageRating.toFixed(1),
          "reviewCount": productReviews.length
        },
        "review": productReviews.map(review => ({
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": review.rating
          },
          "author": {
            "@type": "Person",
            "name": review.customerName
          }
        }))
      })
    };


    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div>
                    <div className="aspect-square w-full overflow-hidden rounded-lg border dark:border-gray-700 mb-4">
                        <img src={mainImage} alt={product.name} className="h-full w-full object-cover transition-opacity duration-300" />
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {product.imageUrls.map((url, index) => (
                            <button key={index} onClick={() => setMainImage(url)} className={`aspect-square w-full rounded-md overflow-hidden border-2 transition-transform hover:scale-105 ${mainImage === url ? 'border-accent' : 'border-transparent'}`}>
                                <img src={url} alt={`${product.name} thumbnail ${index + 1}`} className="h-full w-full object-cover"/>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-dark dark:text-white">{product.name}</h1>
                    
                    <div className="flex items-center gap-4">
                       <StarRating rating={averageRating} size="md"/>
                       <a href="#reviews" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">{productReviews.length} reviews</a>
                    </div>

                    <p className="text-3xl font-bold text-primary-dark dark:text-white">Ksh {product.price.toLocaleString()}</p>
                    
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
                    
                    {product.colors.length > 0 && (
                        <div className="space-y-2">
                            <label className="font-semibold text-sm">Color: <span className="font-normal">{selectedColor}</span></label>
                            <div className="flex items-center gap-2">
                                {product.colors.map(color => (
                                    <button 
                                        key={color} 
                                        onClick={() => setSelectedColor(color)}
                                        className={`h-8 w-8 rounded-full border-2 transition-transform duration-200 ${selectedColor === color ? 'border-accent scale-110' : 'border-gray-300'}`}
                                        style={{ backgroundColor: color.toLowerCase().replace(' ', '') }}
                                        aria-label={`Select color ${color}`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        {product.stock > 0 ? (
                           <div className="flex items-center gap-8">
                                <Button size="lg" variant="accent" onClick={() => addToCart(product)}>
                                    <Icons.ShoppingCart className="mr-2 h-5 w-5"/> Add to Cart
                                </Button>
                                <p className={`font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                                    {product.stock < 10 ? `Only ${product.stock} left!` : 'In Stock'}
                                </p>
                           </div>
                        ) : (
                            <p className="font-bold text-red-500">Out of Stock</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div id="reviews" className="mt-16 pt-10 border-t dark:border-gray-700">
                <h2 className="text-3xl font-bold text-primary-dark dark:text-white mb-8">Customer Reviews</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {productReviews.length > 0 ? (
                            productReviews.map(review => (
                                <Card key={review.id} className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <Icons.User className="h-6 w-6 text-gray-500"/>
                                            </div>
                                            <div>
                                                <p className="font-semibold">{review.customerName}</p>
                                                <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <StarRating rating={review.rating} size="sm" />
                                    </div>
                                    <p className="mt-4 text-gray-600 dark:text-gray-300">{review.comment}</p>
                                </Card>
                            ))
                        ) : (
                            <p>No reviews yet. Be the first to review this product!</p>
                        )}
                    </div>
                    <div>
                        <Card className="sticky top-24 p-6">
                            <CardTitle>Write a Review</CardTitle>
                            <CardDescription className="mt-1">Share your thoughts with other customers</CardDescription>
                            {isAuthenticated ? (
                                isReviewSubmitted ? (
                                    <div className="mt-4 text-center p-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                        <p className="font-semibold text-green-700 dark:text-green-300">Thank you!</p>
                                        <p className="text-sm text-green-600 dark:text-green-400">Your review is pending approval.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
                                        <div>
                                            <label className="font-semibold">Your Rating</label>
                                            <StarRating rating={newReviewRating} setRating={setNewReviewRating} size="lg" className="mt-1"/>
                                        </div>
                                        <div>
                                            <label htmlFor="comment" className="font-semibold">Your Review</label>
                                            <Textarea id="comment" value={newReviewComment} onChange={e => setNewReviewComment(e.target.value)} rows={4} required placeholder="What did you like or dislike?"/>
                                        </div>
                                        <Button type="submit" className="w-full">Submit Review</Button>
                                    </form>
                                )
                            ) : (
                                <div className="mt-4 text-center p-4 border-2 border-dashed dark:border-gray-700 rounded-lg">
                                    <p className="text-gray-600 dark:text-gray-400">You must be logged in to write a review.</p>
                                    <Button asChild variant="link" className="mt-2">
                                        <Link to={`/login?redirect=/product/${product.id}`}>Login to continue</Link>
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
