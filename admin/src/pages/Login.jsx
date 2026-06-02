import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'

const Login = () => {

  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setAtoken, backendUrl } = useContext(AdminContext)
  // FIXED: Pass DoctorContext instead of the localStorage string
  const { dToken, setDToken } = useContext(DoctorContext) 
  

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Admin') {

        const { data } = await axios.post(
          backendUrl + '/api/admin/login',
          { email, password }
        )

        console.log("LOGIN RESPONSE:", data)

        if (data.success && data.token) {

          console.log("TOKEN:", data.token)

          setAtoken(data.token)
          localStorage.setItem("aToken", data.token)

          axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`

          toast.success("Login Successful ✅")

        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success && data.token) {

          console.log("TOKEN:", data.token)

          setDToken(data.token)
          localStorage.setItem("dToken", data.token)

          axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`

          toast.success("Login Successful ✅")

        } else {
          toast.error(data.message)
        }
      }

    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || "Login Failed ❌")
    }
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-[400px] border rounded-xl text-[#5E5E5E] text-sm shadow-lg">

        <p className='text-2xl font-semibold m-auto'>
          <span className='text-primary'>{state}</span> Login
        </p>

        <div className='w-full'>
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type="email"
            required
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type="password"
            required
          />
        </div>

        <button
          type="submit"
          className='bg-primary text-white w-full py-2 rounded-md text-base'
        >
          Login
        </button>

        {
          state === 'Admin'
            ? (
              <p>
                Doctor Login?{" "}
                <span
                  className='text-primary underline cursor-pointer'
                  onClick={() => setState('Doctor')}
                >
                  Click Here
                </span>
              </p>
            )
            : (
              <p>
                Admin Login?{" "}
                <span
                  className='text-primary underline cursor-pointer'
                  onClick={() => setState('Admin')}
                >
                  Click Here
                </span>
              </p>
            )
        }

      </div>
    </form>
  )
}

export default Login