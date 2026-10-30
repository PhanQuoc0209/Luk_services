import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Global Middleware
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/monorepo for seamless pairing
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Health & Root Info Endpoints
app.get('/', (req, res) => {
  res.json({
    name: 'LUK Services Backend API',
    version: '1.0.0',
    status: 'online',
    framework: 'Express + Prisma',
    endpoints: {
      health: '/api/health',
      services: '/api/services',
      categories: '/api/categories',
      debate: '/api/debate',
      orderTracking: '/api/orders/track/:orderCode',
    },
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const serviceCount = await prisma.service.count();
    res.json({
      status: 'ok',
      serviceCount,
      database: 'connected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// 3. Services Catalog API
app.get('/api/services', async (req, res) => {
  try {
    const { cat, featured, popular } = req.query;
    const where = { isActive: true };

    if (cat && typeof cat === 'string') {
      where.category = cat;
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (popular === 'true') {
      where.isPopular = true;
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/services/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const service = await prisma.service.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        isActive: true,
      },
    });

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Categories Summary API
app.get('/api/categories', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      select: { category: true },
    });

    const counts = services.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      categories: Object.entries(counts).map(([key, count]) => ({
        key,
        count,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Debate BP & Academic Hub API
app.get('/api/debate', async (req, res) => {
  try {
    const { format, topic } = req.query;
    const where = {};
    if (format && typeof format === 'string') {
      where.format = format;
    }
    if (topic && typeof topic === 'string') {
      where.topic = topic;
    }

    const resources = await prisma.debateResource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: resources.length, resources });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Public Order Tracking
app.get('/api/orders/track/:orderCode', async (req, res) => {
  try {
    const { orderCode } = req.params;
    const order = await prisma.order.findUnique({
      where: { orderCode },
      select: {
        orderCode: true,
        status: true,
        totalAmount: true,
        finalAmount: true,
        createdAt: true,
        updatedAt: true,
        notes: true,
        items: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            service: {
              select: {
                title: true,
                slug: true,
                category: true,
                turnaround: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found on LUK backend server',
    path: req.originalUrl,
  });
});

// 8. Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Backend Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 9. Startup when executed directly (not when imported in tests)
let server = null;
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);

if (isDirectRun) {
  server = app.listen(PORT, () => {
    console.log(`[LUK Backend] Express server running at http://localhost:${PORT}`);
  });
}

export { app, server, prisma };
export default app;
