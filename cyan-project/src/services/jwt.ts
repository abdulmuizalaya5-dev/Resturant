import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'cyan-reserve-jwt-secret-key-1234567890'
);

export async function signToken(payload: { userId: string; email: string; role: string; name?: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; email: string; role: string; name?: string };
  } catch (err) {
    return null;
  }
}

export async function getAuthUser(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.substring(7);
    return verifyToken(token);
  } catch (err) {
    return null;
  }
}
