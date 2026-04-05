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

// ✅ CORS - Production URL
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://taskmaster-mern-git-main-alishaayyyys-projects.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ DB Connection (with error handling)
try {
  connectDB();
  console.log('✅ DB Connection Initiated');
} catch (err) {
  console.error('❌ DB Connection Error:', err);
}

// ✅ Routes
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'TaskMaster API is LIVE! 🚀',
    status: 'success',
    timestamp: new Date().toISOString()
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
    error: 'Route not found 😅',
    path: req.originalUrl 
  });
});

// ✅ Export for Vercel
export default app;

// Localhost ke liye (Development)
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`🌐 API URL: http://localhost:${port}`);
  });

  process.on('SIGTERM', () => {
    server.close(() => console.log('Process terminated'));
  });
}