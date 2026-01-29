import JWT from "jsonwebtoken"
import Razorpay from "razorpay";
const jwttoken=(req,res,next)=>{
    console.log('kkkkk')
    const token=(req.cookies && req.cookies.token)||null;
    if(!token) return res.status(400).json({
        success:false,
        message:"no cokie present"
    })
    try{
        const payload=JWT.verify(token,process.env.SECRET);
        req.user={id:payload.id,email:payload.email,role:payload.role};
    }
    catch(err){
   
        return res.status(400).json({mesage:err.message});
  }
    
    next();
}
 

export const razorpay=new Razorpay({
    key_id:process.env.RAZOR_PAY_API_KEY,
    key_secret:process.env.RAZOR_PAY_SECRET
})


const isauthorized=(...roles)=>(req,res,next)=>{
   try{
    console.log("a1")
    const currentRole=req.user.role;
   if(!roles.includes(currentRole))return res.status(400).json({
    message:"you do not have permisssion to do this task"
   })
   console.log("a2")
   next()
   }
   catch(err){
   
        return res.status(400).json({mesage:err.message});
  }
}
export  {
    jwttoken,
    isauthorized,
}