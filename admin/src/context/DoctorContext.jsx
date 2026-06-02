import { createContext } from "react";
import { useState} from "react"
import axios from 'axios';
import {toast} from 'react-toastify'


export const DoctorContext = createContext()


const DoctorContextProvider = (props) =>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState('')
    const [appointments, setAppointments] = useState([])

    const [profileData, setProfileData] = useState(false)

    const [dashdata, setDashdata] = useState(false)

    const getAppointments = async () =>{
        try {
            const { data} = await axios.get(backendUrl + '/api/doctor/appointments', {headers:{dToken}})
            if(data.success){
                setAppointments(data.appointments)
                console.log(data.appointments)
            }else{
                toast.error(data.message)
            }
        }catch (error) {
            console.log(error);
            toast.error("Failed to fetch appointments")
        }
    }

    const completeAppointment = async (appointmentId) =>{

        try {
            const { data} = await axios.post(backendUrl + '/api/doctor/complete-appointment', {appointmentId}, {headers:{dToken}})

            if(data.success){
                toast.success(data.message)
                getAppointments()
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch appointments")
        }

    }





     const cancelAppointment = async (appointmentId) =>{

        try {
            const { data} = await axios.post(backendUrl + '/api/doctor/cancel-appointment', {appointmentId}, {headers:{dToken}})

            if(data.success){
                toast.success(data.message)
                getAppointments()
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch appointments")
        }

    }
const getdashData = async () => {
    try {
        // axios.post বদলে axios.get ব্যবহার করুন এবং দ্বিতীয় প্যারামিটারে সরাসরি headers দিন
        const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })
        
        if (data.success) {
            setDashdata(data.dashData)
            console.log(data.dashData)
        } else {
            toast.error(data.message)
        }
    } catch (error) {
         console.log(error);
         toast.error("Failed to fetch dashboard data") // মেসেজটি ঠিক করে দেওয়া হলো
    }
}

const getProfileData = async() =>{
    try {

        const { data} = await axios.get(backendUrl + '/api/doctor/profile', {headers:{dToken}})

        if(data.success){
            setProfileData(data.profileData)
            console.log(data.profileData)
        }




    } catch (error) {
        console.log(error);
        toast.error(error.message)
    }
}

    const value = {
        dToken,setDToken,backendUrl,appointments,setAppointments,getAppointments,
        completeAppointment,cancelAppointment,
        dashdata, setDashdata, getdashData,profileData, setProfileData, getProfileData

    }

    return(
        <DoctorContext.Provider value={value}>
            {props.children}

        </DoctorContext.Provider>
    )

}

export default DoctorContextProvider


