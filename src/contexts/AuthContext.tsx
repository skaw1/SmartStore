
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useData } from './DataContext';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (user?: User) => void;
  logout: () => void;
  adminLogin: (email: string) => void;
  adminLogout: () => void;
  updateUser: (details: Partial<User>) => void;
  deleteAccount: () => void;
  lastUserPath: string;
  setLastUserPath: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastUserPath, setLastUserPath] = useState('/home');
  const dataContext = useData();


  const login = (userData: User = { name: 'Alice Johnson', email: 'alice.j@example.com' }) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const adminLogin = (email: string) => {
    // Log in as an admin, which also authenticates as a user.
    login({ name: 'Store Admin', email: email });
    setIsAdmin(true);
  };
  
  const adminLogout = () => {
    logout();
  };

  const updateUser = (details: Partial<User>) => {
    if(user) {
        setUser(prev => ({...prev!, ...details}));
        // In a real app, you would also make an API call to persist this change.
        console.log("User updated:", {...user, ...details});
    }
  };

  const deleteAccount = () => {
    if (user && dataContext) {
      dataContext.deleteUserData(user.name);
    }
    logout();
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, login, logout, adminLogin, adminLogout, updateUser, deleteAccount, lastUserPath, setLastUserPath }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
