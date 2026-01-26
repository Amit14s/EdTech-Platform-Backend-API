import mongoose from "mongoose";
const MONGOURL=process.env.MONGO_URL;
const connecttodb=async()=>{
    try{
        const conn=mongoose.connect(MONGOURL)||'mongodb+srv://amitmouar098:Amit%40123@m0.zzp5hsu.mongodb.net/?appName=M0';
        if(conn){
            console.log("user database is connected");
        }
    }
    catch(err){
        console.log("error ocured in database");
        process.exit(1);
    }
};
export default connecttodb;
