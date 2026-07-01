import { NextResponse } from 'next/server';
import prisma from '@/services/prisma';
import { seedPrismaIfNeeded } from '../dbHelper';
import { getAuthUser } from '@/services/jwt';

export async function GET() {
  try {
    await seedPrismaIfNeeded();
    const tables = await prisma.restaurantTable.findMany();
    return NextResponse.json(tables);
  } catch (error) {
    console.error('GET tables API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const tableData = await request.json();
    if (!tableData.restaurantId || !tableData.number || !tableData.capacity) {
      return NextResponse.json({ error: 'restaurantId, number, and capacity are required.' }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: tableData.restaurantId } });
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found.' }, { status: 404 });
    }

    if (authUser.role !== 'admin' && restaurant.ownerId !== authUser.userId) {
      return NextResponse.json({ error: 'Unauthorized: Owner or Admin access required.' }, { status: 401 });
    }

    const newTable = await prisma.restaurantTable.create({
      data: {
        id: `tbl-${Date.now()}`,
        restaurantId: tableData.restaurantId,
        number: tableData.number,
        capacity: parseInt(tableData.capacity),
        status: 'available'
      }
    });

    return NextResponse.json(newTable);
  } catch (error) {
    console.error('POST table API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
