/**
 * Automatically adjusts the Prisma datasource provider between PostgreSQL (Vercel/Production)
 * and SQLite (Local Development) based on the DATABASE_URL environment variable.
 * Also ensures Prisma Client is generated without failing when Windows file-locks the engine DLL.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

  let schemaChanged = false;
  if (content !== updatedContent) {
    fs.writeFileSync(schemaPath, updatedContent, 'utf8');
    schemaChanged = true;
    console.log(`[prepare-prisma] Updated Prisma datasource provider to: "${targetProvider}"`);
  } else {
    console.log(`[prepare-prisma] Prisma datasource provider already set to: "${targetProvider}"`);
  }

  // Check if Prisma Client exists
  const clientLocations = [
    path.join(__dirname, '..', '..', 'node_modules', '.prisma', 'client', 'index.js'),
    path.join(__dirname, '..', 'node_modules', '.prisma', 'client', 'index.js'),
  ];
  const clientExists = clientLocations.some((loc) => fs.existsSync(loc));

  if (schemaChanged || !clientExists) {
    console.log('[prepare-prisma] Generating Prisma client...');
    try {
      execSync('npx prisma generate', {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
      });
    } catch (err) {
      if (clientExists) {
        console.warn(
          '[prepare-prisma] Notice: Could not re-generate Prisma engine (file locked by active process). Using existing generated client.'
        );
      } else {
        throw err;
      }
    }
  }
}

preparePrisma();
