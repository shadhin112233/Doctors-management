import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'

const DoctorAppointment = () => {

  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className="w-full m-5 max-w-6xl">
      <p className='mb-4 text-xl font-semibold text-gray-700'>All Appointments</p>
      
      <div className="bg-white border rounded-xl text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll shadow-sm">
        
        {/* Table Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2.5fr_1fr_1fr] gap-1 py-3.5 px-6 border-b bg-gray-50 text-gray-600 font-semibold sticky top-0 bg-white z-10'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p className='text-center'>Actions</p>
        </div>

        {/* Table Body */}
        {
          appointments && appointments.length > 0 ? (
            appointments.map((item, index) => (
              <div 
                key={index} 
                className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr_2.5fr_1fr_1fr] gap-3 sm:gap-1 items-center py-4 px-6 border-b hover:bg-gray-50 transition-colors text-gray-600'
              >
                {/* # Number */}
                <p className='max-sm:hidden font-medium text-gray-400'>{index + 1}</p>
                
                {/* Patient Info */}
                <div className='flex items-center gap-3'>
                  <img 
                    className='w-10 h-10 rounded-full object-cover bg-gray-100 border' 
                    src={item.userData?.image || 'https://via.placeholder.com/150'} 
                    alt="Patient" 
                  /> 
                  <div>
                    <p className='font-semibold text-gray-800 sm:font-medium'>{item.userData?.name}</p>
                    <span className='sm:hidden text-xs text-gray-400'>#{index + 1}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.payment ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {item.payment ? 'Online' : 'Cash'}
                  </span>
                </div>

                {/* Age */}
                <p className='sm:text-left'><span className='sm:hidden font-medium text-gray-400'>Age: </span>{item.userData?.age || 'N/A'}</p>

                {/* Date & Time */}
                <p><span className='sm:hidden font-medium text-gray-400'>Slot: </span>{item.slotDate} | {item.slotTime}</p>

                {/* Fees */}
                <p className='font-medium text-gray-800'><span className='sm:hidden font-medium text-gray-400'>Fees: </span>${item.amount}</p>

                {/* Actions Section */}
                <div className='flex items-center justify-start sm:justify-center gap-2 mt-2 sm:mt-0'>
                  {
                    // ১. যদি অ্যাপয়েন্টমেন্ট ক্যানসেল হয়
                    item.cancelled 
                    ? <p className='text-red-400 text-xs font-medium bg-red-50 px-3 py-1 rounded border border-red-100'>Cancelled</p>
                    
                    // ২. যদি অ্যাপয়েন্টমেন্ট কমপ্লিট হয় (item.completed এর বদলে item.isCompleted দেওয়া হয়েছে)
                    : item.isCompleted 
                    ? <p className='text-green-500 text-xs font-medium bg-green-50 px-3 py-1 rounded border border-green-100'>Completed</p>
                    
                    // ৩. কোনোটিই না হলে অ্যাকশন বাটনগুলো দেখাবে
                    : (
                      <>
                        <button 
                          onClick={() => completeAppointment(item._id)} 
                          className='p-1.5 hover:bg-green-50 text-green-600 rounded-full border border-green-100 transition-colors' 
                          title='Complete Appointment'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => cancelAppointment(item._id)} 
                          className='p-1.5 hover:bg-red-50 text-red-500 rounded-full border border-red-100 transition-colors' 
                          title='Cancel Appointment'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </button>
                      </>
                    )
                  }
                </div>
              </div>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center min-h-[40vh] text-gray-400 gap-2'>
              <p className='text-base font-medium'>No appointments found</p>
            </div>
          )
        }

      </div>
    </div>
  )
}

export default DoctorAppointment