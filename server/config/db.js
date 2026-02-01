import mongoose from "mongoose";

export const connectDB = async () => {
     mongoose.connect(process.env.MONGO_URI,{
        dbName:"Project_Management_system"
     }).then(()=>{
        console.log("MonoDB Connnected");
        
     }).catch(err=>{
        console.log("Database Connection falied.",err);
        
     })
}
