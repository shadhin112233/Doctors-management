import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center pt-10 text-2xl text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, tempora? Dolorem eaque sit accusantium, nihil beatae recusandae. In esse obcaecati distinctio impedit labore dolores est exercitationem saepe omnis molestiae deleniti eligendi, tempora nam! Deleniti minus doloremque nemo magnam vitae neque fugit rem laudantium omnis accusamus!</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident, officiis hic? Molestiae ullam molestias, id esse suscipit saepe veritatis magnam temporibus dolorem quaerat tempore dolor consectetur. Voluptatibus laboriosam velit, eum quae eius, assumenda ullam nihil impedit minima iste ab in, optio dicta aliquid maxime odit.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae ad, vel quibusdam eaque, omnis, pariatur voluptate quam quos repellat excepturi at? Tenetur, ea.</p>
        </div>

      </div>

      <div className='text-xl my-4'>
        <p>Why <span className='text-gray-700 font-semibold'>CHOSE US</span></p>
      </div>


      <div className='flex flex-col md:flex-row mb-20 gap-3'>

  <div className='border px-10 md:px-16 md:py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
    <b>Efficiency</b>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officiis voluptas distinctio esse optio?</p>
  </div>

  <div className='border px-10 md:px-16 md:py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
    <b>Convenience:</b>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum! Commodi, voluptate? Repellendus, quibusdam!</p>
  </div>

  <div className='border px-10 md:px-16 md:py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
    <b>Personalization</b>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum! Commodi, voluptate? Repellendus, quibusdam!</p>
  </div>

</div>

    </div>
  )
}

export default About
