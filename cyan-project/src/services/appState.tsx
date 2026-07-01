'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Restaurant, Booking, RestaurantTable, Review, PaymentMethod } from '@/types';

interface AppStateContextType {
  currentUser: User | null;
  token: string | null;
  restaurants: Restaurant[];
  bookings: Booking[];
  tables: RestaurantTable[];
  reviews: Review[];
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (card: Omit<PaymentMethod, 'id' | 'isDefault' | 'brand' | 'last4'> & { number: string }) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  login: (credentials: {
    email?: string;
    key?: string;
    role: 'customer' | 'owner' | 'admin' | 'worker';
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (name: string, email: string, phone: string, role: 'customer' | 'owner') => Promise<{ success: boolean; error?: string }>;
  switchUserRole: (role: User['role']) => void;
  addBooking: (bookingData: {
    restaurantId: string;
    date: string;
    time: string;
    guests: number;
    specialRequests?: string;
    preOrderItems?: Array<{ id: string; name: string; quantity: number; price: number }>;
  }) => Promise<Booking | null>;
  cancelBooking: (bookingId: string) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status'], tableNumber?: string) => void;
  addRestaurant: (restaurantData: Omit<Restaurant, 'id' | 'rating' | 'reviewCount' | 'ownerId' | 'images'>) => void;
  updateRestaurant: (restaurant: Restaurant) => void;
  addTable: (tableData: Omit<RestaurantTable, 'id' | 'status'>) => void;
  deleteTable: (tableId: string) => void;
  updateProfile: (name: string, email: string, phone: string, avatar?: string) => void;
  addReview: (restaurantId: string, rating: number, comment: string) => void;
  favorites: string[];
  toggleFavorite: (restaurantId: string) => void;
  users: User[];
  deleteUser: (userId: string) => void;
  updateUserRole: (userId: string, role: User['role']) => void;
  addUser: (userData: Omit<User, 'id' | 'avatar'>) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [initialized, setInitialized] = useState(false);

  const getHeaders = (extra: Record<string, string> = {}) => {
    const headers: Record<string, string> = { ...extra };
    const storedToken = token || (typeof window !== 'undefined' ? localStorage.getItem('cyan_token') : null);
    if (storedToken) {
      headers['Authorization'] = `Bearer ${storedToken}`;
    }
    return headers;
  };

  const fetchData = async (customToken?: string) => {
    try {
      const activeToken = customToken || token || (typeof window !== 'undefined' ? localStorage.getItem('cyan_token') : null);
      const headers: Record<string, string> = {};
      if (activeToken) {
        headers['Authorization'] = `Bearer ${activeToken}`;
      }
      const [usersRes, restsRes, bookingsRes, tablesRes, reviewsRes] = await Promise.all([
        fetch('/api/users', { headers }).then(r => r.json()),
        fetch('/api/restaurants', { headers }).then(r => r.json()),
        fetch('/api/bookings', { headers }).then(r => r.json()),
        fetch('/api/tables', { headers }).then(r => r.json()),
        fetch('/api/restaurants/reviews', { headers }).then(r => r.json())
      ]);
      
      if (Array.isArray(usersRes)) setUsers(usersRes);
      if (Array.isArray(restsRes)) setRestaurants(restsRes);
      if (Array.isArray(bookingsRes)) setBookings(bookingsRes);
      if (Array.isArray(tablesRes)) setTables(tablesRes);
      if (Array.isArray(reviewsRes)) setReviews(reviewsRes);
    } catch (err) {
      console.error('Failed to load collections from server api:', err);
    }
  };

  // Initialize from backend server endpoints (with LocalStorage cache fallback)
  useEffect(() => {
    fetchData();

    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('cyan_user');
      const storedFavorites = localStorage.getItem('cyan_favorites');
      const storedToken = localStorage.getItem('cyan_token');
      const storedPayments = localStorage.getItem('cyan_payments');

      if (storedUser) setCurrentUser(JSON.parse(storedUser));
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      if (storedToken) setToken(storedToken);
      
      if (storedPayments) {
        setPaymentMethods(JSON.parse(storedPayments));
      } else {
        // Seed default card for demonstration purposes
        const defaultCard: PaymentMethod[] = [
          {
            id: 'pm-1',
            brand: 'visa',
            last4: '4242',
            expiry: '12/28',
            name: 'Sarah Jenkins',
            isDefault: true
          }
        ];
        setPaymentMethods(defaultCard);
        localStorage.setItem('cyan_payments', JSON.stringify(defaultCard));
      }

      setInitialized(true);
    }
  }, []);

  // Save currentUser session and favorites to LocalStorage
  useEffect(() => {
    if (initialized) {
      localStorage.setItem('cyan_user', JSON.stringify(currentUser));
      localStorage.setItem('cyan_favorites', JSON.stringify(favorites));
      localStorage.setItem('cyan_payments', JSON.stringify(paymentMethods));
      if (token) {
        localStorage.setItem('cyan_token', token);
      } else {
        localStorage.removeItem('cyan_token');
      }
    }
  }, [currentUser, favorites, token, paymentMethods, initialized]);

  // Actions
  const addPaymentMethod = (card: Omit<PaymentMethod, 'id' | 'isDefault' | 'brand' | 'last4'> & { number: string }) => {
    let brand: PaymentMethod['brand'] = 'unknown';
    const cleanNumber = card.number.replace(/\s+/g, '');
    const firstDigit = cleanNumber.charAt(0);
    if (firstDigit === '4') brand = 'visa';
    else if (firstDigit === '5') brand = 'mastercard';
    else if (firstDigit === '3') brand = 'amex';
    else if (firstDigit === '6') brand = 'discover';

    const last4 = cleanNumber.slice(-4) || '1111';
    
    const newCard: PaymentMethod = {
      id: `pm-${Date.now()}`,
      brand,
      last4,
      expiry: card.expiry,
      name: card.name,
      isDefault: paymentMethods.length === 0
    };

    setPaymentMethods(prev => {
      if (newCard.isDefault) {
        return [...prev.map(c => ({ ...c, isDefault: false })), newCard];
      }
      return [...prev, newCard];
    });
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (prev.find(c => c.id === id)?.isDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(c => ({
        ...c,
        isDefault: c.id === id
      }))
    );
  };

  const login = async (credentials: {
    email?: string;
    key?: string;
    role: 'customer' | 'owner' | 'admin' | 'worker';
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const result = await response.json();
      if (result.success) {
        setCurrentUser(result.user);
        setToken(result.token);
        // Fetch new data for the logged in user immediately!
        fetchData(result.token);
        // Refresh local user records list
        setUsers(prev => {
          if (prev.some(u => u.id === result.user.id)) return prev;
          return [...prev, result.user];
        });
      }
      return result;
    } catch (err) {
      console.error('Login Request Failed:', err);
      return { success: false, error: 'Network error or backend server is offline.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    setBookings([]);
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    role: 'customer' | 'owner'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, role })
      });
      const result = await response.json();
      if (result.success) {
        setCurrentUser(result.user);
        setToken(result.token);
        // Fetch new data for the logged in user immediately!
        fetchData(result.token);
        setUsers(prev => [...prev, result.user]);
      }
      return result;
    } catch (err) {
      console.error('Registration Request Failed:', err);
      return { success: false, error: 'Network error or backend server is offline.' };
    }
  };

  const switchUserRole = (role: User['role']) => {
    const matchingUser = users.find(u => u.role === role);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    } else {
      const fallbackUser = {
        id: `usr-${role}`,
        name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email: `${role}@cyanreserve.com`,
        phone: '+1 (555) 123-4567',
        role: role,
        assignedComponent: role === 'worker' ? ('reservations' as const) : undefined
      };
      setCurrentUser(fallbackUser);
    }
  };

  const addBooking = async (bookingData: {
    restaurantId: string;
    date: string;
    time: string;
    guests: number;
    specialRequests?: string;
    preOrderItems?: Array<{ id: string; name: string; quantity: number; price: number }>;
  }): Promise<Booking | null> => {
    if (!currentUser) return null;

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ bookingData, user: currentUser })
      });
      if (!response.ok) throw new Error('Create booking endpoint failed');
      const newBooking = await response.json();
      setBookings(prev => [newBooking, ...prev]);
      return newBooking;
    } catch (err) {
      console.error('Failed to add reservation booking:', err);
      return null;
    }
  };

  const cancelBooking = (bookingId: string) => {
    // Optimistic UI update
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
    // Backend API update
    fetch(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).catch(err => console.error('Failed to cancel booking on backend:', err));
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status'], tableNumber?: string) => {
    // Optimistic UI update
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status, tableNumber: tableNumber || b.tableNumber } : b))
    );
    // Backend API update
    fetch(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status, tableNumber })
    }).catch(err => console.error('Failed to update booking status on backend:', err));
  };

  const addRestaurant = (restaurantData: Omit<Restaurant, 'id' | 'rating' | 'reviewCount' | 'ownerId' | 'images'>) => {
    if (!currentUser) return;
    fetch('/api/restaurants', {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ restaurantData, ownerId: currentUser.id })
    })
    .then(r => r.json())
    .then(newRestaurant => {
      setRestaurants(prev => [...prev, newRestaurant]);
    })
    .catch(err => console.error('Failed to save restaurant:', err));
  };

  const updateRestaurant = (updatedRest: Restaurant) => {
    // Optimistic UI update
    setRestaurants(prev =>
      prev.map(r => (r.id === updatedRest.id ? updatedRest : r))
    );
    // Backend API update
    fetch('/api/restaurants', {
      method: 'PUT',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(updatedRest)
    }).catch(err => console.error('Failed to update restaurant details:', err));
  };

  const addTable = (tableData: Omit<RestaurantTable, 'id' | 'status'>) => {
    fetch('/api/tables', {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(tableData)
    })
    .then(r => r.json())
    .then(newTable => {
      setTables(prev => [...prev, newTable]);
    })
    .catch(err => console.error('Failed to save table layout:', err));
  };

  const deleteTable = (tableId: string) => {
    // Optimistic UI update
    setTables(prev => prev.filter(t => t.id !== tableId));
    // Backend API update
    fetch(`/api/tables/${tableId}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).catch(err => console.error('Failed to delete table configuration:', err));
  };

  const updateProfile = (name: string, email: string, phone: string, avatar?: string) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      name,
      email,
      phone,
      avatar: avatar || currentUser.avatar
    };
    setCurrentUser(updatedUser);
    
    // Sync backend profile details
    fetch(`/api/users/${currentUser.id}`, {
      method: 'PUT',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(updatedUser)
    }).catch(err => console.error('Failed to save updated profile details:', err));
  };

  const addReview = (restaurantId: string, rating: number, comment: string) => {
    if (!currentUser) return;

    fetch('/api/restaurants/reviews', {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        restaurantId,
        rating,
        comment,
        userName: currentUser.name,
        userAvatar: currentUser.avatar
      })
    })
    .then(r => r.json())
    .then(newReview => {
      setReviews(prev => [newReview, ...prev]);
      
      // Pull updated restaurant ratings from server database
      fetch('/api/restaurants', {
        headers: getHeaders()
      })
        .then(r => r.json())
        .then(rests => setRestaurants(rests))
        .catch(err => console.error('Failed to sync restaurant scores:', err));
    })
    .catch(err => console.error('Failed to submit user review:', err));
  };

  const toggleFavorite = (restaurantId: string) => {
    setFavorites(prev => {
      if (prev.includes(restaurantId)) {
        return prev.filter(id => id !== restaurantId);
      } else {
        return [...prev, restaurantId];
      }
    });
  };

  const deleteUser = (userId: string) => {
    // Optimistic UI update
    setUsers(prev => prev.filter(u => u.id !== userId));
    // Backend API update
    fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).catch(err => console.error('Failed to delete account on backend:', err));
  };

  const updateUserRole = (userId: string, role: User['role']) => {
    // Optimistic UI update
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role } : null);
    }
    // Backend API update
    fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ role })
    }).catch(err => console.error('Failed to sync user role update:', err));
  };

  const addUser = (userData: Omit<User, 'id' | 'avatar'>) => {
    fetch('/api/users', {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(userData)
    })
    .then(r => r.json())
    .then(newUser => {
      setUsers(prev => [...prev, newUser]);
    })
    .catch(err => console.error('Failed to provision user account:', err));
  };

  return (
    <AppStateContext.Provider
      value={{
        currentUser,
        token,
        restaurants,
        bookings,
        tables,
        reviews,
        paymentMethods,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        login,
        logout,
        register,
        switchUserRole,
        addBooking,
        cancelBooking,
        updateBookingStatus,
        addRestaurant,
        updateRestaurant,
        addTable,
        deleteTable,
        updateProfile,
        addReview,
        favorites,
        toggleFavorite,
        users,
        deleteUser,
        updateUserRole,
        addUser,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
