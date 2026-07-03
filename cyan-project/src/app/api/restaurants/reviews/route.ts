import { NextResponse } from 'next/server';
import prisma from '@/services/prisma';
import { seedPrismaIfNeeded } from '../../dbHelper';
import { getAuthUser } from '@/services/jwt';

export async function GET() {
  try {
    await seedPrismaIfNeeded();
    const reviews = await prisma.review.findMany();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('GET reviews API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const { restaurantId, rating, comment } = await request.json();
    if (!restaurantId || !rating) {
      return NextResponse.json({ error: 'restaurantId and rating are required.' }, { status: 400 });
    }

    let dbUser = await prisma.user.findUnique({ where: { id: authUser.userId } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: authUser.userId,
          name: authUser.name || authUser.email.split('@')[0],
          email: authUser.email,
          phone: '+1 (555) 555-5555',
          role: authUser.role || 'customer',
        },
      });
    }

    const newReview = await prisma.review.create({
      data: {
        id: `rev-${Date.now()}`,
        restaurantId,
        userName: dbUser.name,
        userAvatar: dbUser.avatar || null,
        rating: parseInt(rating),
        comment: comment || '',
        date: new Date().toISOString().split('T')[0]
      }
    });

    // Recalculate restaurant score
    const rest = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (rest) {
      const newReviewCount = rest.reviewCount + 1;
      const newRating = parseFloat(((rest.rating * rest.reviewCount + parseInt(rating)) / newReviewCount).toFixed(1));
      
      await prisma.restaurant.update({
        where: { id: restaurantId },
        data: {
          rating: newRating,
          reviewCount: newReviewCount
        }
      });
    }

    return NextResponse.json(newReview);
  } catch (error) {
    console.error('POST review API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
