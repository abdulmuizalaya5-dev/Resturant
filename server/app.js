require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const prisma = require('./services/prisma');
const { seedPrismaIfNeeded } = require('./services/dbHelper');
const { sendWelcomeEmail, sendBookingConfirmationEmail } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'cyan-reserve-jwt-secret-key-1234567890';

// Middlewares
app.use(cors({ origin: ['http://localhost:3000', 'https://resturant-two-umber.vercel.app'], credentials: true }));
app.use(express.json());

// Seeding hook on boot
seedPrismaIfNeeded()
  .then(() => console.log('Database connected successfully.'))
  .catch(err => console.error('Seeding check failed:', err));

// JWT Middleware helper
function getAuthUser(req) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // { userId, email, role }
  } catch (err) {
    return null;
  }
}

// ─── AUTH ROUTE HANDLERS ──────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required.' });
    }

    const lowerEmail = email.toLowerCase().trim();

    // Check duplicate email
    const existingUser = await prisma.user.findFirst({ where: { email: lowerEmail } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: lowerEmail,
        phone: phone || '+1 (555) 555-5555',
        role: role || 'customer',
        avatar: `https://images.unsplash.com/photo-${
          role === 'owner' ? '1577219491135-ce391730fb2c' : '1494790108377-be9c29b29330'
        }?auto=format&fit=crop&w=150&q=80`
      }
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send Welcome Email (async non-blocking)
    sendWelcomeEmail({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }).catch(err => console.error('[Register] Welcome email failed:', err));

    return res.json({ success: true, user: newUser, token });
  } catch (error) {
    console.error('Register API error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message || String(error) });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, key, role } = req.body;
    let authenticatedUser = null;

    if (role === 'admin') {
      if (!key) {
        return res.status(400).json({ success: false, error: 'Access key is required for administrator login.' });
      }
      if (key !== 'cyan-admin-secret' && key !== 'CYAN-ADMIN-99') {
        return res.status(401).json({ success: false, error: 'Invalid Administrator Access Key.' });
      }

      let adminUser = await prisma.user.findFirst({ where: { role: 'admin' } });
      if (!adminUser) {
        adminUser = await prisma.user.create({
          data: {
            id: 'usr-admin',
            name: 'Alexander Wright',
            email: 'admin@cyanreserve.com',
            phone: '+1 (555) 000-1111',
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
          }
        });
      }
      authenticatedUser = adminUser;
    } else if (role === 'worker') {
      if (!key) {
        return res.status(400).json({ success: false, error: 'Access Key is required for staff login.' });
      }
      const workerUser = await prisma.user.findFirst({ where: { role: 'worker', accessKey: key } });
      if (!workerUser) {
        return res.status(401).json({ success: false, error: 'No Staff Worker account found with this access key.' });
      }
      authenticatedUser = workerUser;
    } else if (role === 'owner') {
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required.' });
      }
      const lowerEmail = email.toLowerCase();
      let ownerUser = await prisma.user.findFirst({ where: { email: lowerEmail, role: 'owner' } })
                      || await prisma.user.findFirst({ where: { role: 'owner' } });
      if (!ownerUser) {
        ownerUser = await prisma.user.create({
          data: {
            id: 'usr-2',
            name: 'Chef Marco Rossi',
            email: lowerEmail,
            phone: '+1 (555) 987-6543',
            role: 'owner',
            avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80'
          }
        });
      }
      authenticatedUser = ownerUser;
    } else {
      // Customer
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required.' });
      }
      const lowerEmail = email.toLowerCase();
      let customerUser = await prisma.user.findFirst({ where: { email: lowerEmail, role: 'customer' } });
      if (!customerUser) {
        customerUser = await prisma.user.create({
          data: {
            id: `usr-${Date.now()}`,
            name: email.split('@')[0],
            email: lowerEmail,
            phone: '+1 (555) 555-5555',
            role: 'customer'
          }
        });
      }
      authenticatedUser = customerUser;
    }

    if (!authenticatedUser) {
      return res.status(401).json({ success: false, error: 'Authentication failed.' });
    }

    const token = jwt.sign(
      { userId: authenticatedUser.id, email: authenticatedUser.email, role: authenticatedUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ success: true, user: authenticatedUser, token });
  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { token, name, email, avatar, isMock } = req.body;

    let verifiedEmail = '';
    let verifiedName = '';
    let verifiedAvatar = '';

    if (isMock) {
      // Mock flow for dev/fallback
      verifiedEmail = email?.toLowerCase().trim();
      verifiedName = name || email?.split('@')[0] || 'Google User';
      verifiedAvatar = avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80';
    } else {
      if (!token) {
        return res.status(400).json({ success: false, error: 'Google ID Token is required.' });
      }

      // Verify Google ID Token using Google's OAuth2 API endpoint
      const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
      if (!googleRes.ok) {
        return res.status(400).json({ success: false, error: 'Failed to verify Google Token.' });
      }

      const googlePayload = await googleRes.json();
      
      if (!googlePayload.email) {
        return res.status(400).json({ success: false, error: 'Invalid Google Token payload: email missing.' });
      }

      verifiedEmail = googlePayload.email.toLowerCase().trim();
      verifiedName = googlePayload.name || verifiedEmail.split('@')[0];
      verifiedAvatar = googlePayload.picture || `https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80`;
    }

    if (!verifiedEmail) {
      return res.status(400).json({ success: false, error: 'Email verification failed.' });
    }

    // Check if the user exists
    let user = await prisma.user.findFirst({ where: { email: verifiedEmail } });
    let isNewUser = false;

    if (!user) {
      // Create user
      user = await prisma.user.create({
        data: {
          id: `usr-${Date.now()}`,
          name: verifiedName,
          email: verifiedEmail,
          phone: '+1 (555) 555-5555',
          role: 'customer',
          avatar: verifiedAvatar,
        }
      });
      isNewUser = true;
    }

    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    if (isNewUser) {
      // Send welcome email (async non-blocking)
      sendWelcomeEmail({
        name: user.name,
        email: user.email,
        role: user.role
      }).catch(err => console.error('[Google Sign-up] Welcome email failed:', err));
    }

    return res.json({ success: true, user, token: jwtToken, isNewUser });
  } catch (error) {
    console.error('Google Auth API error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



// ─── USER ROUTE HANDLERS ──────────────────────────────────────────────────────

app.get('/api/users', async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized: Admin access required.' });
    }
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (error) {
    console.error('GET users error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized: Admin access required.' });
    }

    const userData = req.body;
    if (!userData.name || !userData.email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const newUser = await prisma.user.create({
      data: {
        id: `usr-${Date.now()}`,
        name: userData.name,
        email: userData.email.toLowerCase(),
        phone: userData.phone || '+1 (555) 555-5555',
        role: userData.role || 'customer',
        assignedComponent: userData.assignedComponent || null,
        accessKey: userData.accessKey || null,
        avatar: `https://images.unsplash.com/photo-${
          userData.role === 'owner' || userData.role === 'worker'
            ? '1577219491135-ce391730fb2c'
            : '1494790108377-be9c29b29330'
        }?auto=format&fit=crop&w=150&q=80`
      }
    });

    return res.json(newUser);
  } catch (error) {
    console.error('POST user error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const { id } = req.params;

    if (!authUser || (authUser.role !== 'admin' && authUser.userId !== id)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updateData = req.body;
    
    // Prevent non-admins from promoting roles or access keys
    if (authUser.role !== 'admin') {
      delete updateData.role;
      delete updateData.accessKey;
      delete updateData.assignedComponent;
    }

    const allowedFields = ['name', 'email', 'phone', 'role', 'avatar', 'assignedComponent', 'accessKey'];
    const filteredUpdateData = {};
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        filteredUpdateData[key] = updateData[key];
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: filteredUpdateData
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error('PUT user error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const { id } = req.params;

    if (!authUser || (authUser.role !== 'admin' && authUser.userId !== id)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.user.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    console.error('DELETE user error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ─── RESTAURANT ROUTE HANDLERS ────────────────────────────────────────────────

app.get('/api/restaurants', async (req, res) => {
  try {
    const { cuisine } = req.query;
    let dbRests;
    if (cuisine) {
      dbRests = await prisma.restaurant.findMany({
        where: { cuisine: { contains: String(cuisine) } }
      });
    } else {
      dbRests = await prisma.restaurant.findMany();
    }

    const restaurants = dbRests.map(r => ({
      ...r,
      images: JSON.parse(r.images),
      menu: JSON.parse(r.menu)
    }));

    return res.json(restaurants);
  } catch (error) {
    console.error('GET restaurants API error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.post('/api/restaurants', async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || (authUser.role !== 'admin' && authUser.role !== 'owner')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const restData = req.body;
    const newRest = await prisma.restaurant.create({
      data: {
        id: `rest-${Date.now()}`,
        name: restData.name,
        description: restData.description,
        image: restData.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        images: JSON.stringify(restData.images || []),
        rating: 5.0,
        reviewCount: 0,
        cuisine: restData.cuisine,
        priceRange: restData.priceRange || '$$$',
        location: restData.location,
        address: restData.address,
        phone: restData.phone,
        email: restData.email,
        openingHours: restData.openingHours || '17:00 - 23:00',
        featured: restData.featured || false,
        ownerId: authUser.userId,
        menu: JSON.stringify(restData.menu || [])
      }
    });

    const formatted = {
      ...newRest,
      images: JSON.parse(newRest.images),
      menu: JSON.parse(newRest.menu)
    };

    return res.json(formatted);
  } catch (error) {
    console.error('POST restaurant API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/restaurants/:id', async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({ where: { id } });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (!authUser || (authUser.role !== 'admin' && authUser.userId !== restaurant.ownerId)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updateData = req.body;
    const allowedFields = ['name', 'description', 'image', 'cuisine', 'priceRange', 'location', 'address', 'phone', 'email', 'openingHours', 'featured'];
    const filteredUpdateData = {};

    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        filteredUpdateData[key] = updateData[key];
      }
    }

    if (updateData.images) filteredUpdateData.images = JSON.stringify(updateData.images);
    if (updateData.menu) filteredUpdateData.menu = JSON.stringify(updateData.menu);

    const updated = await prisma.restaurant.update({
      where: { id },
      data: filteredUpdateData
    });

    const formatted = {
      ...updated,
      images: JSON.parse(updated.images),
      menu: JSON.parse(updated.menu)
    };

    return res.json(formatted);
  } catch (error) {
    console.error('PUT restaurant API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ─── BOOKINGS ROUTE HANDLERS ──────────────────────────────────────────────────

app.get('/api/bookings', async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
    }

    let dbBookings;
    if (authUser.role === 'customer') {
      dbBookings = await prisma.booking.findMany({
        where: { customerId: authUser.userId }
      });
    } else {
      dbBookings = await prisma.booking.findMany();
    }

    const bookings = dbBookings.map(b => ({
      ...b,
      tableNumber: b.tableNumber || undefined,
      specialRequests: b.specialRequests || undefined,
      preOrderItems: b.preOrderItems ? JSON.parse(b.preOrderItems) : undefined
    }));

    return res.json(bookings);
  } catch (error) {
    console.error('GET bookings error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
    }

    const { bookingData } = req.body;
    if (!bookingData) {
      return res.status(400).json({ error: 'bookingData is required.' });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: authUser.userId } });
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: bookingData.restaurantId } });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const newBooking = await prisma.booking.create({
      data: {
        id: `res-${Math.floor(100 + Math.random() * 900)}`,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
        customerId: dbUser.id,
        customerName: dbUser.name,
        customerEmail: dbUser.email,
        customerPhone: dbUser.phone,
        date: bookingData.date,
        time: bookingData.time,
        guests: parseInt(bookingData.guests),
        status: 'pending',
        createdAt: new Date().toISOString(),
        specialRequests: bookingData.specialRequests || null,
        preOrderItems: bookingData.preOrderItems ? JSON.stringify(bookingData.preOrderItems) : null
      }
    });

    const formatted = {
      ...newBooking,
      tableNumber: newBooking.tableNumber || undefined,
      specialRequests: newBooking.specialRequests || undefined,
      preOrderItems: newBooking.preOrderItems ? JSON.parse(newBooking.preOrderItems) : undefined
    };

    // Send Booking Confirmation Email (async non-blocking)
    sendBookingConfirmationEmail(formatted).catch(err =>
      console.error('[Bookings API] Booking email failed:', err)
    );

    return res.json(formatted);
  } catch (error) {
    console.error('POST booking error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const { id } = req.params;

    if (!authUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status, tableNumber } = req.body;
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Role verification
    if (authUser.role === 'customer' && authUser.userId !== booking.customerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: status || booking.status,
        tableNumber: tableNumber !== undefined ? tableNumber : booking.tableNumber
      }
    });

    const formatted = {
      ...updated,
      tableNumber: updated.tableNumber || undefined,
      specialRequests: updated.specialRequests || undefined,
      preOrderItems: updated.preOrderItems ? JSON.parse(updated.preOrderItems) : undefined
    };

    return res.json(formatted);
  } catch (error) {
    console.error('PUT booking error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const { id } = req.params;

    if (!authUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (authUser.role !== 'admin' && authUser.role !== 'owner' && authUser.userId !== booking.customerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.booking.update({
      where: { id },
      data: { status: 'cancelled' }
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('DELETE booking error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ─── TABLES ROUTE HANDLERS ────────────────────────────────────────────────────

app.get('/api/tables', async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tables = await prisma.restaurantTable.findMany();
    return res.json(tables);
  } catch (error) {
    console.error('GET tables error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/tables', async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || (authUser.role !== 'admin' && authUser.role !== 'owner' && authUser.role !== 'worker')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tableData = req.body;
    const newTable = await prisma.restaurantTable.create({
      data: {
        id: `tbl-${Date.now()}`,
        restaurantId: tableData.restaurantId,
        number: tableData.number,
        capacity: parseInt(tableData.capacity),
        status: 'available'
      }
    });

    return res.json(newTable);
  } catch (error) {
    console.error('POST table error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/tables/:id', async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const { id } = req.params;

    if (!authUser || (authUser.role !== 'admin' && authUser.role !== 'owner' && authUser.role !== 'worker')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.restaurantTable.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    console.error('DELETE table error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ─── REVIEWS ROUTE HANDLERS ───────────────────────────────────────────────────

app.get('/api/restaurants/reviews', async (req, res) => {
  try {
    const { restaurantId } = req.query;
    let reviews;
    if (restaurantId) {
      reviews = await prisma.review.findMany({ where: { restaurantId: String(restaurantId) } });
    } else {
      reviews = await prisma.review.findMany();
    }
    return res.json(reviews);
  } catch (error) {
    console.error('GET reviews error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/restaurants/reviews', async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
    }

    const { restaurantId, rating, comment } = req.body;
    if (!restaurantId || !rating || !comment) {
      return res.status(400).json({ error: 'restaurantId, rating, and comment are required.' });
    }

    const newReview = await prisma.review.create({
      data: {
        id: `rev-${Date.now()}`,
        restaurantId,
        userName: authUser.email.split('@')[0], // Fallback if name not passed
        rating: parseInt(rating),
        comment,
        date: new Date().toLocaleDateString('en-CA')
      }
    });

    // Update restaurant review count and rating
    const allReviews = await prisma.review.findMany({ where: { restaurantId } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: allReviews.length
      }
    });

    return res.json(newReview);
  } catch (error) {
    console.error('POST review error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Boot listener
app.listen(PORT, () => {
  console.log(`🚀 CyanReserve backend server running on http://localhost:${PORT}`);
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', version: '2' }));

