import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connecttodb from "./config/user.db.js";
const PORT=process.env.PORT||5010;
connecttodb();
app.listen(PORT,(req,res)=>{
    console.log(`server is rrunning on port ${PORT}`);
})
