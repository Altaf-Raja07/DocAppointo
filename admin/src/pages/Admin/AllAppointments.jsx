import React from 'react'
import { useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets.js'

const AllAppointments = () => {

    const {aToken, appointments, getAllAppointments, cancelAppointment} = useContext(AdminContext)
    const {calculateAge, slotDateFormat, currency} = useContext(AppContext)

    useEffect(()=>{
        if(aToken){
            getAllAppointments()
        }
    },[aToken])

    return (
        <div className='w-full max-w-6xl m-5'>
            <p className='mb-5 text-2xl font-semibold text-gray-800'>All Appointments</p>

            <div className='bg-white border rounded-lg shadow-sm text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>

                <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-4 px-6 border-b bg-gray-50'>
                    <p className='font-semibold text-gray-700'>#</p>
                    <p className='font-semibold text-gray-700'>Patient</p>
                    <p className='font-semibold text-gray-700'>Age</p>
                    <p className='font-semibold text-gray-700'>Date & Time</p>
                    <p className='font-semibold text-gray-700'>Doctor</p>
                    <p className='font-semibold text-gray-700'>Fees</p>
                    <p className='font-semibold text-gray-700'>Actions</p>
                </div>

                {appointments && appointments.map((item,index)=>(
                    <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-600 py-4 px-6 border-b hover:bg-gray-50 transition-all' key={index}>
                        <p className='max-sm:hidden font-medium text-gray-700'>{index + 1}</p>
                        <div className='flex items-center gap-3'>
                            <img className='w-10 h-10 rounded-full object-cover' src={item.userData.image} alt="" />
                            <p className='font-medium text-gray-800'>{item.userData.name}</p>
                        </div>
                        <p className='max-sm:hidden font-medium'>{calculateAge(item.userData.dob)}</p>
                        <p className='text-gray-700'>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                        <div className='flex items-center gap-3'>
                            <img className='w-10 h-10 rounded-full bg-gray-200 object-cover' src={item.docData.Image || item.docData.image} alt="" />
                            <p className='font-medium text-gray-800'>{item.docData.name}</p>
                        </div>
                        <p className='font-semibold text-gray-800'>{currency}{item.docData.fees}</p>
                        {item.cancelled 
                        ? <p className='text-red-500 text-sm font-medium px-3 py-1 bg-red-50 rounded-full'>Cancelled</p>
                        :<img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer hover:scale-110 transition-all' src={assets.cancel_icon} alt="" />
                        }
                    </div>
                ))}

            </div>

        </div>
    )
}

export default AllAppointments