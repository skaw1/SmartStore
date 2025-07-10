
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icons } from './icons';
import Button from './ui/Button';
import Input from './ui/Input';
import ThemeToggleButton from './ThemeToggleButton';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const UserMenu: React.FC<{onClose?: () => void}> = ({onClose}) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleActionClick = (path: string) => {
        setIsOpen(false);
        if (onClose) onClose();
        navigate(path);
    }

    const handleLogout = () => {
        if (onClose) onClose();
        logout();
        navigate('/home');
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} className="w-full justify-start md:w-auto md:justify-center">
                <Icons.User className="h-5 w-5 mr-2" />
                Hi, {user.name.split(' ')[0]}
            </Button>
            {isOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-primary-dark rounded-md shadow-lg py-1 border dark:border-gray-700 z-10">
                    <button onClick={() => handleActionClick('/profile')} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Icons.User className="mr-2 h-4 w-4" />
                        My Profile
                    </button>
                    <button onClick={() => handleActionClick('/my-orders')} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Icons.ListOrdered className="mr-2 h-4 w-4" />
                        My Orders
                    </button>
                    <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Icons.LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};


const Header: React.FC = () => {
    const { cartItems, cartCount } = useCart();
    const { isAuthenticated, isAdmin } = useAuth();
    const { settings } = useData();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false);
        }
    };

    const handleWhatsAppInquiry = () => {
        setIsMobileMenuOpen(false);
        if (cartItems.length === 0) {
            alert("Your cart is empty. Add some products to inquire about them.");
            return;
        }
        const productLines = cartItems.map(item => `- ${item.product.name} (Quantity: ${item.quantity})`).join('\n');
        const message = `Hello ${settings.shopName}! I'm interested in the following products:\n\n${productLines}\n\nCould you please provide more information?`;
        
        const phoneNumber = settings.whatsappNumber.replace(/\D/g, '');
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-primary-dark/80 dark:border-gray-800">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/home" className="flex items-center gap-2 mr-2">
                    {settings.logoUrl ? (
                        <img src={settings.logoUrl} alt={`${settings.shopName} logo`} className="h-8 w-auto" />
                    ) : (
                        <Icons.Store className="h-6 w-6 text-primary-dark dark:text-white" />
                    )}
                    <span className="font-bold text-lg text-primary-dark dark:text-white hidden sm:inline">{settings.shopName}</span>
                </Link>
                <div className="flex-1 px-8 hidden lg:block lg:px-20">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <Input
                            type="search"
                            placeholder="Semantic Search for products..."
                            className="w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <ThemeToggleButton />
                    {isAdmin && (
                         <Button asChild variant="outline" size="sm">
                            <Link to="/admin/dashboard">Admin Panel</Link>
                        </Button>
                    )}
                    <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-primary-dark dark:text-gray-300 dark:hover:text-white">
                        Contact
                    </Link>

                     <Button variant="ghost" onClick={handleWhatsAppInquiry} size="sm">
                        <Icons.Whatsapp className="h-4 w-4 mr-2" />
                        Ask on WhatsApp
                    </Button>

                    {isAuthenticated ? (
                        <UserMenu />
                    ) : (
                        <Button asChild variant="ghost" size="sm">
                           <Link to="/login">Login</Link>
                        </Button>
                    )}
                    <Button asChild variant="accent" size="sm" className="relative">
                        <Link to="/cart">
                            <Icons.ShoppingCart className="mr-2 h-4 w-4" />
                            My Cart
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </Button>
                </div>
                 <div className="flex items-center md:hidden">
                    <ThemeToggleButton />
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Toggle menu"
                    >
                        <Icons.Menu className="h-6 w-6"/>
                    </button>
                 </div>
            </div>
            {isMobileMenuOpen && (
                 <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 border-t dark:border-gray-800">
                        <form onSubmit={handleSearchSubmit} className="relative px-2 pb-2">
                             <Input
                                type="search"
                                placeholder="Search for products..."
                                className="w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                        
                        <Button asChild variant="accent" className="relative w-full justify-start">
                            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                                <Icons.ShoppingCart className="mr-2 h-4 w-4" />
                                My Cart
                                {cartCount > 0 && (
                                    <span className="absolute top-1/2 -translate-y-1/2 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </Button>

                         {isAuthenticated ? (
                            <UserMenu onClose={() => setIsMobileMenuOpen(false)} />
                        ) : (
                            <Button asChild variant="ghost" className="w-full justify-start">
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login / Sign Up</Link>
                            </Button>
                        )}
                        
                        <Button asChild variant="ghost" className="w-full justify-start">
                            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                        </Button>
                        <Button variant="ghost" onClick={handleWhatsAppInquiry} className="w-full justify-start">
                            <Icons.Whatsapp className="h-4 w-4 mr-2" />
                            Ask on WhatsApp
                        </Button>
                         {isAdmin && (
                            <Button asChild variant="outline" className="w-full justify-start">
                                <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>
                            </Button>
                        )}
                    </div>
                 </div>
            )}
        </header>
    );
};

export default Header;
