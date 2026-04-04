import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';

export default async function authMiddleware(req,res,next){

  const authHeader = req.headers.authorization;

  // ✅ check token
  if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json({
      success:false,
      message: "Not authorized - Token missing"
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // ✅ rename variable (important)
    const user = await userModel
      .findById(payload.id)
      .select('-password');

    if(!user){
      return res.status(401).json({
        success:false,
        message: "User not found"
      });
    }

    req.user = user;   // ✅ correct
    next();

  } catch (err) {
    console.log("JWT verification failed", err);
    return res.status(401).json({
      success:false,
      message: "Invalid or expired token"
    });
  }
}