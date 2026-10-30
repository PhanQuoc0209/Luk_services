import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Validates and retrieves the DATABASE_URL environment variable.
 * Emits clear diagnostic instructions when running in production/Vercel without credentials.
 */
function getValidatedDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    const errorNotice =
      '\n=========================================================================\n' +
      '[LUK SERVICES] CRITICAL ENVIRONMENT CONFIGURATION NOTICE:\n' +
      'Missing "DATABASE_URL" environment variable on runtime.\n\n' +
      'To connect your production database on Vercel:\n' +
      '1. Open your Vercel Project Dashboard -> Settings -> Environment Variables\n' +
      '2. Add variable "DATABASE_URL" with your PostgreSQL / Neon / Supabase connection string:\n' +
      '   Example: postgresql://username:password@ep-cool-db.neon.tech/luk_services?sslmode=require\n' +
      '3. Redeploy your project.\n' +
      '=========================================================================\n';

    if (process.env.NODE_ENV === 'production') {
      console.error(errorNotice);
    } else {
      console.warn(errorNotice);
    }
    return undefined;
  }

  return url;
}

/**
 * Creates a resilient PrismaClient instance for serverless production.
 */
export function createPrismaClient(): PrismaClient {
  const dbUrl = getValidatedDatabaseUrl();

  const client = new PrismaClient({
    datasources: dbUrl
      ? {
          db: {
            url: dbUrl,
          },
        }
      : undefined,
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error'],
  });

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
