import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()
  const { token, setToken, userData } = useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false) // মোবাইল ক্লিকের জন্য নতুন স্টেট
  const profileMenuRef = useRef(null)

  // Logout function
  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
    setShowProfileMenu(false)
    navigate('/login')
  }

  // ড্রপডাউন মেনুর বাইরে ক্লিক করলে যাতে মেনুটা অটো বন্ধ হয়ে যায় তার হ্যান্ডলার
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>

      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        className='w-44 cursor-pointer'
        src={assets.logo}
        alt="logo"
      />

      {/* Desktop Menu */}
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'><li className='py-1 px-2 rounded hover:bg-gray-100 hover:text-primary'>HOME</li></NavLink>
        <NavLink to='/doctors'><li className='py-1 px-2 rounded hover:bg-gray-100 hover:text-primary'>ALL DOCTORS</li></NavLink>
        <NavLink to='/about'><li className='py-1 px-2 rounded hover:bg-gray-100 hover:text-primary'>ABOUT</li></NavLink>
        <NavLink to='/contact'><li className='py-1 px-2 rounded hover:bg-gray-100 hover:text-primary'>CONTACT</li></NavLink>
      </ul>

      {/* Right Side */}
      <div className='flex items-center gap-4'>

        {/* AUTH SECTION */}
        {token && userData ? (
          <div 
            ref={profileMenuRef}
            onClick={() => setShowProfileMenu(prev => !prev)} // ক্লিক করলে স্টেট চেঞ্জ হবে
            className='flex items-center gap-2 cursor-pointer group relative'
          >
            <img className='w-8 rounded-full' src={userData.image} alt="profile" />
            <img className='w-2.5' src={assets.dropdown_icon} alt="" />

            {/* Dropdown (ডেস্কটপে হোভার এবং মোবাইলে ক্লিক উভয় মোডেই কাজ করবে) */}
            <div className={`absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-50 ${showProfileMenu ? 'block' : 'hidden md:group-hover:block'}`}>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg border border-gray-200'>

                <p 
                  onClick={(e) => {
                    e.stopPropagation(); // প্যারেন্ট ডিভের ক্লিক ইভেন্ট আটকানোর জন্য
                    setShowProfileMenu(false);
                    navigate('/my-profile');
                  }} 
                  className='hover:text-black cursor-pointer'
                >
                  My Profile
                </p>

                <p 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileMenu(false);
                    navigate('/my-appointments');
                  }} 
                  className='hover:text-black cursor-pointer'
                >
                  My Appointments
                </p>

                <p 
                  onClick={(e) => {
                    e.stopPropagation();
                    logout();
                  }} 
                  className='hover:text-black cursor-pointer'
                >
                  Logout
                </p>

              </div>
            </div>

          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-blue-600 text-white px-5 py-2 md:px-8 md:py-3 rounded-full font-light'
          >
            Create Account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className='w-6 md:hidden cursor-pointer'
          src={assets.menu_icon}
          alt=""
        />
      </div>

      {/* MOBILE MENU */}
      <div
        className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'
          } md:hidden right-0 top-0 bottom-0 overflow-hidden bg-white transition-all duration-300 z-50`}
      >

        {/* Header */}
        <div className='flex items-center justify-between px-5 py-6'>
          <img className='w-36' src={assets.logo} alt="" />

          <img
            onClick={() => setShowMenu(false)}
            className='w-7 cursor-pointer'
            src={assets.cross_icon}
            alt=""
          />
        </div>

        {/* Links */}
        <ul className='flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium'>
          <NavLink onClick={() => setShowMenu(false)} to='/' className='w-full text-center py-2 rounded hover:bg-gray-100'>HOME</NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/doctors' className='w-full text-center py-2 rounded hover:bg-gray-100'>ALL DOCTORS</NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/about' className='w-full text-center py-2 rounded hover:bg-gray-100'>ABOUT</NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/contact' className='w-full text-center py-2 rounded hover:bg-gray-100'>CONTACT</NavLink>
        </ul>

        {/* Mobile Auth */}
        <div className='flex justify-center mt-6'>
          {!token && (
            <button
              onClick={() => {
                setShowMenu(false)
                navigate('/login')
              }}
              className='bg-blue-600 text-white px-6 py-3 rounded-full'
            >
              Create Account
            </button>
          )}
        </div>

      </div>

    </div>
  )
}

export default Navbar