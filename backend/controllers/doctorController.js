import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointmentModel.js";


const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;

        const docData = await doctorModel.findById(docId);

        await doctorModel.findByIdAndUpdate(docId, {
            available: !docData.available
        });

        res.json({
            success: true,
            message: "Availability Changed"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};
const doctorList = async(req,res) =>{
    try {
        const doctors = await doctorModel.find({}).select(['-password','-email'])
    res.json({success:true,doctors})
        
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
        
    }
    

}

//Api for Doctor Login

const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ১. ইমেইল দিয়ে ডক্টর খোঁজা
        const doctor = await doctorModel.findOne({ email });

        // ২. ডক্টর না পাওয়া গেলে
        if (!doctor) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // ৩. পাসওয়ার্ড ম্যাচ করা
        const isMatched = await bcrypt.compare(password, doctor.password);

        if (isMatched) {
            // ৪. টোকেন তৈরি
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.json({ success: true, token });
        } else {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.error("Login Error: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//Api to get Doctor Appointments for Doctor Pannel
const appointmentsDoctor = async (req, res) => {
    try {

        // ফিক্স: req.body এর বদলে সরাসরি মিডলওয়্যার থেকে আসা req.docId ব্যবহার করা হলো
        const docId = req.docId

        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
//Api to the Mark Appointment complited for the Doctor Pannel

// API to mark appointment completed
const appointmentCompleted = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const docId = req.docId // ✅ সরাসরি মিডলওয়্যার থেকে আইডি নেওয়া হলো

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            // Mark the appointment as completed
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true});
            res.json({ success: true, message: "Appointment marked as completed" });
        } else {
            res.json({ success: false, message: "Mark Failed or Unauthorized" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to cancel Appointment for the Doctor Panel
const appointmentCancelled = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const docId = req.docId // ✅ সরাসরি মিডলওয়্যার থেকে আইডি নেওয়া হলো

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            // Mark the appointment as cancelled
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            res.json({ success: true, message: "Appointment cancelled" });
        } else {
            res.json({ success: false, message: "Cancellation Failed or Unauthorized" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//Api to get dashboard data for Doctor pannel

const doctorDashboard = async (req, res) => {
    try {
        // ফিক্সড: সরাসরি req.docId থেকে মানটি নিন, অবজেক্ট ডিস্ট্রাকচারিং করবেন না
        const docId = req.docId; 

        // এখন মঙ্গোডিবিতে সঠিক আইডি দিয়ে কোয়েরি হবে
        const appointments = await appointmentModel.find({ docId });

        let earnings = 0;
        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
        });

        let patients = [];
        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId);
            }
        });

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        };

        res.json({ success: true, dashData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message }); // এরর রেসপন্সও যোগ করে দেওয়া হলো
    }
};


//Api to get doctor profile to doctor panel

// Api to get doctor profile for doctor panel

// Api to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
    try {
        // ফিক্সড: req.body এর বদলে মিডলওয়্যার থেকে আসা req.docId নিন
        const docId = req.docId; 
        
        const profileData = await doctorModel.findById(docId).select('-password');
        res.json({ success: true, profileData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Api to update doctor profile for doctor panel
const updateDoctorProfile = async (req, res) => {
    try {
        // ফিক্সড: docId আসবে মিডলওয়্যার (req.docId) থেকে, বাকিগুলো req.body থেকে
        const docId = req.docId;
        const { fees, address, available } = req.body;
        
        await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
        res.json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
         console.log(error);
         res.json({ success: false, message: error.message });
    }
}
export { changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentCompleted, appointmentCancelled, doctorDashboard, doctorProfile, updateDoctorProfile };



