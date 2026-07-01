import { NextResponse } from 'next/server';
import prisma from '@/services/prisma';
import { getAuthUser } from '@/services/jwt';

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
    const table = await prisma.restaurantTable.findUnique({ where: { id } });
    if (!table) {
      return NextResponse.json({ error: 'Table layout configuration not found.' }, { status: 404 });
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: table.restaurantId } });
    if (!restaurant) {
      return NextResponse.json({ error: 'Associated restaurant not found.' }, { status: 404 });
    }

    if (authUser.role !== 'admin' && restaurant.ownerId !== authUser.userId) {
      return NextResponse.json({ error: 'Unauthorized: Owner or Admin access required.' }, { status: 401 });
    }

    await prisma.restaurantTable.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE table API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
