import mongoose from "mongoose";
const MONGOURL=process.env.MONGO_URL;
const connecttodb=async()=>{
    try{
        const conn= await mongoose.connect(MONGOURL);
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
