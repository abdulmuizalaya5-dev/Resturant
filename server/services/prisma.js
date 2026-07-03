// CRITICAL: We must delete process.env.DATABASE_URL before requiring PrismaClient
// if it's not a SQLite URL (e.g. MongoDB URL from Vercel settings), to prevent validation crashes.
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
  delete process.env.DATABASE_URL;
}

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

let dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.startsWith('"') && dbUrl.endsWith('"')) {
  dbUrl = dbUrl.slice(1, -1);
}

const bundledDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
// Check if we are in a read-only environment (like Vercel serverless)
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV || process.env.VERCEL_REGION || !fs.existsSync(path.join(process.cwd(), '.env'));

if (isVercel) {
  // Ignore Vercel environment DATABASE_URL because it's either invalid or unsupported for SQLite
  const tmpDbPath = '/tmp/dev.db';
  try {
    if (fs.existsSync(bundledDbPath)) {
      fs.copyFileSync(bundledDbPath, tmpDbPath);
      console.log('Successfully copied fresh DB to /tmp');
    } else {
      console.error('Bundled DB path does not exist:', bundledDbPath);
    }
  } catch (err) {
    console.error('Failed to copy DB to /tmp:', err);
  }
  try {
    // Always ensure it's writable, even if left over from a previous warm boot
    fs.chmodSync(tmpDbPath, 0o666);
  } catch (e) {}
    dbUrl = `file:${tmpDbPath}`; // use file:/tmp/dev.db instead of file:///
} else if (!dbUrl) {
  dbUrl = `file:${bundledDbPath}`;
}

// We must DELETE the environment variable so Prisma safely ignores it and uses our runtime datasource override!
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
