import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppoinments = () => {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])

  // ইউজারের অ্যাপয়েন্টমেন্ট লিস্ট নিয়ে আসার ফাংশন
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // ব্যাকএন্ড থেকে ওয়ান-টাইম অর্ডার আইডি জেনারেট করার ফাংশন
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/payment-razorpay', 
        { appointmentId }, 
        { headers: { token } }
      )

      if (data.success) {
        initPay(data.order)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // রেজরপে গেটওয়ে পপআপ ইনিশিয়েলাইজ করার ফাংশন
  const initPay = (order) => {
    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Appointment Payment',
        description: 'Appointment Payment',
        order_id: order.id,
        
        handler: async (response) => {
            try {
                console.log("Razorpay Response Data:", response);

                const { data } = await axios.post(
                    backendUrl + '/api/user/verifyRazorpay', 
                    {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        appointmentId: order.receipt // মঙ্গোডিবি আইডি পাঠানো হচ্ছে
                    }, 
                    { headers: { token } }
                );

                if (data.success) {
                    toast.success("🎉 পেমেন্ট সফল হয়েছে এবং ডাটাবেজ আপডেট হয়েছে!");
                    
                    // 🔥 ফ্রন্টএন্ডে ইনস্ট্যান্ট স্টেট আপডেট (isPaid এবং payment দুটোই ট্রু করে দেওয়া হচ্ছে)
                    setAppointments(prevAppointments => 
                      prevAppointments.map(appointment => 
                        appointment._id === order.receipt 
                          ? { ...appointment, isPaid: true, payment: true } 
                          : appointment
                      )
                    );

                    // ব্যাকএন্ড থেকে নতুন ডাটা রি-ফেচ করা
                    getUserAppointments()
                    if (getDoctorsData) {
                      getDoctorsData()
                    }
                } else {
                    toast.error(data.message || "পেমেন্ট ভেরিফিকেশন ব্যর্থ হয়েছে।");
                }
            } catch (error) {
                console.error("Verification Error on Frontend:", error);
                toast.error(error.response?.data?.message || "সার্ভারে পেমেন্ট ভেরিফাই করা যায়নি।");
            }
        },
        modal: {
            onDismiss: function() {
                toast.info("ইউজার পেমেন্ট পপআপ বন্ধ করে দিয়েছে।");
            }
        }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // অ্যাপয়েন্টমেন্ট ক্যানсел করার ফাংশন
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment', 
        { appointmentId }, 
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getUserAppointments() 
        if (getDoctorsData) {
          getDoctorsData()
        }
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div className='max-w-5xl mx-auto px-4 sm:px-6'>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      
      <div className='mt-4 space-y-4'>
        {
          appointments.length > 0 ? (
            appointments.map((item, index) => {
              // 🔍 চেক করা হচ্ছে ডাটাবেজে ফিল্ডের নাম isPaid নাকি payment
              const paidStatus = item.isPaid || item.payment;
              // 🔍 চেক করা হচ্ছে অ্যাপয়েন্টমেন্ট কমপ্লিট কি না
              const isCompletedStatus = item.isCompleted || item.completed;

              return (
                <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b' key={index}>
                  <div>
                    <img className='w-32 bg-indigo-50 rounded' src={item.docData.image} alt={item.docData.name} />
                  </div>
                  
                  <div className='flex-1 text-sm text-zinc-600'>
                    <p className='text-neutral-800 font-semibold text-base'>{item.docData.name}</p>
                    <p className='text-xs text-zinc-500'>{item.docData.speciality || item.docData.specialty}</p>

                    <p className='text-zinc-700 font-medium mt-2'>Address</p>
                    <p className='text-xs text-zinc-500'>{item.docData.address?.line1}</p>
                    <p className='text-xs text-zinc-500'>{item.docData.address?.line2}</p>
                    
                    <p className='text-sm mt-2 text-zinc-700'>
                      <span className='text-neutral-700 font-medium'>Date & Time: </span>
                      {item.slotDate ? item.slotDate.replaceAll('_', ' ') : ''} | {item.slotTime}
                    </p>
                  </div>
                  
                  {/* 🎯 বাটন সেকশন (কমপ্লিট লজিক সহ আপডেট করা হলো) */}
                  <div className='flex flex-col gap-2 justify-end mt-4 sm:mt-0'>
                    
                    {isCompletedStatus ? (
                      // ১. অ্যাপয়েন্টমেন্ট ইতিমধ্যে সম্পন্ন হলে "Completed" দেখাবে
                      <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-600 text-sm bg-green-50 font-semibold cursor-default'>
                        Completed
                      </button>
                    ) : item.cancelled ? (
                      // ২. অ্যাপয়েন্টমেন্ট বাতিল হলে শুধুমাত্র 'Appointment Cancelled' বাটন দেখাবে
                      <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 text-sm cursor-not-allowed bg-red-50'>
                        Appointment Cancelled
                      </button>
                    ) : (
                      // ৩. অ্যাপয়েন্টমেন্ট একটিভ থাকলে (বাতিল বা কমপ্লিট না হলে) নিচের বাটনগুলো কাজ করবে
                      <>
                        {/* পেমেন্ট স্ট্যাটাস ট্রু হলে 'Paid' বাটন আসবে, অন্যথায় 'Pay Online' বাটন থাকবে */}
                        {paidStatus ? (
                          <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 text-sm bg-green-50 cursor-default font-medium'>
                            Paid
                          </button>
                        ) : (
                          <button 
                            onClick={() => appointmentRazorpay(item._id)} 
                            className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-500 hover:text-white transition-all duration-300'
                          >
                            Pay Online
                          </button>
                        )}
                        
                        {/* অ্যাপয়েন্টমেন্ট একটিভ থাকলে 'Cancel Appointment' বাটনটি নিচে থাকবে */}
                        <button 
                          onClick={() => cancelAppointment(item._id)} 
                          className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300'
                        >
                          Cancel Appointment
                        </button>
                      </>
                    )}

                  </div>
                </div>
              )
            })
          ) : (
            <p className='text-gray-500 py-8 text-center'>No appointments found.</p>
          )
        }
      </div>
    </div>
  )
}

export default MyAppoinments;