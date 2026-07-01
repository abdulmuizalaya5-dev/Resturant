export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'owner' | 'admin' | 'worker';
  avatar?: string;
  assignedComponent?: 'reservations' | 'tables' | 'restaurants' | 'analytics';
  accessKey?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export interface RestaurantTable {
  id: string;
  restaurantId: string;
  number: string;
  capacity: number;
  status: 'available' | 'reserved' | 'occupied';
}

export interface Review {
  id: string;
  restaurantId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  cuisine: string;
  priceRange: '$$' | '$$$' | '$$$$'; // e.g., $$ = Medium, $$$ = Expensive, $$$$ = Luxury
  location: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  featured: boolean;
  ownerId: string;
  menu: MenuItem[];
}

export interface Booking {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  tableNumber?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  specialRequests?: string;
  preOrderItems?: Array<{ id: string; name: string; quantity: number; price: number }>;
}

export interface SearchQuery {
  location: string;
  date: string;
  time: string;
  guests: number;
}

export interface PaymentMethod {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';
  last4: string;
  expiry: string;
  name: string;
  isDefault: boolean;
}
