
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/mock-data';
import { Card, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
    product: Product;
    className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent navigation when clicking the button
        addToCart(product);
    };

    return (
        <Link to={`/product/${product.id}`} className={`group ${className}`}>
            <Card className="overflow-hidden h-full flex flex-col transition-shadow duration-300 group-hover:shadow-xl">
                <div className="overflow-hidden">
                    <img src={product.imageUrls[0]} alt={product.name} className="h-72 w-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                </div>
                <CardContent className="p-4 flex-grow">
                    <h3 className="font-semibold text-lg text-primary-dark dark:text-white group-hover:text-accent">{product.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{product.category}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4 pt-0">
                    <p className="font-bold text-xl text-primary-dark dark:text-white">Ksh {product.price.toLocaleString()}</p>
                    <Button size="sm" variant="accent" onClick={handleAddToCart}>Add</Button>
                </CardFooter>
            </Card>
        </Link>
    );
};

export default ProductCard;
