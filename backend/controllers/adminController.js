import validator from 'validator';
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'



// API for adding doctor
const addDoctor = async (req,res) => {

    try {
        // Debug logging
        console.log('=== Request Debug ===')
        console.log('req.body:', req.body)
        console.log('req.file:', req.file)
        console.log('Content-Type:', req.headers['content-type'])
        
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

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

       let imageUrl = ''
       
       // upload image to cloudinary (if file is provided)
       if(imageFile){
           try {
               const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                   resource_type: "image",
                   secure: true
               })
               imageUrl = imageUpload.secure_url
               console.log('✅ Image uploaded to Cloudinary:', imageUrl)
           } catch (uploadError) {
               console.log('❌ Cloudinary upload error:', uploadError.message)
               return res.json({success:false, message: `Image upload failed: ${uploadError.message}`})
           }
       } else {
           // Temporary: Use placeholder if no file uploaded
           imageUrl = 'https://via.placeholder.com/150'
           console.log('⚠️ No image file received - using placeholder')
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
        Image:imageUrl,  // Capital I to match database schema
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

export { addDoctor,loginAdmin }