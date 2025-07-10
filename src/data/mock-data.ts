
import { Icons } from '../components/icons';

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name:string;
  price: number;
  imageUrls: string[];
  category: string;
  colors: string[];
  stock: number;
  description: string;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  status: 'Pending' | 'Active' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  itemCount: number;
  items: { productId: string; quantity: number; }[];
  customerAddress: string;
  customerPhone: string;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Unpaid';
  paymentDetails?: string;
  stockDeducted: boolean;
}

export interface Review {
    id: string;
    productId: string;
    customerName: string;
    rating: number; // 1-5
    comment: string;
    date: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}


export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: keyof typeof Icons;
}

export interface QuickLink {
  id: string;
  text: string;
  url: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  details: string; 
  logoUrl: string;
}

export interface StoreSettings {
  shopName: string;
  logoUrl: string;
  contactEmail: string;
  location: string;
  socials: SocialLink[];
  quickLinks: QuickLink[];
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroTextColor: string;
  paymentMethods: PaymentMethod[];
  whatsappNumber: string;
  accentColor: string;
  accentTextColor: string;
}


export const CATEGORIES_DATA: Category[] = [
  { id: 'smartphones', name: 'Smartphones', imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=800&auto=format&fit=crop' },
  { id: 'laptops', name: 'Laptops', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop' },
  { id: 'watches', name: 'Watches', imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop' },
  { id: 'audio', name: 'Audio', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop' },
  { id: 'cameras', name: 'Cameras', imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop' },
  { id: 'accessories', name: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1555774698-0b77e0abfe3d?q=80&w=800&auto=format&fit=crop' },
];

export let PRODUCTS_DATA: Product[] = [
  { id: 'prod1', name: 'AuraPhone X', price: 139999, imageUrls: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbf1?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop'], category: 'Smartphones', colors: ['Graphite', 'Silver', 'Gold'], stock: 15, description: "Experience the future with the AuraPhone X, featuring a stunning edge-to-edge display, a revolutionary camera system, and all-day battery life." },
  { id: 'prod2', name: 'Zenith Laptop Pro', price: 250000, imageUrls: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800&auto=format&fit=crop'], category: 'Laptops', colors: ['Space Gray', 'Silver'], stock: 8, description: "Unleash your creativity with the Zenith Laptop Pro. A powerful processor and a vibrant retina display make it the ultimate tool for professionals." },
  { id: 'prod3', name: 'ChronoWatch 2', price: 45000, imageUrls: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1579586337278-35d9addb018d?q=80&w=800&auto=format&fit=crop'], category: 'Watches', colors: ['Midnight', 'Starlight', 'Red'], stock: 30, description: "Stay connected and track your fitness with the elegant ChronoWatch 2. Packed with features to help you live a healthier life." },
  { id: 'prod4', name: 'EchoBuds Pro', price: 24999, imageUrls: ['https://images.unsplash.com/photo-1606791422814-b32c70505d99?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1610438235354-a6ae55addb88?q=80&w=800&auto=format&fit=crop'], category: 'Audio', colors: ['White', 'Black'], stock: 50, description: "Immerse yourself in rich, high-fidelity sound with EchoBuds Pro. Active Noise Cancellation for immersive sound. Transparency mode for hearing what’s happening around you." },
  { id: 'prod5', name: 'VisionCam 4K', price: 89999, imageUrls: ['https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop'], category: 'Cameras', colors: ['Black'], stock: 12, description: "Capture your life's moments in stunning 4K with the VisionCam. Its compact design and easy-to-use interface make it perfect for creators." },
  { id: 'prod6', name: 'PowerBank Ultra', price: 8900, imageUrls: ['https://images.unsplash.com/photo-1588852109267-39382e7b8a7f?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1611029438294-9a88863f03b2?q=80&w=800&auto=format&fit=crop'], category: 'Accessories', colors: ['Black', 'White'], stock: 100, description: "Never run out of power again. The PowerBank Ultra provides multiple charges for all your devices in a slim, portable package." },
  { id: 'prod7', name: 'NovaPhone 12', price: 99999, imageUrls: ['https://images.unsplash.com/photo-1695424726965-98336e8b46a1?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1695026212139-3178a220c444?q=80&w=800&auto=format&fit=crop'], category: 'Smartphones', colors: ['Pacific Blue', 'White', 'Black'], stock: 22, description: "The NovaPhone 12 pushes the boundaries of innovation with its powerful A16 Bionic chip and Pro camera system." },
  { id: 'prod8', name: 'AirBook Slim', price: 165000, imageUrls: ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1587614203976-365c7d6297d8?q=80&w=800&auto=format&fit=crop'], category: 'Laptops', colors: ['Gold', 'Silver'], stock: 5, description: "Incredibly thin and light, the AirBook Slim is your perfect companion for work and play on the go. Now with the M2 chip." },
];

export const ORDERS_DATA: Order[] = [
  { id: 'ORD001', customerName: 'Alice Johnson', date: '2024-05-20', status: 'Shipped', total: 148899, itemCount: 2, items: [{productId: 'prod1', quantity: 1}, {productId: 'prod6', quantity: 1}], customerAddress: '456 Oginga Odinga St, Kisumu', customerPhone: '+254712345678', paymentMethod: 'Card', paymentStatus: 'Paid', paymentDetails: 'Paid via Card.', stockDeducted: true },
  { id: 'ORD002', customerName: 'Bob Williams', date: '2024-05-19', status: 'Delivered', total: 45000, itemCount: 1, items: [{productId: 'prod3', quantity: 1}], customerAddress: '789 Moi Avenue, Mombasa', customerPhone: '+254722345678', paymentMethod: 'M-Pesa', paymentStatus: 'Paid', paymentDetails: 'RFE45KL98P Confirmed. Ksh45,000.00 sent to Smart Store for order ORD002 on 19/05/2024.', stockDeducted: true},
  { id: 'ORD003', customerName: 'Charlie Brown', date: '2024-05-21', status: 'Pending', total: 8900, itemCount: 1, items: [{productId: 'prod6', quantity: 1}], customerAddress: '101 Kimathi St, Nyeri', customerPhone: '+254733345678', paymentMethod: 'Payment on Delivery', paymentStatus: 'Unpaid', stockDeducted: false },
  { id: 'ORD004', customerName: 'Diana Miller', date: '2024-05-18', status: 'Delivered', total: 24999, itemCount: 1, items: [{productId: 'prod4', quantity: 1}], customerAddress: '222 Kenyatta Ave, Nakuru', customerPhone: '+254744345678', paymentMethod: 'Card', paymentStatus: 'Paid', paymentDetails: 'Paid via Card.', stockDeducted: true },
  { id: 'ORD005', customerName: 'Alice Johnson', date: '2024-05-21', status: 'Pending', total: 389999, itemCount: 2, items: [{productId: 'prod2', quantity: 1}, {productId: 'prod7', quantity: 1}], customerAddress: '333 Digo Rd, Malindi', customerPhone: '+254755345678', paymentMethod: 'M-Pesa', paymentStatus: 'Paid', paymentDetails: 'RGE99MN01X Confirmed. Ksh389,999.00 sent to Smart Store for order ORD005 on 21/05/2024.', stockDeducted: true },
  { id: 'ORD006', customerName: 'Fiona Garcia', date: '2024-05-20', status: 'Cancelled', total: 99999, itemCount: 1, items: [{productId: 'prod7', quantity: 1}], customerAddress: '444 Eldoret-Iten Rd, Eldoret', customerPhone: '+254766345678', paymentMethod: 'Card', paymentStatus: 'Paid', stockDeducted: true },
];

export const REVIEWS_DATA: Review[] = [
    { id: 'rev1', productId: 'prod1', customerName: 'Bob Williams', rating: 5, comment: 'Absolutely amazing phone, the camera is next level!', date: '2024-05-20', status: 'Approved' },
    { id: 'rev2', productId: 'prod1', customerName: 'Diana Miller', rating: 4, comment: 'Great phone, but battery could be a bit better.', date: '2024-05-19', status: 'Approved' },
    { id: 'rev3', productId: 'prod2', customerName: 'Ethan Davis', rating: 5, comment: 'This laptop is a powerhouse. Perfect for video editing.', date: '2024-05-21', status: 'Pending' },
    { id: 'rev4', productId: 'prod4', customerName: 'Charlie Brown', rating: 3, comment: 'Decent sound quality, but they sometimes fall out of my ears when running.', date: '2024-05-18', status: 'Approved' },
    { id: 'rev5', productId: 'prod2', customerName: 'Fiona Garcia', rating: 5, comment: 'Best laptop I have ever owned!', date: '2024-05-22', status: 'Approved' },
    { id: 'rev6', productId: 'prod1', customerName: 'George Harris', rating: 1, comment: 'This is not good.', date: '2024-05-23', status: 'Rejected' },
];


export const STORE_SETTINGS_DATA: StoreSettings = {
  shopName: 'Smart Store',
  logoUrl: '/logo.svg',
  contactEmail: 'contact@smartstore.com',
  location: '123 Biashara St, Nairobi, Kenya',
  whatsappNumber: '+254712345678',
  heroTitle: 'The Future of Smart Stores',
  heroSubtitle: 'Experience shopping reimagined. Effortlessly find the perfect device with our AI-powered search and enjoy a seamless, modern storefront.',
  heroImageUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=2560&auto=format&fit=crop',
  heroTextColor: '#FFFFFF',
  accentColor: '#14B8A6',
  accentTextColor: '#FFFFFF',
  socials: [
    { id: 'soc1', name: 'Twitter', url: 'https://twitter.com/smartstore', icon: 'Twitter' },
    { id: 'soc2', name: 'Facebook', url: 'https://facebook.com/smartstore', icon: 'Facebook' },
    { id: 'soc3', name: 'Instagram', url: 'https://instagram.com/smartstore', icon: 'Instagram' },
  ],
  quickLinks: [
    { id: 'ql1', text: 'About Us', url: '#' },
    { id: 'ql2', text: 'FAQs', url: '#' },
    { id: 'ql3', text: 'Shipping Policy', url: '#' },
    { id: 'ql4', text: 'Terms of Service', url: '#' },
  ],
  paymentMethods: [
    { id: 'pay1', name: 'M-Pesa', details: 'Paybill: 555222', logoUrl: 'https://seeklogo.com/images/M/mpesa-logo-45EC29D379-seeklogo.com.png' },
    { id: 'pay2', name: 'Airtel Money', details: 'Till No: 123456', logoUrl: 'https://seeklogo.com/images/A/airtel-money-logo-9A7482A5A9-seeklogo.com.png' },
    { id: 'pay3', name: 'Visa', details: 'Card Payments', logoUrl: 'https://seeklogo.com/images/V/visa-logo-6F40596636-seeklogo.com.png' },
    { id: 'pay4', name: 'Payment on Delivery', details: 'Pay with cash upon arrival', logoUrl: 'https://i.ibb.co/GTPVcxq/cash-on-delivery.png' }
  ]
};
