const prisma = require('./prisma');
const {
  mockUsers,
  mockRestaurants,
  mockBookings,
  mockTables,
  mockReviews
} = require('./mockData');

async function seedPrismaIfNeeded() {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      // Force update restaurant images in case they are missing or broken in the existing DB
      for (const r of mockRestaurants) {
        try {
          await prisma.restaurant.update({
            where: { id: r.id },
            data: {
              image: r.image,
              images: JSON.stringify(r.images),
            }
          });
        } catch (e) {
          console.error("Could not update restaurant image:", e);
        }
      }
      return; // Database already seeded
    }
    
    console.log('Seeding SQLite database with mock data...');

    // Seed Users
    for (const u of mockUsers) {
      await prisma.user.create({
        data: {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          avatar: u.avatar || null,
          assignedComponent: u.assignedComponent || null,
          accessKey: u.accessKey || null
        }
      });
    }

    // Seed Restaurants
    for (const r of mockRestaurants) {
      await prisma.restaurant.create({
        data: {
          id: r.id,
          name: r.name,
          description: r.description,
          image: r.image,
          images: JSON.stringify(r.images),
          rating: r.rating,
          reviewCount: r.reviewCount,
          cuisine: r.cuisine,
          priceRange: r.priceRange,
          location: r.location,
          address: r.address,
          phone: r.phone,
          email: r.email,
          openingHours: r.openingHours,
          featured: r.featured,
          ownerId: r.ownerId,
          menu: JSON.stringify(r.menu)
        }
      });
    }

    // Seed Tables
    for (const t of mockTables) {
      await prisma.restaurantTable.create({
        data: {
          id: t.id,
          restaurantId: t.restaurantId,
          number: t.number,
          capacity: t.capacity,
          status: t.status
        }
      });
    }

    // Seed Bookings
    for (const b of mockBookings) {
      await prisma.booking.create({
        data: {
          id: b.id,
          restaurantId: b.restaurantId,
          restaurantName: b.restaurantName,
          restaurantImage: b.restaurantImage,
          customerId: b.customerId,
          customerName: b.customerName,
          customerEmail: b.customerEmail,
          customerPhone: b.customerPhone,
          date: b.date,
          time: b.time,
          guests: b.guests,
          tableNumber: b.tableNumber || null,
          status: b.status,
          createdAt: b.createdAt,
          specialRequests: b.specialRequests || null,
          preOrderItems: b.preOrderItems ? JSON.stringify(b.preOrderItems) : null
        }
      });
    }

    // Seed Reviews
    for (const rev of mockReviews) {
      await prisma.review.create({
        data: {
          id: rev.id,
          restaurantId: rev.restaurantId,
          userName: rev.userName,
          userAvatar: rev.userAvatar || null,
          rating: rev.rating,
          comment: rev.comment,
          date: rev.date
        }
      });
    }

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Failed to seed SQLite database:', error);
  }
}

module.exports = {
  seedPrismaIfNeeded
};
