import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {

  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  
  // 🎯 ১. 'userdata' পরিবর্তন করে 'userData' (D বড় হাতের) এবং ইনিশিয়াল ভ্যালু 'null' করা হয়েছে
  const [userData, setUserData] = useState(null);

  // Get all doctors
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      // headers-এ সঠিক উপায়ে টোকেন পাঠানো হচ্ছে
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } });

      if (data.success) {
        // 🎯 ২. ব্যাকএন্ড কন্ট্রোলার থেকে 'userData' (D বড় হাতের) আসছে, তাই এখানেও ঠিক করা হলো
        setUserData(data.userData); 
      } else {
        toast.error(data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Load doctors when app starts
  useEffect(() => {
    getDoctorsData();
  }, []);

  // 🎯 যখনই টোকেন থাকবে, ইউজারের প্রোফাইল ডাটা লোড হবে
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null); // টোকেন না থাকলে প্রোফাইল খালি (null) হয়ে যাবে
    }
  }, [token]);

  // value অবজেক্টে নামগুলো ঠিক করে পাস করা হলো
  const value = {
    doctors,getDoctorsData,
    setDoctors,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,     // 🎯 D বড় হাতের
    setUserData,  // 🎯 D বড় হাতের
    loadUserProfileData
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;