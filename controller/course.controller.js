import course from "../models/coursemodel.js";
import cloudinary from "../config/cloudinary.js";

const getallcourses=async(req,res,next)=>{
   try{
     const courses= await course.find({}).select('-lectures');
    if(!courses)res.status(400).json({
        success:false,
        message:"something wentr wrong!!!!!"
    })
    res.status(200).json({
        success:true,
        courses
    })
   }
   catch(e){
    res.status(400).json({
        message:e.message
    })
   }
   
}
const createcourses=async (req,res,next)=>{
   try{
     const {title,description,category,createdBy}=req.body;
    if(!title||!description||!category||!createdBy){
       return  res.status(400).json({
            message:"every field is required"
        })
    }
    let uploader=null;
    
    if(req.file){
         uploader=await cloudinary.uploader.upload(req.file.path,{
            folder:"course/templates"
        });
    }
    const courses= await course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail:uploader?{
            public_id:uploader.public_id,
            secure_url:uploader.secure_url,
        }
        :{
            public_id:"",
            secure_url:"",
        }
    })
    if(!courses)res.status(400).json({
        message:"cannot create course something went wrong"
    })
    res.status(200).json({
        message:"course crated successfully",
        courses,
    })
   }
   catch(e){
    res.status(400).json({
        message:e.message
    })
   }
}

const updatecourse=async(req,res,next)=>{
    try{
       const {id}=req.params;
       const upcourse=await course.findByIdAndUpdate(
        id,{
            $set:req.body,
        },
        {
            new:true,
            runValidators:true

        }
       );
       if(!upcourse)return res.status(400).json({message:"something went wrong cannot update"});
       await upcourse.save();
       return res.status(200).json({message:`course ${upcourse.title} is updated successfully`})
    }
    
    catch(e){
         res.status(400).json({
        message:e.message
    })
    }
};
const deletecourse=async(req,res,next)=>{
     try{
     const {id} = req.params;
     const delcourse=await course.findByIdAndDelete(id);
     if(!delcourse)return res.status(400).json({message:"something went wrong cannot delete"});
     return res.status(200).json({message:`course ${delcourse.title} deleted successfully`});
    }
    catch(e){
         res.status(400).json({
        message:e.message
    })
    }
}
   



export {
    getallcourses,
    createcourses,
    updatecourse,
    deletecourse,
}