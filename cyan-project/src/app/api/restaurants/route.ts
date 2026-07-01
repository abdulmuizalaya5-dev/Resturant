import { NextResponse } from 'next/server';
import prisma from '@/services/prisma';
import { seedPrismaIfNeeded } from '../dbHelper';
import { getAuthUser } from '@/services/jwt';

export async function GET() {
  try {
    await seedPrismaIfNeeded();
    const dbRests = await prisma.restaurant.findMany();
    const restaurants = dbRests.map(r => ({
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
    }));
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('GET restaurants API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || (authUser.role !== 'owner' && authUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized: Owner or Admin access required.' }, { status: 401 });
    }

    const { restaurantData } = await request.json();
    if (!restaurantData.name) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    const newRestaurant = await prisma.restaurant.create({
      data: {
        id: `rest-${Date.now()}`,
        name: restaurantData.name,
        description: restaurantData.description || '',
        image: restaurantData.image || '',
        images: JSON.stringify([restaurantData.image || '']),
        cuisine: restaurantData.cuisine || '',
        priceRange: restaurantData.priceRange || '$$',
        location: restaurantData.location || '',
        address: restaurantData.address || '',
        phone: restaurantData.phone || '',
        email: restaurantData.email || '',
        openingHours: restaurantData.openingHours || '',
        featured: restaurantData.featured || false,
        ownerId: authUser.userId,
        menu: JSON.stringify(restaurantData.menu || [])
      }
    });

    const formatted = {
      ...newRestaurant,
      images: JSON.parse(newRestaurant.images),
      menu: JSON.parse(newRestaurant.menu)
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('POST restaurant API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const updatedRest = await request.json();
    if (!updatedRest.id) {
      return NextResponse.json({ error: 'Restaurant id is required for updates.' }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: updatedRest.id } });
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found.' }, { status: 404 });
    }

    if (authUser.role !== 'admin' && restaurant.ownerId !== authUser.userId) {
      return NextResponse.json({ error: 'Unauthorized: Only the restaurant owner can perform updates.' }, { status: 401 });
    }

    const { id, images, menu, ownerId, ...scalarFields } = updatedRest;
    const updateData: any = { ...scalarFields };

    if (images !== undefined) {
      updateData.images = JSON.stringify(images);
    }
    if (menu !== undefined) {
      updateData.menu = JSON.stringify(menu);
    }

    const newDbRest = await prisma.restaurant.update({
      where: { id },
      data: updateData
    });

    const formatted = {
      ...newDbRest,
      images: JSON.parse(newDbRest.images),
      menu: JSON.parse(newDbRest.menu)
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('PUT restaurant API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
