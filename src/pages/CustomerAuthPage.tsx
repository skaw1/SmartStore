
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Icons } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { useNotification } from '../contexts/NotificationContext';

const CustomerAuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { settings } = useData();

  useEffect(() => {
    document.title = `${authMode === 'login' ? 'Login' : 'Sign Up'} - ${settings.shopName}`;
  }, [settings.shopName, authMode]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-background-dark p-4">
        <div className="absolute top-4 left-4">
            <Button asChild variant="outline">
                <Link to="/home">
                <Icons.ChevronLeft className="mr-2 h-4 w-4" />
                Back to Store
                </Link>
            </Button>
        </div>
        <div className="absolute top-4 right-4">
            <ThemeToggleButton />
        </div>
        <div className="w-full max-w-md">
            <Link to="/home" className="flex items-center gap-2 justify-center mb-6">
                <Icons.Store className="h-8 w-8 text-primary-dark dark:text-white" />
                <span className="font-bold text-2xl text-primary-dark dark:text-white">{settings.shopName}</span>
            </Link>
            <Card>
                <CardHeader>
                    <div className="flex border-b mb-4">
                        <button 
                            className={`flex-1 p-3 font-semibold ${authMode === 'login' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}
                            onClick={() => setAuthMode('login')}
                        >
                            Login
                        </button>
                        <button 
                             className={`flex-1 p-3 font-semibold ${authMode === 'signup' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}
                             onClick={() => setAuthMode('signup')}
                        >
                            Sign Up
                        </button>
                    </div>
                    <CardTitle>{authMode === 'login' ? 'Welcome Back!' : 'Create an Account'}</CardTitle>
                    <CardDescription>
                         {authMode === 'login' 
                            ? 'Enter your email to access your account. No password needed for this demo.' 
                            : 'Join us to get the best deals. No password needed for this demo.'}
                    </CardDescription>
                </CardHeader>

                {authMode === 'login' ? <LoginForm /> : <SignUpForm />}
            
                 <p className="text-center text-xs text-gray-500 mt-4 mb-2 px-6">
                    Are you a store owner? <Link to="/admin/login" className="font-semibold text-accent hover:underline">Admin Login</Link>
                </p>
            </Card>
        </div>
    </div>
  );
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useNotification();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter an email address.', 'error');
      return;
    }
    // Create a user-friendly name from the email
    const name = email.split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\d+/g, '')
      .trim()
      .replace(/\b\w/g, l => l.toUpperCase());

    login({ name: name || 'Valued Customer', email });
    showToast(`Login successful! Welcome back, ${name || 'friend'}!`, 'success');
    const redirectPath = searchParams.get('redirect');
    navigate(redirectPath || '/home');
  };

  return (
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="user@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" variant="accent">
                Login
            </Button>
        </CardFooter>
      </form>
  )
};

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useNotification();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
     if (!name || !email) {
      showToast('Please enter your name and email.', 'error');
      return;
    }
    login({ name, email });
    showToast(`Sign up successful! Welcome, ${name}!`, 'success');
    const redirectPath = searchParams.get('redirect');
    navigate(redirectPath || '/home');
  };

  return (
      <form onSubmit={handleSignUp}>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="signup-name">Full Name</label>
                <Input 
                    id="signup-name" 
                    type="text" 
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="signup-email">Email</label>
                <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="jane.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
        </CardContent>
        <CardFooter>
            <Button type="submit" className="w-full" variant="accent">
                Create Account
            </Button>
        </CardFooter>
    </form>
  )
};

export default CustomerAuthPage;
