import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log('✅ MongoDB connected successfully')
    })

    await mongoose.connect(`${process.env.MONGODB_URI}`, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
}

export default connectDB;
