import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [atoken, setAtoken] = useState(
        localStorage.getItem("aToken") || ""
    );

    const [doctors, setDoctors] = useState([]);

    const [appointments, setAppointments] = useState([])

    const [dashdata, setDashdata] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Get all doctors
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/all-doctors",
                {},
                { headers: { atoken } }
            );

            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    // Change doctor availability
    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/change-availability",
                { docId },
                { headers: { atoken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };


    const getallAppointments = async () => {



        try {

            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { atoken } })

            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message);

        }

    }

    const cancelAppointment = async (appointmentId) => {

        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { atoken } })
            if (data.success) {
                toast.success(data.message)
                getallAppointments()

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message);

        }

    }

const getdashData = async () => {
    try {
        const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { atoken } })

        if (data.success) {
            // 🛠️ ভুল সংশোধন: ব্যাকএন্ডের সাথে মিলিয়ে ক্যাপিটাল 'D' (dashData) ব্যবহার করা হয়েছে
            setDashdata(data.dashData) 
            console.log("Admin Dashboard Data:", data.dashData)
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        toast.error(error.response?.data?.message || error.message);
    }
}




    const value = {
        atoken,
        setAtoken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability, appointments, setAppointments, getallAppointments, cancelAppointment,
        dashdata,getdashData
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;