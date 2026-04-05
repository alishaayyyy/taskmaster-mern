import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';

const app = express();
const port = process.env.PORT || 3000;

// ✅ Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ CORS - Complete Fix
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://taskmaster-mern-rho.vercel.app',
  'https://taskmaster-mern-git-main-alishaayyyys-projects.vercel.app',
  'https://taskmaster-mern-last.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Sab allow kar dein
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ DB Connection
connectDB().catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
});

// ✅ Routes
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'TaskMaster API is LIVE! 🚀',
    status: 'success',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// ✅ Vercel Serverless Export (ZAROORI)
export default app;

// ✅ Local Development Server (ESM Fix)
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`🌐 API URL: http://localhost:${port}`);
    console.log(`📱 Health: http://localhost:${port}/health`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });
}