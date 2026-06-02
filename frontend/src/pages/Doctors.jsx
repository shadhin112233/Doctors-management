import React, { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {

  const { specialty } = useParams()
  const navigate = useNavigate()

  const [filterDoc, setFilterDoc] = useState([])

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (specialty) {
      setFilterDoc(
        doctors.filter(doc => doc.speciality === specialty)
      )
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [specialty, doctors])

  return (
    <div>

      <p className='text-gray-600'>
        Browse Through the doctor Specialist
      </p>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

        {/* Left Side - Specialty Filters */}
        <div className='flex flex-col gap-4 text-sm text-gray-600 w-full sm:w-auto min-w-[200px]'>

          <p
            onClick={() =>
              specialty === 'General physician'
                ? navigate('/doctors')
                : navigate('/doctors/General physician')
            }
            className={`border border-gray-300 pl-3 py-1.5 pr-16 rounded transition-all cursor-pointer ${specialty === "General physician" ? "bg-indigo-100 text-black border-indigo-300" : ""}`}
          >
            General physician
          </p>

          <p
            onClick={() =>
              specialty === 'Gynecologist'
                ? navigate('/doctors')
                : navigate('/doctors/Gynecologist')
            }
            className={`border border-gray-300 pl-3 py-1.5 pr-16 rounded transition-all cursor-pointer ${specialty === "Gynecologist" ? "bg-indigo-100 text-black border-indigo-300" : ""}`}
          >
            Gynecologist
          </p>

          <p
            onClick={() =>
              specialty === 'Dermatologist'
                ? navigate('/doctors')
                : navigate('/doctors/Dermatologist')
            }
            className={`border border-gray-300 pl-3 py-1.5 pr-16 rounded transition-all cursor-pointer ${specialty === "Dermatologist" ? "bg-indigo-100 text-black border-indigo-300" : ""}`}
          >
            Dermatologist
          </p>

          <p
            onClick={() =>
              specialty === 'Pediatricians'
                ? navigate('/doctors')
                : navigate('/doctors/Pediatricians')
            }
            className={`border border-gray-300 pl-3 py-1.5 pr-16 rounded transition-all cursor-pointer ${specialty === "Pediatricians" ? "bg-indigo-100 text-black border-indigo-300" : ""}`}
          >
            Pediatricians
          </p>

          <p
            onClick={() =>
              specialty === 'Neurologist'
                ? navigate('/doctors')
                : navigate('/doctors/Neurologist')
            }
            className={`border border-gray-300 pl-3 py-1.5 pr-16 rounded transition-all cursor-pointer ${specialty === "Neurologist" ? "bg-indigo-100 text-black border-indigo-300" : ""}`}
          >
            Neurologist
          </p>

          <p
            onClick={() =>
              specialty === 'Gastroenterologist'
                ? navigate('/doctors')
                : navigate('/doctors/Gastroenterologist')
            }
            className={`border border-gray-300 pl-3 py-1.5 pr-16 rounded transition-all cursor-pointer ${specialty === "Gastroenterologist" ? "bg-indigo-100 text-black border-indigo-300" : ""}`}
          >
            Gastroenterologist
          </p>

        </div>

        {/* Right Side - Doctors Cards Grid */}
        <div className='w-full grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 gap-y-6'>

          {filterDoc.map((item, index) => (

            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 bg-white shadow-sm'
              key={index}
            >

              <img className='bg-blue-50 w-full h-64 object-cover' src={item.image} alt="" />

              <div className='p-4'>

                {/* 🎯 ডাইনামিক অ্যাভেইল্যাবিলিটি লজিক */}
                <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></p>
                  <p>{item.available ? 'Available' : 'Not Available'}</p>
                </div>

                <p className='text-gray-900 text-lg font-medium mt-1'>
                  {item.name}
                </p>

                <p className='text-gray-600 text-sm'>
                  {item.speciality}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default Doctors