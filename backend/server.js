
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectCloudinary from "./config/cloudinary.js";
import connectDB from "./config/mongodb.js";

// import doctorModel from './models/doctorModel.js'
console.log("CLOUD NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API KEY:", process.env.CLOUDINARY_API_KEY);
console.log("SECRET:", process.env.CLOUDINARY_API_SECRET);
console.log("CLOUDINARY_URL:", process.env.CLOUDINARY_URL); 
connectCloudinary();

const app = express();
const port = process.env.PORT || 4000;

connectDB();





// middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174","http://localhost:5175","http://localhost:5176","http://localhost:5177"],
    credentials: true
}));

// routes
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID)
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET)




app.listen(port, () => {
    console.log("Server started on port:", port);
});