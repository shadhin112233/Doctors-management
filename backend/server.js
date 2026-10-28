import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectCloudinary from "./config/cloudinary.js";
import connectDB from "./config/mongodb.js";

connectCloudinary();

const app = express();
const port = process.env.PORT || 4000;

connectDB();

// middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "https://doctors-management-frontend.onrender.com",
        "https://doctors-management-admin.onrender.com"
    ],
    credentials: true
}));

// UptimeRobot ei route-e ping kore backend jagiye rakhbe
app.get("/", (req, res) => {
    res.status(200).send("API Working");
});
app.get("/ping", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// routes
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
    console.log("Server started on port:", port);
});