import JWT from "jsonwebtoken"

const jwttoken=(req,res,next)=>{
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
const isauthorized=(...roles)=>(req,res,next)=>{
   try{
    const currentRole=user.req.role;
   if(!roles.includes(currentRole))return res.status(400).jsoon({
    message:"you do not have permisssion to do this task"
   })
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