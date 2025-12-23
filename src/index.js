import "dotenv/config";
import connectDB from "./config/db.js";
import app from "./app.js";

const startServer = async () => {
    try{
        await connectDB();
        
        app.listen(process.env.PORT || 4000 , ()=>{
            console.log(`Server is running on port : ${process.env.PORT}`);
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to start the server",
            error: error.message
        });
    }
}

startServer();