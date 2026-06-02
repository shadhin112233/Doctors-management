import React from 'react'
import {assets} from '../assets/assets'

const Contact = () => {
  return (
    <div>
        <div className='text-center text-2xl pt-10 text-gray-500'>
            <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
        </div>

        <div className= 'my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
          <img className ='w-full max-w-[360px]' src={assets.contact_image} alt="" />
          <div className= 'flex flex-col justify-center gap-6 items-start'>
            <p className='font-semibold text-lg text-gray-600'>Our Office</p>
            <p className='text-gray-500'>123 Main Street</p>
            <p className='text-gray-500'>Anytown, USA 12345</p>
            <p className='text-gray-500'>Phone: (123) 456-7890 <br/>Email: info@company.com</p>
            <p className='text-gray-500'>Careers: lorem ipsum dolor sit amet</p>

            <button className='bg-black text-white px-6 py-2 hover:bg-gray-800'>Explore Jobs</button>
          </div>
      
        </div>
      
    </div>
  )
}

export default Contact
