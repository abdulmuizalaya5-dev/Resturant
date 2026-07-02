const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

let dbUrl = process.env.DATABASE_URL;

const bundledDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
// Check if we are in a read-only environment (like Vercel serverless)
const isVercel = process.env.VERCEL || !fs.existsSync(path.join(process.cwd(), '.env'));

if (isVercel) {
  // Ignore Vercel environment DATABASE_URL because it's either invalid or unsupported for SQLite
  const tmpDbPath = '/tmp/dev.db';
  if (!fs.existsSync(tmpDbPath)) {
    try {
      if (fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, tmpDbPath);
      }
    } catch (err) {
      console.error('Failed to copy DB to /tmp:', err);
    }
  }
  try {
    // Always ensure it's writable, even if left over from a previous warm boot
    fs.chmodSync(tmpDbPath, 0o666);
  } catch (e) {}
    dbUrl = `file:///${tmpDbPath.replace(/^\//, '')}`;
} else if (!dbUrl) {
  dbUrl = `file:${bundledDbPath}`;
}

// CRITICAL: Prisma's Rust engine automatically reads process.env.DATABASE_URL.
// If the user added invalid quotes in the Vercel dashboard, Prisma crashes.
// We must DELETE the environment variable so Prisma safely ignores it and uses the hardcoded fallback which we override!
delete process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

module.exports = prisma;
