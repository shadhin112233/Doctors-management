import { DoctorContext } from "../../context/DoctorContext"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../context/AppContext"
import axios from "axios"
import { toast } from "react-toastify"

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData } = useContext(DoctorContext)
  const { currency, backendUrl } = useContext(AppContext)

  // একটিভ ইউআরএল ডিফাইন করা (যদি কনটেক্সট থেকে আনডিফাইন্ড আসে তবে লোকালহোস্ট ৪০০০ ব্যবহার করবে)
  const activeBackendUrl = backendUrl || "http://localhost:4000"

  // Edit Mode এবং Form State ম্যানেজ করার জন্য
  const [isEdit, setIsEdit] = useState(false)
  const [formData, setFormData] = useState({
    fees: "",
    available: true,
    address: "" 
  })

  // প্রোফাইল ডাটা লোড করার জন্য প্রথম ইফেক্ট
  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  // প্রোফাইল ডাটা স্টেট-এ সেট করার জন্য দ্বিতীয় ইফেক্ট
  useEffect(() => {
    if (profileData) {
      let formattedAddress = ""
      
      // অ্যাড্রেস যদি অবজেক্ট আকারে আসে (যেমন MERN স্ট্যাকের প্রজেক্টে সাধারণত হয়)
      if (typeof profileData.address === 'object' && profileData.address !== null) {
        formattedAddress = profileData.address.line1 
          ? `${profileData.address.line1}${profileData.address.line2 ? ', ' + profileData.address.line2 : ''}`
          : JSON.stringify(profileData.address)
      } else {
        formattedAddress = profileData.address || ""
      }

      setFormData({
        fees: profileData.fees || "",
        available: profileData.available ?? true,
        address: formattedAddress
      })
    }
  }, [profileData])

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // ডাটাবেজে আপডেট ডাটা সেভ করার ফাংশন
  const updateProfile = async () => {
    try {
      // ব্যাকএন্ডের রিকোয়ারমেন্ট অনুযায়ী অ্যাড্রেস ফরম্যাট করা
      let finalAddress = formData.address
      if (profileData && typeof profileData.address === 'object' && profileData.address !== null) {
        finalAddress = {
          line1: formData.address.split(',')[0]?.trim() || formData.address,
          line2: formData.address.split(',')[1]?.trim() || ""
        }
      }

      const payload = {
        fees: Number(formData.fees),
        available: formData.available,
        address: finalAddress
      }

      const { data } = await axios.post(
        `${activeBackendUrl}/api/doctor/update-profile`, 
        payload, 
        { headers: { dToken } }
      )

      if (data.success) {
        toast.success("Profile Updated Successfully!")
        setIsEdit(false)
        getProfileData() // ডাটাবেজ থেকে ফ্রেশ ডাটা রিলোড হবে
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message || "Something went wrong!")
    }
  }

  return profileData && (
    <div className="m-5 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        {/* প্রোফাইল ইমেজ এবং ফিক্সড বেসিক ইনফো */}
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start border-b pb-6">
          <img 
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-sm" 
            src={profileData.image} 
            alt="Doctor" 
          />
          <div className="flex-1 text-center sm:text-left space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">{profileData.name}</h2>
            <p className="text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full inline-block text-sm">
              {profileData.specialization}
            </p>
            <p className="text-gray-500 text-sm">Email: {profileData.email}</p>
            <p className="text-gray-500 text-sm">Phone: {profileData.phone || "N/A"}</p>
          </div>
        </div>

        {/* ডিটেইলস সেকশন (যা ব্যাকএন্ড কন্ট্রোলারে সেভ হবে) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          
          {/* ভিজিট বা ফিস */}
          <div className="flex flex-col gap-1">
            <span className="text-gray-400 text-sm font-medium">Appointment Fees</span>
            {isEdit ? (
              <div className="flex items-center border rounded-md px-2 focus-within:ring-1 focus-within:ring-indigo-500">
                <span className="text-gray-500 mr-1">{currency || "$"}</span>
                <input 
                  type="number" 
                  name="fees" 
                  value={formData.fees} 
                  onChange={handleInputChange} 
                  className="w-full p-2 focus:outline-none"
                />
              </div>
            ) : (
              <p className="text-gray-700 font-medium">{currency || "$"}{profileData.fees}</p>
            )}
          </div>

          {/* অ্যাড্রেস বা ঠিকানা */}
          <div className="flex flex-col gap-1">
            <span className="text-gray-400 text-sm font-medium">Address</span>
            {isEdit ? (
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                className="border p-2 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter address (e.g. Floor 2, Green Road)"
              />
            ) : (
              <p className="text-gray-700 font-medium">
                {typeof profileData.address === 'object' && profileData.address !== null
                  ? `${profileData.address.line1 || ""} ${profileData.address.line2 ? ', ' + profileData.address.line2 : ""}`
                  : profileData.address || "N/A"}
              </p>
            )}
          </div>

          {/* অ্যাভেইল্যাবিলিটি স্ট্যাটাস */}
          <div className="flex items-center gap-2 md:col-span-2 bg-gray-50 p-3 rounded-lg">
            <input 
              type="checkbox" 
              name="available" 
              id="available"
              checked={formData.available} 
              disabled={!isEdit}
              onChange={handleInputChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer disabled:opacity-70"
            />
            <label htmlFor="available" className="text-gray-700 font-medium text-sm cursor-pointer select-none">
              Available for Appointments
            </label>
          </div>
        </div>

        {/* অ্যাকশন বাটন সমূহ */}
        <div className="flex justify-end gap-3 mt-6 border-t pt-4">
          {isEdit ? (
            <>
              <button 
                onClick={() => setIsEdit(false)} 
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={updateProfile} 
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all text-sm font-medium"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEdit(true)} 
              className="px-6 py-2 bg-gray-800 hover:bg-gray-950 text-white rounded-lg shadow-sm transition-all text-sm font-medium"
            >
              Edit Profile
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default DoctorProfile