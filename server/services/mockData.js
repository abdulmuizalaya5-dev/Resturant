const mockUsers = [
  {
    id: 'usr-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'usr-2',
    name: 'Chef Marco Rossi',
    email: 'marco.rossi@ristorante.com',
    phone: '+1 (555) 987-6543',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'usr-3',
    name: 'Alexander Wright',
    email: 'admin@cyanreserve.com',
    phone: '+1 (555) 000-1111',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'usr-4',
    name: 'Elena Rostova',
    email: 'elena@ristorante.com',
    phone: '+1 (555) 777-8888',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80',
    assignedComponent: 'reservations',
    accessKey: 'cyan-staff-123'
  }
];

const mockRestaurants = [
  {
    id: 'rest-1',
    name: "L'Ambroisie",
    description: 'Experience the height of French culinary elegance. Located in the historic heart of the city, L\'Ambroisie offers a symphonic tasting menu of haute cuisine, curated by Michelin-starred culinary artists. Expect impeccable service, gold-leaf interiors, and rare vintage pairings.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewCount: 312,
    cuisine: 'French Fine Dining',
    priceRange: '$$$$',
    location: 'Manhattan, New York',
    address: '124 E 73rd St, New York, NY 10021',
    phone: '+1 (212) 555-8902',
    email: 'reservations@lambroisie-ny.com',
    openingHours: '17:00 - 23:00',
    featured: true,
    ownerId: 'usr-2',
    menu: [
      { id: 'm-1', name: 'Caviar Impérial', description: 'Siberian caviar served with gold leaf blinis and double cream', price: 120, category: 'Appetizers' },
      { id: 'm-2', name: 'Canard Rôti aux Pêches', description: 'Crisp roasted duck breast with caramelised peaches and wild honey reduction', price: 78, category: 'Main Course' },
      { id: 'm-3', name: 'Soufflé au Chocolat Noir', description: 'Valrhona chocolate soufflé served with Grand Marnier ice cream', price: 28, category: 'Desserts' }
    ]
  },
  {
    id: 'rest-2',
    name: 'Sakura Sushi Zen',
    description: 'An intimate, 10-seat cypress wood counter offering an immersive sushi omakase journey. Fresh, seasonal fish is flown in daily from Tokyo markets. Each bite is prepared meticulously in front of you, celebrating the pure essence of Edomae sushi style.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 194,
    cuisine: 'Japanese Omakase',
    priceRange: '$$$$',
    location: 'Downtown, Los Angeles',
    address: '427 S Grand Ave, Los Angeles, CA 90071',
    phone: '+1 (213) 555-4819',
    email: 'info@sakurasushizen.com',
    openingHours: '18:00 - 22:30',
    featured: true,
    ownerId: 'usr-2',
    menu: [
      { id: 'm-4', name: 'Chef\'s 18-Course Omakase', description: 'Curated progression of daily selections including bluefin otoro, uni, and wagyu', price: 250, category: 'Main Course' },
      { id: 'm-5', name: 'A5 Wagyu Nigiri', description: 'Lightly seared Miyazaki wagyu with truffle soy and chives', price: 45, category: 'Appetizers' },
      { id: 'm-6', name: 'Matcha Fondant Cake', description: 'Uji matcha lava cake with black sesame gelato', price: 22, category: 'Desserts' }
    ]
  },
  {
    id: 'rest-3',
    name: 'Taverna Toscana',
    description: 'Bask in the warm glow of rustic stone walls, olive branches, and the rich aroma of wood-fired ovens. Taverna Toscana serves authentic heirloom recipes passed down through generations. Famous for handmade pastas, wild boar ragu, and Tuscan wines.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    reviewCount: 428,
    cuisine: 'Rustic Italian',
    priceRange: '$$$',
    location: 'North End, Boston',
    address: '88 Hanover St, Boston, MA 02113',
    phone: '+1 (617) 555-9010',
    email: 'ciao@tavernatoscana.com',
    openingHours: '12:00 - 22:00',
    featured: true,
    ownerId: 'usr-2',
    menu: [
      { id: 'm-7', name: 'Burrata di Andria', description: 'Creamy burrata, heirloom tomatoes, basil oil, aged balsamic glaze', price: 24, category: 'Appetizers' },
      { id: 'm-8', name: 'Pappardelle al Cinghiale', description: 'Wide flat noodles tossed in a 12-hour slow braised wild boar ragu', price: 38, category: 'Main Course' },
      { id: 'm-9', name: 'Classic Tiramisu', description: 'Espresso-soaked ladyfingers, mascarpone sabayon, cocoa powder', price: 16, category: 'Desserts' }
    ]
  },
  {
    id: 'rest-4',
    name: 'The Golden Ember',
    description: 'A contemporary American steakhouse redefining prime cuts and charcoal grilling. With sleek industrial accents, cozy leather booths, and an open show-kitchen, we cook over live cherrywood embers to deliver rich, smoky textures and unmatched flavors.',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.6,
    reviewCount: 285,
    cuisine: 'American Steakhouse',
    priceRange: '$$$',
    location: 'River North, Chicago',
    address: '320 W Erie St, Chicago, IL 60654',
    phone: '+1 (312) 555-7281',
    email: 'info@goldenembersteak.com',
    openingHours: '16:00 - 23:00',
    featured: false,
    ownerId: 'usr-2',
    menu: [
      { id: 'm-10', name: 'Bone-In Ribeye (16oz)', description: 'Dry aged for 35 days, grilled over cherrywood coals, with truffle butter', price: 68, category: 'Main Course' },
      { id: 'm-11', name: 'Smoked Pork Belly Belly Sliders', description: 'Applewood smoked pork belly, bourbon glaze, pickled red onions', price: 21, category: 'Appetizers' },
      { id: 'm-12', name: 'Ember Salted Caramel Tart', description: 'Smoked sea salt, dark chocolate ganache, buttery pastry shell', price: 18, category: 'Desserts' }
    ]
  },
  {
    id: 'rest-5',
    name: 'Mesa Mezze',
    description: 'A vibrant escape filled with coastal colors and lively music. Mesa Mezze takes you on a tour of the Mediterranean coastline with shareable hot and cold mezze plates, fresh seafood, and custom botanical cocktails.',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.5,
    reviewCount: 154,
    cuisine: 'Mediterranean Tapas',
    priceRange: '$$',
    location: 'Design District, Miami',
    address: '40 NE 39th St, Miami, FL 33137',
    phone: '+1 (305) 555-0921',
    email: 'hello@mesamezze.com',
    openingHours: '11:00 - 22:00',
    featured: false,
    ownerId: 'usr-2',
    menu: [
      { id: 'm-13', name: 'Octopus Carpaccio', description: 'Thinly sliced tender octopus, citrus vinaigrette, capers, microgreens', price: 26, category: 'Appetizers' },
      { id: 'm-14', name: 'Grilled Lamb Kebab', description: 'Spiced minced lamb served with saffron rice, grilled vegetables, and tzatziki', price: 34, category: 'Main Course' },
      { id: 'm-15', name: 'Baklava Supreme', description: 'Layers of crispy phyllo, crushed pistachios, honey syrup, and cardamom cream', price: 14, category: 'Desserts' }
    ]
  },
  {
    id: 'rest-6',
    name: 'Nouveau Bistro',
    description: 'An casual chic neighborhood bistro offering seasonal, plant-forward ingredients and sustainable cocktails. We combine classic culinary methods with modern innovation to deliver dishes that are both nourishing and exciting.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.4,
    reviewCount: 98,
    cuisine: 'Modern Vegetarian & Seafood',
    priceRange: '$$',
    location: 'Capitol Hill, Seattle',
    address: '1501 E Olive Way, Seattle, WA 98122',
    phone: '+1 (206) 555-0150',
    email: 'hello@nouveaubistro.com',
    openingHours: '16:00 - 22:00',
    featured: false,
    ownerId: 'usr-2',
    menu: [
      { id: 'm-16', name: 'Charred Heirloom Cauliflower', description: 'Cauliflower steak, hazelnut romesco sauce, pickled grapes, herb oil', price: 22, category: 'Appetizers' },
      { id: 'm-17', name: 'Pan-Seared Wild Salmon', description: 'Wild-caught salmon, sunchoke puree, braised leeks, lemon verbena reduction', price: 42, category: 'Main Course' },
      { id: 'm-18', name: 'Deconstructed Lemon Meringue', description: 'Lemon curd, crisp meringue shards, graham crust crumbs, fresh berries', price: 15, category: 'Desserts' }
    ]
  }
];

const mockTables = [
  { id: 'tbl-1', restaurantId: 'rest-1', number: '101', capacity: 2, status: 'available' },
  { id: 'tbl-2', restaurantId: 'rest-1', number: '102', capacity: 4, status: 'reserved' },
  { id: 'tbl-3', restaurantId: 'rest-1', number: '103', capacity: 6, status: 'available' },
  { id: 'tbl-4', restaurantId: 'rest-1', number: 'Bar-1', capacity: 2, status: 'available' },
  { id: 'tbl-5', restaurantId: 'rest-2', number: 'Counter-1', capacity: 1, status: 'available' },
  { id: 'tbl-6', restaurantId: 'rest-2', number: 'Counter-2', capacity: 1, status: 'available' },
  { id: 'tbl-7', restaurantId: 'rest-2', number: 'Counter-3', capacity: 1, status: 'reserved' },
  { id: 'tbl-8', restaurantId: 'rest-3', number: 'T1', capacity: 2, status: 'available' },
  { id: 'tbl-9', restaurantId: 'rest-3', number: 'T2', capacity: 4, status: 'available' },
  { id: 'tbl-10', restaurantId: 'rest-3', number: 'T3', capacity: 8, status: 'reserved' },
  { id: 'tbl-11', restaurantId: 'rest-4', number: '1', capacity: 2, status: 'available' },
  { id: 'tbl-12', restaurantId: 'rest-4', number: '2', capacity: 4, status: 'available' },
  { id: 'tbl-13', restaurantId: 'rest-5', number: 'Patio-1', capacity: 2, status: 'available' },
  { id: 'tbl-14', restaurantId: 'rest-5', number: 'Patio-2', capacity: 4, status: 'available' },
  { id: 'tbl-15', restaurantId: 'rest-6', number: 'B1', capacity: 4, status: 'available' },
];

const mockReviews = [
  {
    id: 'rev-1',
    restaurantId: 'rest-1',
    userName: 'Emma Watson',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: 'An absolutely magical experience. The Caviar was heavenly and the staff treated us like royalty. Truly worth every penny.',
    date: '2026-06-15'
  },
  {
    id: 'rev-2',
    restaurantId: 'rest-1',
    userName: 'David Miller',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    rating: 4.8,
    comment: 'Incredible French dining. The attention to detail is spectacular. It was difficult to secure a slot, but the platform made the waitlist work seamlessly.',
    date: '2026-06-10'
  },
  {
    id: 'rev-3',
    restaurantId: 'rest-2',
    userName: 'Kenji Takahashi',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: 'Authentic Edomae style. Chef prepares each piece like a master sculptor. The Otoro melt-in-mouth quality matches the best Ginza counters.',
    date: '2026-06-18'
  },
  {
    id: 'rev-4',
    restaurantId: 'rest-3',
    userName: 'Sophia Ricci',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    rating: 4.5,
    comment: 'Warm atmosphere and rich ragu! Felt like stepping into a little trattoria in Siena. Make sure to try the tiramisu.',
    date: '2026-06-12'
  }
];

const mockBookings = [
  {
    id: 'res-101',
    restaurantId: 'rest-1',
    restaurantName: "L'Ambroisie",
    restaurantImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80',
    customerId: 'usr-1',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '+1 (555) 123-4567',
    date: '2026-06-25',
    time: '19:30',
    guests: 2,
    tableNumber: '101',
    status: 'confirmed',
    createdAt: '2026-06-20T10:00:00Z',
    specialRequests: 'Celebrating 5th anniversary. Window table requested.'
  },
  {
    id: 'res-102',
    restaurantId: 'rest-3',
    restaurantName: 'Taverna Toscana',
    restaurantImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80',
    customerId: 'usr-1',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '+1 (555) 123-4567',
    date: '2026-06-28',
    time: '20:00',
    guests: 4,
    status: 'pending',
    createdAt: '2026-06-22T09:15:00Z',
    specialRequests: 'High chair for toddler needed.'
  },
  {
    id: 'res-103',
    restaurantId: 'rest-2',
    restaurantName: 'Sakura Sushi Zen',
    restaurantImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=150&q=80',
    customerId: 'usr-1',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '+1 (555) 123-4567',
    date: '2026-06-18',
    time: '18:30',
    guests: 1,
    tableNumber: 'Counter-3',
    status: 'completed',
    createdAt: '2026-06-10T14:20:00Z'
  },
  {
    id: 'res-104',
    restaurantId: 'rest-4',
    restaurantName: 'The Golden Ember',
    restaurantImage: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=150&q=80',
    customerId: 'usr-5',
    customerName: 'Marcus Brodie',
    customerEmail: 'marcus.b@example.com',
    customerPhone: '+1 (555) 234-5678',
    date: '2026-06-24',
    time: '19:00',
    guests: 2,
    status: 'confirmed',
    createdAt: '2026-06-21T11:45:00Z'
  },
  {
    id: 'res-105',
    restaurantId: 'rest-1',
    restaurantName: "L'Ambroisie",
    restaurantImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80',
    customerId: 'usr-6',
    customerName: 'Emily Clark',
    customerEmail: 'emily.c@example.com',
    customerPhone: '+1 (555) 345-6789',
    date: '2026-06-26',
    time: '21:00',
    guests: 6,
    status: 'pending',
    createdAt: '2026-06-22T08:30:00Z'
  }
];

module.exports = {
  mockUsers,
  mockRestaurants,
  mockTables,
  mockReviews,
  mockBookings
};
