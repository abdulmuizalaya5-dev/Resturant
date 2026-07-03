import { NextResponse } from 'next/server';
import prisma from '@/services/prisma';
import { signToken } from '@/services/jwt';
import { sendWelcomeEmail, sendLoginAlertEmail } from '@/services/emailService';

export async function POST(request: Request) {
  try {
    const { token, name, email, avatar, isMock } = await request.json();

    let verifiedEmail = '';
    let verifiedName = '';
    let verifiedAvatar = '';

    if (isMock) {
      // Mock flow for demo/development purposes
      verifiedEmail = email?.toLowerCase().trim();
      verifiedName = name || email?.split('@')[0] || 'Google User';
      verifiedAvatar = avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80';
    } else {
      if (!token) {
        return NextResponse.json({ success: false, error: 'Google ID Token is required.' }, { status: 400 });
      }

      // Verify Google ID Token using Google's OAuth2 API endpoint
      const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
      if (!googleRes.ok) {
        return NextResponse.json({ success: false, error: 'Failed to verify Google Token.' }, { status: 400 });
      }

      const googlePayload = await googleRes.json();
      
      // Ensure the token has not expired and contains the correct fields
      if (!googlePayload.email) {
        return NextResponse.json({ success: false, error: 'Invalid Google Token payload: email missing.' }, { status: 400 });
      }

      verifiedEmail = googlePayload.email.toLowerCase().trim();
      verifiedName = googlePayload.name || verifiedEmail.split('@')[0];
      verifiedAvatar = googlePayload.picture || `https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80`;
    }

    if (!verifiedEmail) {
      return NextResponse.json({ success: false, error: 'Email verification failed.' }, { status: 400 });
    }

    // Check if the user exists in our database
    let user = await prisma.user.findFirst({ where: { email: verifiedEmail } });
    let isNewUser = false;

    if (!user) {
      // Sign Up: Create a new user account
      user = await prisma.user.create({
        data: {
          id: `usr-${Date.now()}`,
          name: verifiedName,
          email: verifiedEmail,
          phone: '+1 (555) 555-5555',
          role: 'customer',
          avatar: verifiedAvatar,
        },
      });
      isNewUser = true;
    }

    // Generate custom JWT token for the user
    const jwtToken = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    if (isNewUser) {
      // Send welcome email (async non-blocking)
      sendWelcomeEmail({
        name: user.name,
        email: user.email,
        role: user.role,
      }).catch(err => console.error('[Google Sign-up] Welcome email failed:', err));
    } else {
      // Send login alert email (async non-blocking)
      sendLoginAlertEmail({
        name: user.name,
        email: user.email,
        role: user.role,
      }).catch(err => console.error('[Google Login Alert] Email failed:', err));
    }

    return NextResponse.json({ success: true, user, token: jwtToken, isNewUser });
  } catch (error) {
    console.error('Google Auth API error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
