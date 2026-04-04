import express from 'express'
import cors from 'cors';
import 'dotenv/config'
// import { connectDB } from './config/db';
import{connectDB} from './config/db.js'
import userRouter from './routes/userRoute.js'
import taskRouter from './routes/taskRoute.js'
const app = express();
const port = process.env.PORT || 3000;

// Middle ware 
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));

// DB connection here
connectDB();

// Routing users
app.use("/api/user", userRouter);
// routing tasks
app.use("/api/tasks", taskRouter);

app.get('/', (req,res)=>{
  res.send('Api is working');
})

app.listen(port, ()=>{
  console.log(`server is working on http://localhost:${port}`)
})