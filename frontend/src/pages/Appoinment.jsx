import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RealatedDoctors from '../components/RealatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {
  const navigate = useNavigate()
  const { docId } = useParams()

  const {
    doctors,
    currencySymbol,
    backendUrl,
    token,
    getDoctorsData
  } = useContext(AppContext)

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  // Fetch doctor info
  const fetchDocInfo = async () => {
    const doctor = doctors.find(doc => doc._id === docId)
    setDocInfo(doctor)
  }

  // Book appointment
  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book Appointment')
      return navigate('/login')
    }

    if (!slotTime) {
      return toast.warn('Please select a time slot')
    }

    try {
      const date = docSlots[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = `${day}_${month}_${year}`

      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  // Generate slots
  useEffect(() => {
    if (!docInfo) return

    if (docInfo.slots && docInfo.slots.length) {
      setDocSlots(docInfo.slots)
      return
    }

    const now = new Date()
    const generated = []

    for (let i = 0; i < 7; i++) {
      const day = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + i
      )

      const times = [9, 10, 11, 14, 16, 18].map(hour => ({
        datetime: new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate(),
          hour,
          0
        ),
        available: true
      }))

      generated.push(times)
    }

    setDocSlots(generated)
  }, [docInfo])

  return docInfo && (
    <div>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img
            className='bg-blue-400 w-full sm:max-w-72 rounded-lg'
            src={docInfo.image}
            alt=""
          />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>

          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>
              {docInfo.experience}
            </button>
          </div>

          <div className='mt-3'>
            <div className='flex items-center gap-1 text-sm font-medium text-gray-900'>
              <span>About</span>
              <img className='w-3' src={assets.info_icon} alt="" />
            </div>

            <p className='text-sm text-gray-500 max-w-[700px] mt-1 leading-6'>
              {docInfo.about}
            </p>
          </div>

          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee:
            <span className='text-gray-600'>
              {currencySymbol}{docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* Booking slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>

        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length > 0 ? (
              docSlots.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <p>{daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0].datetime.getDate()}</p>
                </div>
              ))
            ) : (
              <p>No slots available</p>
            )
          }
        </div>

        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length > 0 &&
            docSlots[slotIndex]?.map((item, index) => {
              const formattedTime = new Date(
                item.datetime
              ).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })

              // ১. কারেন্ট স্লটের ডেট বের করার লজিক (যেমন: "29_5_2026")
              const currentDate = new Date(item.datetime)
              let day = currentDate.getDate()
              let month = currentDate.getMonth() + 1
              let year = currentDate.getFullYear()
              const slotDate = `${day}_${month}_${year}`

              // ২. স্ক্রিনশটের মূল ফিল্টারিং লজিক এখানে ব্যবহার করা হয়েছে
              // চেক করা হচ্ছে এই স্লট টাইমটি অলরেডি ব্যাকএন্ডের বুকড লিস্টে আছে কি না
              const isBooked = docInfo.slots_booked && 
                               docInfo.slots_booked[slotDate] && 
                               docInfo.slots_booked[slotDate].includes(formattedTime);

              return (
                <p
                  key={index}
                  // যদি অলরেডি বুকড হয়, তবে ক্লিক ফাংশন কাজ করবে না
                  onClick={() => !isBooked && setSlotTime(formattedTime)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all ${
                    isBooked
                      ? 'bg-red-100 text-red-500 border border-red-300 line-through opacity-70 cursor-not-allowed' // স্লট বুকড থাকলে লাল ও ক্রস দেখাবে
                      : slotTime === formattedTime
                      ? 'bg-blue-500 text-white border border-blue-500' // সিলেক্টেড থাকলে নীল দেখাবে
                      : 'bg-gray-200 text-gray-700 border border-transparent' // নরমাল স্লট ধূসর দেখাবে
                  }`}
                >
                  {formattedTime}
                </p>
              )
            })
          }
        </div>

        <button
          onClick={bookAppointment}
          className='bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-colors mt-5'
        >
          Book Appointment
        </button>
      </div>

      <RealatedDoctors
        docId={docId}
        speciality={docInfo.speciality}
      />
    </div>
  )
}

export default Appointment