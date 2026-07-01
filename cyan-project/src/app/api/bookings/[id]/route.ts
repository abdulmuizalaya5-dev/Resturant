import { NextResponse } from 'next/server';
import prisma from '@/services/prisma';
import { getAuthUser } from '@/services/jwt';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const { id } = await params;
    const { status, tableNumber } = await request.json();

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Customer ownership check
    if (authUser.role === 'customer' && booking.customerId !== authUser.userId) {
      return NextResponse.json({ error: 'Unauthorized: Booking ownership required.' }, { status: 401 });
    }

    const updateData: any = {};
    if (status !== undefined) {
      // Customers can only cancel their booking
      if (authUser.role === 'customer' && status !== 'cancelled') {
        return NextResponse.json({ error: 'Unauthorized: Customers can only cancel bookings.' }, { status: 403 });
      }
      updateData.status = status;
    }

    if (tableNumber !== undefined) {
      // Customers cannot assign tables
      if (authUser.role === 'customer') {
        return NextResponse.json({ error: 'Unauthorized: Staff access required to assign tables.' }, { status: 403 });
      }
      updateData.tableNumber = tableNumber || null;
    }

    const updatedDbBooking = await prisma.booking.update({
      where: { id },
      data: updateData
    });

    const formatted = {
      ...updatedDbBooking,
      tableNumber: updatedDbBooking.tableNumber || undefined,
      specialRequests: updatedDbBooking.specialRequests || undefined,
      preOrderItems: updatedDbBooking.preOrderItems ? JSON.parse(updatedDbBooking.preOrderItems) : undefined
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('PUT booking status API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Customer ownership check
    if (authUser.role === 'customer' && booking.customerId !== authUser.userId) {
      return NextResponse.json({ error: 'Unauthorized: Booking ownership required.' }, { status: 401 });
    }
    
    const updatedDbBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'cancelled' }
    });

    const formatted = {
      ...updatedDbBooking,
      tableNumber: updatedDbBooking.tableNumber || undefined,
      specialRequests: updatedDbBooking.specialRequests || undefined,
      preOrderItems: updatedDbBooking.preOrderItems ? JSON.parse(updatedDbBooking.preOrderItems) : undefined
    };
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('DELETE booking API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
