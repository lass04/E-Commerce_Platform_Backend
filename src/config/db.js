import mongoose from "mongoose";

const connectDB = async () => {

    try{
        
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connection Success\nHost:${connectionInstance.connection.host}`);

    }catch(error){
        console.log("Failed to connect to MongoDB",error.message);
    }
}

export default connectDB;