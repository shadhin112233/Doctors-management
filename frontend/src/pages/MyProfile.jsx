import React from 'react'
import { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {

  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false); // নতুন সিলেক্ট করা ইমেজ ফাইল রাখার জন্য

  // 🎯 ডাটাবেজে প্রোফাইল আপডেট করার ফাংশন
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      // টেক্সট ডাটাগুলো formData-তে অ্যাপেন্ড করা হচ্ছে
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('dob', userData.dob);
      formData.append('gender', userData.gender);
      
      // অবজেক্ট ডাটাকে অবশ্যই স্ট্রিংফাই (JSON.stringify) করে পাঠাতে হবে
      formData.append('address', JSON.stringify(userData.address));

      // যদি ইউজার নতুন কোনো ছবি সিলেক্ট করে, তবেই সেটা পাঠানো হবে
      if (image) {
        formData.append('image', image);
      }

      // API কল করা হচ্ছে (হেডারসে টোকেন পাস করা হয়েছে)
      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile', 
        formData, 
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData(); // 🔄 ডাটাবেজ থেকে লেটেস্ট ডাটা ফ্রন্টএন্ডে রি-লোড করবে
        setIsEdit(false);            // এডিট মোড বন্ধ করবে
        setImage(false);             // ইমেজ স্টেট রিসেট করবে
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  // 🎯 সেফটি গার্ড: userData যদি এখনো লোড না হয়ে থাকে
  if (!userData) {
    return (
      <div className='flex justify-center items-center h-40 text-gray-500 font-medium'>
        Loading Profile...
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8'>

      {/* Top Section: Profile Image */}
      <div className='flex flex-col md:flex-row gap-6 items-start'>
        
        <div className='relative cursor-pointer group'>
          {
            isEdit ? (
              <label htmlFor="image-upload" className='cursor-pointer'>
                <div className='inline-block relative'>
                  <img
                    className='w-32 h-32 rounded-full object-cover bg-gray-100 opacity-70 group-hover:opacity-50 transition-all'
                    src={image ? URL.createObjectURL(image) : userData?.image || "https://via.placeholder.com/150"} 
                    alt="Upload Profile"
                  />
                  <div className='absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700 bg-black/10 rounded-full'>
                    Change
                  </div>
                </div>
                <input 
                  type="file" 
                  id="image-upload" 
                  hidden 
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            ) : (
              <img
                className='w-32 h-32 rounded-full object-cover bg-gray-100'
                src={userData?.image || "https://via.placeholder.com/150"} 
                alt="Profile"
              />
            )
          }
        </div>

        <div className='flex-1 w-full'>
          {/* Name */}
          {
            isEdit ? (
              <input
                className='text-2xl font-semibold border p-2 rounded w-full'
                value={userData?.name || ''}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              <p className='text-3xl font-semibold'>{userData?.name}</p>
            )
          }
          <p className='text-gray-500 mt-1'>Patient Profile</p>
        </div>

      </div>

      <hr className='my-6' />

      {/* Contact Info */}
      <div>
        <p className='text-gray-500 underline mb-3'>CONTACT INFORMATION</p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm'>
          <p className='font-medium'>Email:</p>
          <p className='text-blue-500'>{userData?.email}</p>

          <p className='font-medium'>Phone:</p>
          {
            isEdit ? (
              <input
                className='border p-1 rounded w-full max-w-xs'
                value={userData?.phone || ''}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className='text-blue-500'>{userData?.phone}</p>
            )
          }

          <p className='font-medium'>Address:</p>
          {
            isEdit ? (
              <div className='flex flex-col gap-2 w-full max-w-xs'>
                <input 
                  className='border p-1 rounded'
                  value={userData?.address?.line1 || ''} 
                  onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                />
                <input 
                  className='border p-1 rounded'
                  value={userData?.address?.line2 || ''} 
                  onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                />
              </div>
            ) : (
              <p className='text-gray-600'>
                {userData?.address?.line1 || ''}<br />
                {userData?.address?.line2 || ''}
              </p>
            )
          }
        </div>
      </div>

      {/* Basic Info */}
      <div className='mt-6'>
        <p className='text-gray-500 underline mb-3'>BASIC INFORMATION</p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm'>
          <p className='font-medium'>Gender:</p>
          {
            isEdit ? (
              <select
                className='border p-1 rounded w-full max-w-xs'
                value={userData?.gender || 'Male'}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className='text-gray-600'>{userData?.gender}</p>
            )
          }

          <p className='font-medium'>Birthday:</p>
          {
            isEdit ? (
              <input 
                type="date"
                className='border p-1 rounded w-full max-w-xs'
                value={userData?.dob || ''}
                onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
              />
            ) : (
              <p className='text-gray-600'>{userData?.dob}</p>
            )
          }
        </div>
      </div>

      {/* Buttons */}
      <div className='mt-6 flex gap-4'>
        {
          isEdit ? (
            <button
              onClick={() => {
                setIsEdit(false);
                setImage(false);
                loadUserProfileData(); // ক্যানসেল করলে আগের ডাটা ফিরিয়ে আনবে
              }}
              className='px-6 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all'
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className='px-6 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all'
            >
              Edit
            </button>
          )
        }

        {
          isEdit && (
            <button
              onClick={updateUserProfileData} // 🎯 ক্লিক করলে ডাটাবেজে সেভ হবে
              className='px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all'
            >
              Save Information
            </button>
          )
        }
      </div>

    </div>
  )
}

export default MyProfile