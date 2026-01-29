
import contactUs from "../models/contactUsModel.js";
export const showregisteredProblem=async (req,res,next)=>{
     try{
           const reports= await contactUs.find({});
       if (reports.length === 0) {
   return res.status(404).json({
    success: false,
    message: "No reports found",
  });
}
       return res.status(200).json({
            success:true,
            reports
        })
     }
     catch(e){
        res.status(500).json({
            message:"problem in catch",
           data: e.message
        })
     }
}

export const registerProblem= async(req,res,next)=>{
   const {name,email,message}=req.body;
   if(!name||!email||!message){
    return res.status(400).json({
        success:false,
        message:"every field is required"
    })
   }
   const report= await contactUs.create({
    name,
    email,
    message
   })
   
   await report.save();

   return res.status(200).json({
    success:true,
    report
   })
}