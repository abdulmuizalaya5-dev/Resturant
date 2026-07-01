import { NextResponse } from 'next/server';
import prisma from '@/services/prisma';
import { signToken } from '@/services/jwt';
import { sendWelcomeEmail } from '@/services/emailService';

export async function POST(request: Request) {
  try {
    const { name, email, phone, role } = await request.json();
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    const lowerEmail = email.toLowerCase().trim();

    // Check for duplicate email
    const existingUser = await prisma.user.findFirst({ where: { email: lowerEmail } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: lowerEmail,
        phone: phone || '+1 (555) 555-5555',
        role: role || 'customer',
        avatar: `https://images.unsplash.com/photo-${
          role === 'owner'
            ? '1577219491135-ce391730fb2c'
            : '1494790108377-be9c29b29330'
        }?auto=format&fit=crop&w=150&q=80`,
      },
    });

    // Sign JWT
    const token = await signToken({
      userId: newUser.id,
      email:  newUser.email,
      role:   newUser.role,
    });

    // ── Send welcome email via Brevo (non-blocking – don't fail registration if email errors) ──
    sendWelcomeEmail({
      name:  newUser.name,
      email: newUser.email,
      role:  newUser.role,
    }).catch(err => console.error('[Register] Welcome email failed:', err));

    return NextResponse.json({ success: true, user: newUser, token });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
