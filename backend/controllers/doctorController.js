import doctorModel from "../models/doctorModel.js";


const changeAvailability = async (req,res) => {
    try {

        const {docId} = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
        res.json({success:true, message:'Availability Changed'})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const doctorList = async (req,res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password','-email'])
        
        // Map Image field to image for frontend compatibility
        const doctorsWithLowercaseImage = doctors.map(doc => ({
            ...doc.toObject(),
            image: doc.Image,
            Image: undefined
        }))
        
        res.json({success:true, doctors: doctorsWithLowercaseImage})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {changeAvailability, doctorList};  