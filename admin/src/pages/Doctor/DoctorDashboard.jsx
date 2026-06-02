import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'

const DoctorDashboard = () => {

  // এখানে dashData এবং getdashData এর টাইপো ঠিক করা হয়েছে (Context এ যেভাবে ছিল)
  const { dToken, dashdata, getdashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)

  useEffect(() => {
    if (dToken) {
      getdashData()
    }
  }, [dToken])

  // প্রথমবার ডাটা লোড হওয়ার সময় স্ক্রিন যাতে ফাঁকা না লাগে, তাই একটি লোডিং স্টেট
  if (!dashdata) {
    return <div className='flex justify-center items-center h-96 text-gray-600 font-medium'>Loading Dashboard...</div>
  }

  return (
    <div className='m-5'>

      {/* 📊 স্ট্যাটাস কার্ড সেকশন */}
      <div className='flex flex-wrap gap-4 justify-between sm:justify-start'>
        
        {/* ১. টোটাল আর্নিং (উপার্জন) */}
        <div className='flex items-center gap-4 bg-white p-6 min-w-64 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300'>
          <div className='p-3 bg-indigo-50 rounded-lg'>
            <img className='w-10 h-10 object-contain' src={assets.earning_icon} alt="Earnings" />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>${dashdata.earnings}</p>
            <p className='text-gray-500 font-medium text-sm'>Total Earnings</p>
          </div>
        </div>

        {/* ২. অ্যাপয়েন্টমেন্ট কাউন্ট */}
        <div className='flex items-center gap-4 bg-white p-6 min-w-64 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300'>
          <div className='p-3 bg-orange-50 rounded-lg'>
            <img className='w-10 h-10 object-contain' src={assets.appointments_icon} alt="Appointments" />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{dashdata.appointments}</p>
            <p className='text-gray-500 font-medium text-sm'>Appointments</p>
          </div>
        </div>

        {/* ৩. পেশেন্ট কাউন্ট */}
        <div className='flex items-center gap-4 bg-white p-6 min-w-64 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300'>
          <div className='p-3 bg-emerald-50 rounded-lg'>
            <img className='w-10 h-10 object-contain' src={assets.patients_icon} alt="Patients" />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{dashdata.patients}</p>
            <p className='text-gray-500 font-medium text-sm'>Total Patients</p>
          </div>
        </div>

      </div>

      {/* 📅 লেটেস্ট অ্যাপয়েন্টমেন্ট লিস্ট/টেবিল */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 mt-8'>
        <div className='flex items-center gap-2.5 px-6 py-5 border-b border-gray-100'>
          <img className='w-6' src={assets.list_icon || assets.appointments_icon} alt="" />
          <p className='font-semibold text-lg text-gray-800'>Latest Bookings</p>
        </div>

        <div className='pt-2 max-h-[60vh] overflow-y-auto'>
          {dashdata.latestAppointments && dashdata.latestAppointments.length > 0 ? (
            dashdata.latestAppointments.map((item, index) => (
              <div 
                key={index} 
                className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors'
              >
                {/* পেশেন্ট ইমেজ */}
                <img className='rounded-full w-12 h-12 object-cover bg-gray-100' src={item.userData?.image || assets.doc_icon} alt="Patient" />
                
                {/* পেশেন্ট ইনফো */}
                <div className='flex-1'>
                  <p className='text-gray-800 font-semibold text-base'>{item.userData?.name || "Unknown Patient"}</p>
                  <p className='text-gray-500 text-sm mt-0.5'>{item.slotDate} | {item.slotTime}</p>
                </div>

                {/* অ্যাকশন বাটন বা স্ট্যাটাস */}
                <div>
                  {item.isCompleted ? (
                    <span className='text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full'>Completed</span>
                  ) : item.cancelled ? (
                    <span className='text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-600 rounded-full'>Cancelled</span>
                  ) : (
                    <div className='flex items-center gap-2'>
                      {/* ক্যানসেল বাটন */}
                      <button 
                        onClick={() => cancelAppointment(item._id)} 
                        className='p-2 bg-red-50 hover:bg-red-100 rounded-full transition-colors group'
                        title="Cancel Appointment"
                      >
                        <img className='w-4 h-4 object-contain filter group-hover:scale-110 transition-transform' src={assets.cancel_icon} alt="Cancel" />
                      </button>
                      
                      {/* কমপ্লিট বাটন */}
                      <button 
                        onClick={() => completeAppointment(item._id)} 
                        className='p-2 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors group'
                        title="Complete Appointment"
                      >
                        <img className='w-4 h-4 object-contain filter group-hover:scale-110 transition-transform' src={assets.tick_icon} alt="Complete" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-8 text-gray-400 font-medium'>No recent appointments found!</div>
          )}
        </div>
      </div>

    </div>
  )
}

export default DoctorDashboard