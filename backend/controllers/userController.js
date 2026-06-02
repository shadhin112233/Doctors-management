import fs from 'fs';
import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// 🚀 ম্যাজিক লাইন: সার্ভার চালু হওয়ার সাথে সাথে যেন .env ফাইল রিড করতে পারে
import 'dotenv/config'; 

// 💳 রেজরপে ইনস্ট্যান্স গ্লোবালি ইনিশিয়ালাইজ করা হলো
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Api to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({
            success: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Api for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({
                success: true,
                token
            });
        } else {
            res.json({
                success: false,
                message: "Invalid credentials"
            });
        }

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Api to get profile
const getProfile = async (req, res) => {
    try {
        const userId = req.userId; 
        const userData = await userModel.findById(userId).select('-password');

        res.json({
            success: true,
            userData
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Api to update profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId; 
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({
                success: false,
                message: "Required fields missing"
            });
        }

        const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                name,
                phone,
                address: parsedAddress,
                dob,
                gender
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (imageFile) {
            if (!imageFile.buffer) {
                return res.json({
                    success: false,
                    message: "File uploaded but buffer is missing. Please check your multer setup."
                });
            }

            const fileBase64 = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;

            const uploadResult = await cloudinary.uploader.upload(fileBase64, {
                resource_type: "image",
                folder: "prescripto_profiles"
            });

            await userModel.findByIdAndUpdate(userId, {
                image: uploadResult.secure_url
            });
        }

        res.json({
            success: true,
            message: "Profile Updated Successfully"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Api to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body
    const userId = req.userId

    const docData = await doctorModel.findById(docId).select('-password')

    if (!docData.available) {
      return res.json({
        success: false,
        message: 'Doctor Not Available'
      })
    }

    let slots_booked = docData.slots_booked

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: 'Slot Not Available'
        })
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = [slotTime]
    }

    const userData = await userModel.findById(userId).select('-password')

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({
      success: true,
      message: 'Appointment booked'
    })

  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

// Api to get user Appointment
const listAppointment = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId; 

        if (!userId) {
            return res.json({ success: false, message: "User ID not found, authentication failed" });
        }

        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments }); 
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Api to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;

        if (slots_booked && slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
            if (slots_booked[slotDate].length === 0) {
                delete slots_booked[slotDate];
            }
        }

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment cancelled & slot released successfully!' });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// 💳 Api to create payment order
const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({
                success: false,
                message: "Appointment Cancelled or Not Found"
            });
        }

        const options = {
            amount: appointmentData.amount * 100, 
            currency: process.env.CURRENCY || "INR",
            receipt: appointmentId.toString()
        };

        const order = await razorpayInstance.orders.create(options);
        res.json({ success: true, order });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// 🛡️ Api to verify payment securely
// আপনার ব্যাকএন্ড ভেরিফিকেশন কন্ট্রোলার (ဥပမာ: verifyRazorpay)


const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

        // ১. রেজরপে সিগনেচার টেক্সট কম্বিনেশন তৈরি
        const text = razorpay_order_id + "|" + razorpay_payment_id;

        // ২. HMAC SHA256 জেনারেশন
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(text.toString())
            .digest('hex');

        // ৩. সিগনেচার ম্যাচিং চেক
        if (generated_signature === razorpay_signature) {
            
            // 🛠️ সেফটি ফিক্স: ডাটাবেজে 'isPaid' এবং 'payment' দুটো ফিল্ডই একসাথে ট্রু করে দেওয়া হচ্ছে
            await appointmentModel.findByIdAndUpdate(appointmentId, { 
                isPaid: true, 
                payment: true 
            });

            return res.json({ 
                success: true, 
                message: "🎉 পেমেন্ট সফল হয়েছে এবং ডাটাবেজ আপডেট হয়েছে!" 
            });

        } else {
            return res.json({ 
                success: false, 
                message: "পেমেন্ট ভেরিফিকেশন ব্যর্থ হয়েছে (Invalid Signature)" 
            });
        }

    } catch (error) {
        console.error("Backend Verification Error:", error);
        return res.json({ 
            success: false, 
            message: error.message || "সার্ভারে সমস্যা হয়েছে।" 
        });
    }
}




export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay
};