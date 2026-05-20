import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>

      <div className='grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        {/* Left Side */}
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />

          <p className='w-full md:w-2/3 text-gray-600 leading-6'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Excepturi rem id, quo atque minima expedita nihil magnam
            et eius laboriosam quos eos.
          </p>
        </div>

        {/* Middle Side */}
        <div>
          <p className='text-xl font-medium mb-5'>
            COMPANY
          </p>

          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About Us</li>
            <li>Privacy Policy</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Right Side */}
        <div>
          <p className='text-xl font-medium mb-5'>
            GET IN TOUCH
          </p>

          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>01752330050</li>
            <li>info@company.com</li>
          </ul>
        </div>

      </div>

      {/* Bottom Text */}
      <div>
        <hr />

        <p className='py-5 text-sm text-center'>
          © 2026 Your Company Name. All Rights Reserved.
        </p>
      </div>

    </div>
  )
}

export default Footer