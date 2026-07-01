import prisma from '@/services/prisma';
import { User, Restaurant, Booking, RestaurantTable, Review } from '@/types';
import { mockUsers, mockRestaurants, mockBookings, mockTables, mockReviews } from '@/services/mockData';

export interface DatabaseSchema {
  users: User[];
  restaurants: Restaurant[];
  bookings: Booking[];
  tables: RestaurantTable[];
  reviews: Review[];
}

export async function seedPrismaIfNeeded() {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) return; // Database already seeded
    
    console.log('Seeding MongoDB database with mock data...');

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
    console.error('Failed to seed MongoDB database:', error);
  }
}

export async function readDb(): Promise<DatabaseSchema> {
  await seedPrismaIfNeeded();

  const [dbUsers, dbRests, dbBookings, dbTables, dbReviews] = await Promise.all([
    prisma.user.findMany(),
    prisma.restaurant.findMany(),
    prisma.booking.findMany(),
    prisma.restaurantTable.findMany(),
    prisma.review.findMany()
  ]);

  return {
    users: dbUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role as any,
      avatar: u.avatar || undefined,
      assignedComponent: u.assignedComponent as any,
      accessKey: u.accessKey || undefined
    })),
    restaurants: dbRests.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      image: r.image,
      images: JSON.parse(r.images),
      rating: r.rating,
      reviewCount: r.reviewCount,
      cuisine: r.cuisine,
      priceRange: r.priceRange as any,
      location: r.location,
      address: r.address,
      phone: r.phone,
      email: r.email,
      openingHours: r.openingHours,
      featured: r.featured,
      ownerId: r.ownerId,
      menu: JSON.parse(r.menu)
    })),
    bookings: dbBookings.map(b => ({
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
      tableNumber: b.tableNumber || undefined,
      status: b.status as any,
      createdAt: b.createdAt,
      specialRequests: b.specialRequests || undefined,
      preOrderItems: b.preOrderItems ? JSON.parse(b.preOrderItems) : undefined
    })),
    tables: dbTables.map(t => ({
      id: t.id,
      restaurantId: t.restaurantId,
      number: t.number,
      capacity: t.capacity,
      status: t.status as any
    })),
    reviews: dbReviews.map(rev => ({
      id: rev.id,
      restaurantId: rev.restaurantId,
      userName: rev.userName,
      userAvatar: rev.userAvatar || undefined,
      rating: rev.rating,
      comment: rev.comment,
      date: rev.date
    }))
  };
}

// We write database records individually using Prisma query actions in our route handlers.
// For backwards compatibility and route-handler updates, we define mock writeDb.
export async function writeDb(data: DatabaseSchema): Promise<void> {
  // Not used directly as we write using atomic prisma database operations in endpoint handlers now.
}
