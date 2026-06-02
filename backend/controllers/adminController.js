import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import { v2 as cloudinary } from "cloudinary"; // 👈 ইমপোর্টটি ঠিক করা হলো
import validator from "validator";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// Add Doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // কোনো ফিল্ড খালি আছে কিনা চেক করা
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // ইমেইল সঠিক ফরম্যাটে আছে কিনা চেক করা
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // পাসওয়ার্ড শক্তিশালী কিনা চেক করা
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (min 8 chars)" });
        }

        // ইমেজ আপলোড করা হয়েছে কিনা চেক করা
        if (!imageFile) {
            return res.json({ success: false, message: "Please upload a doctor image" });
        }

        // পাসওয়ার্ড হ্যাশ করা
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ক্লাউডিনারিতে ইমেজ আপলোড করা
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        // ডাটাবেজের অবজেক্ট তৈরি (অ্যাড্রেস স্ট্রিং থাকলে অবজেক্টে পার্স করা বা ডিরেক্ট রাখা)
        let parsedAddress = address;
        try {
            parsedAddress = JSON.parse(address);
        } catch (e) {
            parsedAddress = address;
        }

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: parsedAddress,
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: "Doctor Added Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// All Doctors
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select("-password");
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


//Api to get all appointment list

const appointmentsAdmin = async (req,res) =>{
    try {

        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})

        
    } catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message });
        
    }
}

//Api for appointment cancellation
// Api for appointment cancellation (Admin & User Friendly)
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        // ১. অ্যাপয়েন্টমেন্ট ডাটা খুঁজে বের করা
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        // ২. অ্যাপয়েন্টমেন্ট স্ট্যাটাস ক্যানসেলড (true) করে দেওয়া
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // ৩. ডাক্তার ডাটা থেকে বুকড স্লট রিলিজ বা খালি করার লজিক
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        if (doctorData) {
            let slots_booked = doctorData.slots_booked;

            if (slots_booked && slots_booked[slotDate]) {
                // ফিল্টার করে নির্দিষ্ট টাইম স্লটটি রিমুভ করা
                slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
                
                // যদি ওই তারিখে আর কোনো বুকড স্লট না থাকে, তবে ওই ডেট অবজেক্টটি ডিলিট করে দেওয়া
                if (slots_booked[slotDate].length === 0) {
                    delete slots_booked[slotDate];
                }
            }

            // মঙ্গোডিবি-তে নেস্টেড অবজেক্ট নিখুঁতভাবে আপডেট করার জন্য সেফটি মেথড
            doctorData.markModified('slots_booked');
            await doctorData.save();
        }

        res.json({ success: true, message: 'Appointment cancelled & slot released successfully!' });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


//Api to get dashboard for admin pannel

const adminDashboard = async (req,res) =>{
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})

        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments : appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashData})



        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
        
    }
}


export { addDoctor, adminLogin, allDoctors, appointmentsAdmin,appointmentCancel, adminDashboard };