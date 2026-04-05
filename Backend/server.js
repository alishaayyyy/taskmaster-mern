import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';

const app = express();
const port = process.env.PORT || 3000;

// ✅ Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',  
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));

// ✅ DB Connection
connectDB();

// ✅ Routes
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);

app.get('/', (req, res) => {
  res.json({ 
    message: 'TaskMaster API is LIVE! 🚀',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`🌐 API URL: http://localhost:${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});