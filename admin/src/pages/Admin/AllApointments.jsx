import React from 'react'
import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllApointments = () => {
  // AdminContext থেকে প্রয়োজনীয় ডাটা ও ফাংশন নেওয়া হচ্ছে
  const { atoken, appointments, getallAppointments, cancelAppointment } = useContext(AdminContext)
  const { currency } = useContext(AppContext)

  useEffect(() => {
    if (atoken) {
      getallAppointments()
    }
  }, [atoken])

  // 🛠️ DOB থেকে নিখুঁত বয়স বের করার ফাংশন
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return isNaN(age) ? 'N/A' : age;
  }

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        
        {/* 📋 টেবিল হেডার */}
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b bg-gray-50 font-semibold text-gray-700 items-center text-center sm:text-left'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {/* 👥 টেবিল বডি (ডাটা লিস্ট রেন্ডারিং) */}
        {appointments && appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div 
              className='grid grid-cols-[1fr_2fr_1fr_2fr_2fr_1fr_1fr] sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50 text-center sm:text-left gap-1 sm:gap-0' 
              key={index}
            >
              {/* ১. সিরিয়াল নাম্বার */}
              <p className='max-sm:hidden'>{index + 1}</p>

              {/* ২. পেশেন্ট ডেটা (ইমেজ + নাম) */}
              <div className='flex items-center gap-2 justify-center sm:justify-start'>
                <img className='w-8 h-8 rounded-full object-cover bg-gray-100 min-w-8 min-h-8' src={item.userData?.image} alt="" />
                <p className='font-medium text-zinc-800 truncate'>{item.userData?.name || "GreatStack"}</p>
              </div>

              {/* ৩. বয়স */}
              <p>{calculateAge(item.userData?.dob) || item.userData?.age || '24'}</p>

              {/* ৪. ডেট ও টাইম */}
              <p>{item.slotDate ? item.slotDate.replaceAll('_', ' ') : ''}, {item.slotTime}</p>

              {/* ৫. ডাক্তার ডেটা */}
              <div className='flex items-center gap-2 justify-center sm:justify-start'>
                <img className='w-8 h-8 rounded-full object-cover bg-indigo-50 min-w-8 min-h-8' src={item.docData?.image} alt="" />
                <p className='font-medium text-zinc-800 truncate'>{item.docData?.name}</p>
              </div>

              {/* ৬. ফিস */}
              <p className='font-medium text-zinc-900'>{currency || '$'}{item.amount || item.docData?.fees}</p>

              {/* 🎯 ৭. অ্যাকশন বাটন লজিক (ক্যানসেল, কমপ্লিট এবং একটিভ কন্ডিশন) */}
              <div className='flex items-center justify-center sm:justify-start gap-2 font-medium text-xs'>
                {item.isCompleted || item.completed ? (
                  // ১. অ্যাপয়েন্টমেন্ট ইতিমধ্যে সম্পন্ন হলে "Completed" টেক্সট দেখাবে
                  <p className='text-green-600 font-semibold bg-green-50 px-2 py-1 rounded'>Completed</p>
                ) : item.cancelled ? (
                  // ২. অ্যাপয়েন্টমেন্ট বাতিল হলে "Cancelled" টেক্সট দেখাবে
                  <p className='text-red-400 font-medium bg-red-50 sm:bg-transparent px-2 py-1 sm:p-0 rounded'>Cancelled</p>
                ) : (
                  // ৩. অ্যাপয়েন্টমেন্ট একটিভ থাকলে (পেইড বা পেন্ডিং) স্ট্যাটাস এবং পাশে ক্রস বাটন দেখাবে
                  <div className='flex items-center gap-2'>
                    {item.isPaid || item.payment ? (
                      <p className='text-green-500 font-medium bg-green-50 sm:bg-transparent px-2 py-1 sm:p-0 rounded'>Paid</p>
                    ) : (
                      <p className='text-yellow-600 font-medium bg-yellow-50 sm:bg-transparent px-2 py-1 sm:p-0 rounded'>Pending</p>
                    )}
                    
                    {/* ❌ ক্যানসেল করার জন্য রেসপন্সিভ রাউন্ডেড ক্রস বাটন */}
                    <div 
                      onClick={() => cancelAppointment(item._id)} 
                      className='w-7 h-7 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-400 cursor-pointer transition-all duration-200 border border-red-100 shadow-sm'
                      title="Cancel Appointment"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))
        ) : (
          <p className='text-center py-10 text-gray-500'>No appointments available.</p>
        )}

      </div>
    </div>
  )
}

export default AllApointments