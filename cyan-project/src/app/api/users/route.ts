import { NextResponse } from 'next/server';
import prisma from '@/services/prisma';
import { seedPrismaIfNeeded } from '../dbHelper';
import { getAuthUser } from '@/services/jwt';

export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    await seedPrismaIfNeeded();
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('GET users API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const userData = await request.json();
    if (!userData.name || !userData.email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
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

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('POST user API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
