import React, { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

// Cloudinary pic automatic choto + WebP hobe
const optimize = (url) =>
  url && url.includes('res.cloudinary.com') && url.includes('/upload/')
    ? url.replace('/upload/', '/upload/f_auto,q_auto,w_500/')
    : url

const specialties = [
  'General physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist',
]

// Data ashar age skeleton card
const SkeletonCard = () => (
  <div className='border border-blue-100 rounded-xl overflow-hidden bg-white'>
    <div className='bg-blue-50 w-full h-64 animate-pulse' />
    <div className='p-4 space-y-2'>
      <div className='h-3 w-20 bg-gray-200 rounded animate-pulse' />
      <div className='h-5 w-36 bg-gray-200 rounded animate-pulse' />
      <div className='h-3 w-24 bg-gray-200 rounded animate-pulse' />
    </div>
  </div>
)

const DoctorCard = ({ item, index, onClick }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      onClick={onClick}
      className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 bg-white shadow-sm'
    >
      <div className={`bg-blue-50 w-full h-64 ${loaded ? '' : 'animate-pulse'}`}>
        <img
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          src={optimize(item.image)}
          alt={item.name || ''}
          loading={index < 6 ? 'eager' : 'lazy'}
          fetchpriority={index < 6 ? 'high' : 'auto'}
          decoding='async'
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      </div>

      <div className='p-4'>
        <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
          <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></p>
          <p>{item.available ? 'Available' : 'Not Available'}</p>
        </div>

        <p className='text-gray-900 text-lg font-medium mt-1'>{item.name}</p>
        <p className='text-gray-600 text-sm'>{item.speciality}</p>
      </div>
    </div>
  )
}

const Doctors = () => {

  const { specialty } = useParams()
  const navigate = useNavigate()

  const { doctors, doctorsLoading } = useContext(AppContext)

  const filterDoc = specialty
    ? doctors.filter(doc => doc.speciality === specialty)
    : doctors

  // doctorsLoading AppContext-e na thakleo kaj korbe
  const isLoading = (doctorsLoading ?? true) && (!doctors || doctors.length === 0)

  return (
    <div>

      <p className='text-gray-600'>
        Browse Through the doctor Specialist
      </p>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

        {/* Left Side - Specialty Filters */}
        <div className='flex flex-col gap-4 text-sm text-gray-600 w-full sm:w-auto min-w-[200px]'>
          {specialties.map((name) => (
            <p
              key={name}
              onClick={() =>
                specialty === name ? navigate('/doctors') : navigate(`/doctors/${name}`)
              }
              className={`border border-gray-300 pl-3 py-1.5 pr-16 rounded transition-all cursor-pointer ${specialty === name ? 'bg-indigo-100 text-black border-indigo-300' : ''}`}
            >
              {name}
            </p>
          ))}
        </div>

        {/* Right Side - Doctors Cards Grid */}
        <div className='w-full grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 gap-y-6'>

          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

          {!isLoading && filterDoc.length === 0 && (
            <p className='col-span-full text-center text-gray-500 py-10'>No doctors found.</p>
          )}

          {!isLoading &&
            filterDoc.map((item, index) => (
              <DoctorCard
                key={item._id || index}
                item={item}
                index={index}
                onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
              />
            ))}

        </div>

      </div>

    </div>
  )
}

export default Doctors