import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointment = () => {

    const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)

    const {calculateAge, slotDateFormat, currency} = useContext(AppContext)

    useEffect(()=>{
        if(dToken){
            getAppointments()
        }
    },[dToken])

    return (
        <div className="w-full max-w-6xl m-5">
            <p className="mb-5 text-2xl font-semibold text-gray-800">All Appointments</p>

            <div className="bg-white border rounded-lg shadow-sm text-sm max-h-[80vh] overflow-y-scroll">

                <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-4 px-6 border-b bg-gray-50">
                    <p className="font-semibold text-gray-700">#</p>
                    <p className="font-semibold text-gray-700">Patient</p>
                    <p className="font-semibold text-gray-700">Payment</p>
                    <p className="font-semibold text-gray-700">Age</p>
                    <p className="font-semibold text-gray-700">Date & Time</p>
                    <p className="font-semibold text-gray-700">Fees</p>
                    <p className="font-semibold text-gray-700">Action</p>
                </div>

                {
                   appointments.reverse().map((item,index)=>(
                        <div className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-600 py-4 px-6 border-b hover:bg-gray-50 transition-all" key={index}>
                            <p className="max-sm:hidden font-medium text-gray-700">{index + 1}</p>
                            <div className="flex items-center gap-3">
                                <img className="w-10 h-10 rounded-full object-cover" src={item.userData.image} alt="" /> <p className="font-medium text-gray-800">{item.userData.name}</p>
                            </div>
                            <div>
                                <p className="text-xs inline border border-primary px-2 py-1 rounded-full font-medium">
                                    {item.payment ? 'Online' : 'Cash'}
                                </p>
                            </div>
                            <p className="max-sm:hidden font-medium">{calculateAge(item.userData.dob)}</p>
                            <p className="text-gray-700">{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                            <p className="font-semibold text-gray-800">{currency}{item.amount}</p>
                            {
                                item.cancelled
                                ? <p className='text-red-500 text-sm font-medium'>Cancelled</p>
                                : item.isCompleted
                                  ? <p className='text-green-500 text-sm font-medium'>Completed</p>
                                  :<div className="flex gap-2">
                                <img onClick={()=>cancelAppointment(item._id)} className="w-10 cursor-pointer hover:scale-110 transition-all" src={assets.cancel_icon} alt="" />
                                <img onClick={()=>completeAppointment(item._id)} className="w-10 cursor-pointer hover:scale-110 transition-all" src={assets.tick_icon} alt="" />
                                </div>
                            }
                            
                        </div>
                    ))
                }

            </div>

        </div>
    )
}

export default DoctorAppointment;