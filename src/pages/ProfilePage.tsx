
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/icons';
import { useNotification } from '../contexts/NotificationContext';
import Modal from '../components/ui/Modal';

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
        Delete Account
      </Button>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
    </div>
  </Modal>
);

const ProfilePage: React.FC = () => {
    const { user, updateUser, deleteAccount, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useNotification();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/profile');
        } else if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [isAuthenticated, navigate, user]);

    if (!user) {
        return (
             <div className="container mx-auto px-4 py-16 text-center">
                <Icons.User className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600" />
                <h1 className="mt-6 text-3xl font-bold text-primary-dark dark:text-white">Loading Profile...</h1>
            </div>
        );
    }

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({ name, email });
        showToast('Profile updated successfully!', 'success');
    };

    const handlePasswordReset = () => {
        showToast(`Password reset link sent to ${email}`, 'info');
    };

    const handleDeleteRequest = () => {
        setIsConfirmModalOpen(true);
    };

    const confirmDeleteAccount = () => {
        setIsConfirmModalOpen(false);
        deleteAccount();
        showToast('Account deleted successfully.', 'success');
        navigate('/');
    };

    return (
        <>
            <div className="container mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary-dark dark:text-white">My Profile</h1>
                
                <Card>
                    <form onSubmit={handleProfileUpdate}>
                        <CardHeader>
                            <CardTitle>Your Details</CardTitle>
                            <CardDescription>Keep your account information up to date.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="font-medium">Full Name</label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="font-medium">Email Address</label>
                                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Save Changes</Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>Need to reset your password? We'll send a secure link to your email.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline" onClick={handlePasswordReset}>
                            <Icons.Key className="mr-2 h-4 w-4" />
                            Send Reset Link
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="border-red-500/50 dark:border-red-500/30">
                     <CardHeader>
                        <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Deleting your account is a permanent action. All your order history and details will be removed. This cannot be undone.</p>
                     </CardContent>
                     <CardFooter>
                         <Button variant="destructive" onClick={handleDeleteRequest}>Delete My Account</Button>
                     </CardFooter>
                </Card>
            </div>
            
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDeleteAccount}
                title="Delete Account"
                description="Are you absolutely sure you want to delete your account? All of your data, including order history, will be permanently removed. This action cannot be undone."
            />
        </>
    );
};

export default ProfilePage;
