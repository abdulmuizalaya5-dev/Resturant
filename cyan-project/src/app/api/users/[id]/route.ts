import { NextResponse } from 'next/server';
import prisma from '@/services/prisma';
import { getAuthUser } from '@/services/jwt';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    const { id } = await params;

    if (!authUser || (authUser.role !== 'admin' && authUser.userId !== id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE user API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    const { id } = await params;

    if (!authUser || (authUser.role !== 'admin' && authUser.userId !== id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await request.json();
    
    // Prevent non-admins from updating administrative privileges
    if (authUser.role !== 'admin') {
      delete updateData.role;
      delete updateData.accessKey;
      delete updateData.assignedComponent;
    }

    // Clean up fields to only map database schema definitions
    const allowedFields = ['name', 'email', 'phone', 'role', 'avatar', 'assignedComponent', 'accessKey'];
    const filteredUpdateData: any = {};
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        filteredUpdateData[key] = updateData[key];
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: filteredUpdateData
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('PUT user API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
