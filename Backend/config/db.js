// Connected Data base 
import mongoose from "mongoose";
export const connectDB = async()=>{
 await mongoose.connect('mongodb+srv://alisha:work123@cluster0.yiavo1v.mongodb.net/work123?retryWrites=true&w=majority').then(()=> console.log('DB Connected') );

}