import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

// Cloudinary-te pic thakle automatic choto + WebP hobe (onno jaygay thakle kichu change hobe na)
const optimize = (url) =>
  url && url.includes('res.cloudinary.com') && url.includes('/upload/')
    ? url.replace('/upload/', '/upload/f_auto,q_auto,w_500/')
    : url

// Data ashar age ei skeleton card dekhabe
const SkeletonCard = () => (
  <div className='border border-blue-100 rounded-xl overflow-hidden'>
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
    <div onClick={onClick} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
      {/* Pic ashar age grey box + animation, ashle smoothly fade-in */}
      <div className={`bg-blue-50 w-full h-64 ${loaded ? '' : 'animate-pulse'}`}>
        <img
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          src={optimize(item.image)}
          alt={item.name || ''}
          loading={index < 4 ? 'eager' : 'lazy'}
          fetchpriority={index < 4 ? 'high' : 'auto'}
          decoding='async'
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      </div>

      <div className='p-4'>
        <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
          <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></p>
          <p>{item.available ? 'Available' : 'Not Available'}</p>
        </div>

        <p className='text-gray-900 text-lg font-medium mt-1'>{item.name}</p>
        <p className='text-gray-600 text-sm'>{item.speciality || item.specialization}</p>
      </div>
    </div>
  )
}

const TopDoctors = () => {

  const navigate = useNavigate();
  const { doctors } = useContext(AppContext)
  const isLoading = !doctors || doctors.length === 0

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
        <h1 className='text-3xl font-medium'>Top Doctors To Book</h1>
        <p className='sm:w-1/3 text-center text-sm'>Discover the best doctors in your area, highly rated and experienced in their fields.</p>

        <div className='w-full grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : doctors.slice(0, 15).map((item, index) => (
                  <DoctorCard
                    key={item._id || index}
                    item={item}
                    index={index}
                    onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                  />
                ))}
        </div>

        <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 hover:bg-blue-100 transition-all'>more</button>

    </div>
  )
}

export default TopDoctors