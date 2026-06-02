import React from 'react'
import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {

  const { atoken, dashdata, getdashData, cancelAppointment } = useContext(AdminContext)

  useEffect(() => {
    if (atoken) {
      getdashData()
    }
  }, [atoken])

  return dashdata && (
    <div className='m-5'>
      
      {/* 📊 স্ট্যাটাসカード সেকশন */}
      <div className='flex flex-wrap gap-3'>
        
        {/* ১. ডাক্তার কাউন্ট */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashdata.doctors}</p>
            <p className='text-gray-400 text-sm'>Doctors</p>
          </div>
        </div >

        {/* ২. অ্যাপয়েন্টমেন্ট কাউন্ট */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashdata.appointments}</p>
            <p className='text-gray-400 text-sm'>Appointments</p>
          </div>
        </div>

        {/* ৩. পেশেন্ট কাউন্ট */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashdata.patients}</p>
            <p className='text-gray-400 text-sm'>Patients</p>
          </div>
        </div>

      </div>

      {/* 📋 লেটেস্ট বুকিং লিস্ট সেকশন */}
      <div className='bg-white border rounded mt-10 max-w-4xl'>
        
        <div className='flex items-center gap-2.5 px-4 py-4 rounded-t border-b bg-gray-50 font-semibold text-gray-700'>
          <img src={assets.list_icon} alt="" />
          <p>Latest Booking</p>
        </div>

        <div className='pt-2 divide-y divide-gray-100'>
          {
            dashdata.latestAppointments && dashdata.latestAppointments.length > 0 ? (
              dashdata.latestAppointments.map((item, index) => (
                <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-50 transition-all justify-between' key={index}>
                  
                  {/* ডাক্তার ইনফো (ইমেজ, নাম, ডেট) */}
                  <div className='flex items-center gap-3'>
                    <img className='w-10 h-10 rounded-full object-cover bg-indigo-50 border' src={item.docData?.image} alt="" />
                    <div className='flex-1 text-sm'>
                      <p className='text-neutral-800 font-medium'>{item.docData?.name}</p>
                      <p className='text-zinc-500 text-xs'>
                        Booking for: {item.slotDate ? item.slotDate.replaceAll('_', ' ') : ''} | {item.slotTime}
                      </p>
                    </div>
                  </div>

                  {/* 🎯 অ্যাকশন বাটন লজিক (কমপ্লিট, ক্যানসেল ও একটিভ স্ট্যাটাস) */}
                  <div className='text-xs font-medium'>
                    {item.isCompleted || item.completed ? (
                      // ১. অ্যাপয়েন্টমেন্ট ইতিমধ্যে সম্পন্ন হলে "Completed" টেক্সট দেখাবে
                      <p className='text-green-600 font-semibold bg-green-50 px-2 py-1 rounded border border-green-100'>Completed</p>
                    ) : item.cancelled ? (
                      // ২. অ্যাপয়েন্টমেন্ট বাতিল হলে হালকা লাল কালারের text দেখাবে
                      <p className='text-red-400 font-medium bg-red-50 px-2 py-1 rounded border border-red-100'>Cancelled</p>
                    ) : (
                      // ৩. অ্যাপয়েন্টমেন্ট একটিভ থাকলে (পেইড বা পেন্ডিং) স্ট্যাটাস এবং পাশে ক্রস বাটন দেখাবে
                      <div className='flex items-center gap-2'>
                        {/* পেমেন্ট স্ট্যাটাস চেক */}
                        {item.isPaid || item.payment ? (
                          <p className='text-green-500 font-medium bg-green-50 px-2 py-1 rounded border border-green-100'>Paid</p>
                        ) : (
                          <p className='text-yellow-600 font-medium bg-yellow-50 px-2 py-1 rounded border border-yellow-100'>Pending</p>
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
              <p className='text-center py-6 text-gray-500 text-sm'>No bookings found.</p>
            )
          }
        </div>

      </div>
   
    </div>
  )
}

export default Dashboard