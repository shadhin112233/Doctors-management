import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RealatedDoctors = ({ docId, speciality }) => {

    const { doctors } = useContext(AppContext)
    const [relDoc, setRelDoc] = useState([])
    const navigate = useNavigate()

    useEffect(() => {

        if (doctors.length > 0 && speciality) {

            const doctorsData = doctors.filter(
                (doc) => doc.speciality === speciality && doc._id !== docId
            )

            setRelDoc(doctorsData)

        }

    }, [doctors, docId, speciality])

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>

            <h1 className='text-3xl font-semibold'>
                Related Doctors
            </h1>

            <p className='sm:w-1/2 text-center text-sm text-gray-500'>
                Simply browse through our extensive list of trusted doctors.
            </p>

            <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-5'>

                {
                    relDoc.slice(0, 5).map((item, index) => (

                        <div
                            key={index}
                            onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0, 0)}}
                            className='border border-blue-100 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-lg bg-white'
                        >

                            <img
                                className='w-full h-40 object-cover bg-blue-50'
                                src={item.image}
                                alt=""
                            />

                            <div className='p-3'>

                                {/* 🎯 ডাইনামিক অ্যাভেইল্যাবিলিটি লজিক */}
                                <div className={`flex items-center gap-2 text-xs mb-2 ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                                    <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></p>
                                    <p>{item.available ? 'Available' : 'Not Available'}</p>
                                </div>

                                <p className='text-sm font-semibold text-gray-800 truncate'>
                                    {item.name}
                                </p>

                                <p className='text-xs text-gray-500'>
                                    {item.speciality}
                                </p>

                            </div>

                        </div>

                    ))
                }

            </div>

        </div>
    )
}

export default RealatedDoctors