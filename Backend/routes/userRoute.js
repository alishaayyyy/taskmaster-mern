import express from 'express';
import{getCurrentUser,login,signup,updateProfile,updatePassword}from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
const userRouter = express.Router();

// -----------every  one can accccess routes----------------------------------------

userRouter.post('/register',signup);
userRouter.post('/login',login);

// -----------Private routes-------------------
// -----------For protecitng them we have to add middleware -----------------------------

userRouter.get('/me',authMiddleware, getCurrentUser);
userRouter.put('/profile',authMiddleware, updateProfile);
userRouter.put('/password',authMiddleware, updatePassword);

export default userRouter;