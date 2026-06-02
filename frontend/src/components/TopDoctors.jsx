import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {

  const navigate = useNavigate();
  const { doctors } = useContext(AppContext)

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
        <h1 className='text-3xl font-medium'>Top Doctors To Book</h1>
        <p className='sm:w-1/3 text-center text-sm'>Discover the best doctors in your area, highly rated and experienced in their fields.</p>
        
        <div className='w-full grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
            {doctors.slice(0, 15).map((item, index) => {
              return (
                <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                  <img className='bg-blue-50 w-full h-64 object-cover' src={item.image} alt="" />
                  
                  <div className='p-4'>
                    {/* 🎯 ডাইনামিক অ্যাভেইল্যাবিলিটি লজিক */}
                    <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                      <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></p>
                      <p>{item.available ? 'Available' : 'Not Available'}</p>
                    </div>

                    <p className='text-gray-900 text-lg font-medium mt-1'>{item.name}</p>
                    <p className='text-gray-600 text-sm'>{item.speciality || item.specialization}</p>
                  </div>
                    
                </div>
              )
            })}
        </div>
        
        <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 hover:bg-blue-100 transition-all'>more</button>
      
    </div>
  )
}

export default TopDoctors