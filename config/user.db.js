import mongoose from "mongoose";
const MONGOURL=process.env.MONGO_URL;
const connecttodb=async()=>{
    try{
        console.log("MONGO_URI =", MONGOURL);

        const conn= await mongoose.connect(MONGOURL);
        if(conn){
            console.log("user database is connected");
        }
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
};
export default connecttodb;
