const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

let dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  const bundledDbPath = path.join(process.cwd(), 'dev.db');
  // Check if we are in a read-only environment (like Vercel serverless)
  const isVercel = process.env.VERCEL || !fs.existsSync(path.join(process.cwd(), '.env'));
  
  if (isVercel) {
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
    dbUrl = `file:${tmpDbPath}`;
  } else {
    dbUrl = `file:${bundledDbPath}`;
  }
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
