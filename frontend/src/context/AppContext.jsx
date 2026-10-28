import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {

  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Ager bar-er doctor data browser-e save thake, tai site khulei dekha jabe
  const [doctors, setDoctors] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("doctors_cache")) || [];
    } catch {
      return [];
    }
  });
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);

  // Get all doctors (backend ghumiye thakle 3 bar chesta korbe)
  const getDoctorsData = async (attempt = 1) => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");

      if (data.success) {
        setDoctors(data.doctors);
        localStorage.setItem("doctors_cache", JSON.stringify(data.doctors));
        setDoctorsLoading(false);
      } else {
        toast.error(data.message);
        setDoctorsLoading(false);
      }

    } catch (error) {
      console.log(error);
      if (attempt < 3) {
        // Render server jagte somoy lage, tai toast na diye abar chesta
        setTimeout(() => getDoctorsData(attempt + 1), 4000);
      } else {
        toast.error(error.message);
        setDoctorsLoading(false);
      }
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } });

      if (data.success) {
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

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null);
    }
  }, [token]);

  const value = {
    doctors, getDoctorsData,
    setDoctors,
    doctorsLoading,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;