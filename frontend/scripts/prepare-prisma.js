/**
 * Automatically adjusts the Prisma datasource provider between PostgreSQL (Vercel/Production)
 * and SQLite (Local Development) based on the DATABASE_URL environment variable.
 */
const fs = require('fs');
const path = require('path');

function preparePrisma() {
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    console.warn('[prepare-prisma] schema.prisma not found at:', schemaPath);
    return;
  }

  const content = fs.readFileSync(schemaPath, 'utf8');
  const databaseUrl = (process.env.DATABASE_URL || '').trim();

  // Detect whether PostgreSQL or SQLite
  const isPostgres = databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://');
  const targetProvider = isPostgres ? 'postgresql' : 'sqlite';

  // Replace provider in datasource db
  const updatedContent = content.replace(
    /(datasource\s+db\s*\{[\s\S]*?provider\s*=\s*)"[^"]+"/,
    `$1"${targetProvider}"`
  );

  if (content !== updatedContent) {
    fs.writeFileSync(schemaPath, updatedContent, 'utf8');
    console.log(`[prepare-prisma] Updated Prisma datasource provider to: "${targetProvider}" (DATABASE_URL=${databaseUrl ? databaseUrl.split('@')[0] + '...' : 'empty'})`);
  } else {
    console.log(`[prepare-prisma] Prisma datasource provider already set to: "${targetProvider}"`);
  }
}

preparePrisma();
