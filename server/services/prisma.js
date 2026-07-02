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
  dbUrl = `file:${tmpDbPath}`;
} else if (!dbUrl) {
  dbUrl = `file:${bundledDbPath}`;
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

module.exports = prisma;
