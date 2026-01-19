import validator from 'validator';
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';



// API for adding doctor
const addDoctor = async (req,res) => {

    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file
        
        if (!imageFile) {
            console.log('⚠️  No file received. Check Thunder Client/Postman file upload setup.')
        }

       // checking for all data to add doctor 
       if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
        return res.json({success:false,message:"Missing Details"})
       }

       // validating email format
       if(!validator.isEmail(email)){
        return res.json({success:false,message:"Please enter a valid email"})
       }

       // validating strong password
       if(password.length < 8){
        return res.json({success:false,message:"Please enter a strong password"})
       }

       // hasing doctor password
       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(password, salt)

       let imageUrl = 'https://via.placeholder.com/150'
       
       // upload image to cloudinary (if file is provided)
       if(imageFile){
           try {
               const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                   resource_type: "image",
                   secure: true
               })
               imageUrl = imageUpload.secure_url
           } catch (uploadError) {
               console.log('❌ Cloudinary upload error:', uploadError.message)
               return res.json({success:false, message: `Image upload failed: ${uploadError.message}`})
           }
       } else {
           // Temporary: Use placeholder if no file uploaded
           imageUrl = 'https://via.placeholder.com/150'
       }
       
       // Parse address properly
       let parsedAddress
       try {
           parsedAddress = typeof address === 'string' ? JSON.parse(address) : address
       } catch (e) {
           return res.json({success:false,message:"Invalid address format. Use valid JSON: {\"line1\":\"Street\",\"line2\":\"City\"}"})
       }

       // create doctor object
       const doctorData = {
        name,
        email,
        Image:imageUrl,
        password:hashedPassword,
        speciality,
        degree,
        experience,
        about,
        fees,
        address:parsedAddress,
        date:Date.now()
       }

       const newDoctor = new doctorModel(doctorData)
       await newDoctor.save()

       res.json({success:true,message:"Doctor added successfully"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API for admin login
const loginAdmin = async (req,res) => {
    try {

        const { email, password } = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({ success: true, token})

        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel 
const allDoctors = async (req,res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all appointements list
const appointmentsAdmin = async (req,res) => {

    try {
        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancelletation
const appointmentCancel = async (req,res) => {

  try {

    const {appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)


    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

    // releasing doctor slot

    const {docId, slotDate, slotTime} = appointmentData

    const docData = await doctorModel.findById(docId)

    let slots_booked = docData.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, {slots_booked})

    res.json({success:true, message:'Appointment cancelled successfully'})
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }

}

// API to get dashboard data for admin panel
const adminDashboard = async (req,res) => {

    try {
        
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({success:true, dashData})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

export { addDoctor,loginAdmin,allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard }