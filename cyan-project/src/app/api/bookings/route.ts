import { NextResponse } from 'next/server';
import prisma from '@/services/prisma';
import { seedPrismaIfNeeded } from '../dbHelper';
import { getAuthUser } from '@/services/jwt';
import { sendBookingConfirmationEmail } from '@/services/emailService';

export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    await seedPrismaIfNeeded();

    let dbBookings;
    if (authUser.role === 'customer') {
      dbBookings = await prisma.booking.findMany({
        where: { customerId: authUser.userId }
      });
    } else {
      dbBookings = await prisma.booking.findMany();
    }

    const bookings = dbBookings.map(b => ({
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
    }));
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('GET bookings API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const { bookingData } = await request.json();
    if (!bookingData) {
      return NextResponse.json({ error: 'bookingData is required.' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: authUser.userId } });
    if (!dbUser) {
      return NextResponse.json({ error: 'Authenticated user account not found.' }, { status: 404 });
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: bookingData.restaurantId } });
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const newDbBooking = await prisma.booking.create({
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
      ...newDbBooking,
      tableNumber: newDbBooking.tableNumber || undefined,
      specialRequests: newDbBooking.specialRequests || undefined,
      preOrderItems: newDbBooking.preOrderItems ? JSON.parse(newDbBooking.preOrderItems) : undefined
    };

    // ── Send booking confirmation email via Brevo (non-blocking) ──
    sendBookingConfirmationEmail({
      customerName: formatted.customerName,
      customerEmail: formatted.customerEmail,
      restaurantName: formatted.restaurantName,
      restaurantImage: formatted.restaurantImage || undefined,
      date: formatted.date,
      time: formatted.time,
      guests: formatted.guests,
      id: formatted.id,
      specialRequests: formatted.specialRequests || undefined,
      preOrderItems: formatted.preOrderItems || undefined
    }).catch(err => console.error('[Bookings API] Booking email failed:', err));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('POST booking API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
