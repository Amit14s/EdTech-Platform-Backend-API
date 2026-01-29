import express from "express";
import cookie from "cookie-parser";
import cors from "cors"
const app=express();
app.use(express.json());
app.use(cookie());
app.use(cors({
origin:process.env.FRONTEND_URL, // frontend URL
credentials: true,               // REQUIRED for cookies
methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use(express.urlencoded({extended:true}));
import userrouter from "./router/user.route.js";
import courserouter from "./router/course.router.js";
import paymentrouter from "./router/payment.router.js"
import contactrouter from "./router/contactUs.router.js"

app.get('/ping',(req,res)=>{
    console.log("app is running");
    res.send("pONg");
})
app.use("/user",userrouter);
app.use("/course",courserouter);
app.use("/payment",paymentrouter);
app.use("/contactUs",contactrouter);
export default app;