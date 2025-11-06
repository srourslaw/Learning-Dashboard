import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function
  const login = async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Admin credentials
    if (email === 'admin@uqmba.com' && password === 'admin123') {
      const adminUser = {
        id: 'admin',
        email: email,
        role: 'admin',
        name: 'Administrator',
        hasActiveSubscription: true
      };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      return adminUser;
    }

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      setCurrentUser(userWithoutPassword);
      return userWithoutPassword;
    }

    throw new Error('Invalid email or password');
  };

  // Mock signup function
  const signup = async (email, password, name) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, this would be hashed
      name,
      role: 'student',
      hasActiveSubscription: false, // New users don't have subscription
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    setCurrentUser(userWithoutPassword);
    return userWithoutPassword;
  };

  // Mock logout function
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  // Mock subscription activation
  const activateSubscription = async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex].hasActiveSubscription = true;
      localStorage.setItem('users', JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = users[userIndex];
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      setCurrentUser(userWithoutPassword);
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    activateSubscription,
    isAdmin: currentUser?.role === 'admin',
    hasSubscription: currentUser?.hasActiveSubscription || currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
