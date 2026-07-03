import { NextResponse } from 'next/server';
import prisma from '@/services/prisma';
import { signToken } from '@/services/jwt';
import { sendLoginAlertEmail } from '@/services/emailService';

export async function POST(request: Request) {
  try {
    const { email, key, role } = await request.json();
    let authenticatedUser = null;

    if (role === 'admin') {
      if (!key) {
        return NextResponse.json({ success: false, error: 'Access key is required for administrator login.' }, { status: 400 });
      }
      if (key !== 'cyan-admin-secret' && key !== 'CYAN-ADMIN-99') {
        return NextResponse.json({ success: false, error: 'Invalid Administrator Access Key.' }, { status: 401 });
      }
      
      let adminUser = await prisma.user.findFirst({ where: { role: 'admin' } });
      if (!adminUser) {
        adminUser = await prisma.user.create({
          data: {
            id: 'usr-admin',
            name: 'Alexander Wright',
            email: 'admin@cyanreserve.com',
            phone: '+1 (555) 000-1111',
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
          }
        });
      }
      authenticatedUser = adminUser;
    } else if (role === 'worker') {
      if (!key) {
        return NextResponse.json({ success: false, error: 'Access Key is required for staff login.' }, { status: 400 });
      }
      const workerUser = await prisma.user.findFirst({ where: { role: 'worker', accessKey: key } });
      if (!workerUser) {
        return NextResponse.json({ success: false, error: 'No Staff Worker account found with this access key.' }, { status: 401 });
      }
      authenticatedUser = workerUser;
    } else if (role === 'owner') {
      if (!email) {
        return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
      }
      const lowerEmail = email.toLowerCase();
      let ownerUser = await prisma.user.findFirst({ where: { email: lowerEmail, role: 'owner' } }) 
                      || await prisma.user.findFirst({ where: { role: 'owner' } });
                      
      if (!ownerUser) {
        ownerUser = await prisma.user.create({
          data: {
            id: 'usr-2',
            name: 'Chef Marco Rossi',
            email: lowerEmail,
            phone: '+1 (555) 987-6543',
            role: 'owner',
            avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80'
          }
        });
      }
      authenticatedUser = ownerUser;
    } else {
      // Customer
      if (!email) {
        return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
      }
      const lowerEmail = email.toLowerCase();
      let customerUser = await prisma.user.findFirst({ where: { email: lowerEmail, role: 'customer' } });
      if (!customerUser) {
        customerUser = await prisma.user.create({
          data: {
            id: `usr-${Date.now()}`,
            name: email.split('@')[0],
            email: lowerEmail,
            phone: '+1 (555) 555-5555',
            role: 'customer'
          }
        });
      }
      authenticatedUser = customerUser;
    }

    if (!authenticatedUser) {
      return NextResponse.json({ success: false, error: 'Authentication failed.' }, { status: 401 });
    }

    const token = await signToken({
      userId: authenticatedUser.id,
      email: authenticatedUser.email,
      role: authenticatedUser.role
    });

    // Send login alert email (async non-blocking)
    sendLoginAlertEmail({
      name: authenticatedUser.name,
      email: authenticatedUser.email,
      role: authenticatedUser.role
    }).catch(err => console.error('[Login Alert] Email failed:', err));

    return NextResponse.json({ success: true, user: authenticatedUser, token });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
