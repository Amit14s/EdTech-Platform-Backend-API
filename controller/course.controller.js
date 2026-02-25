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
    console.log("1 ")
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
    console.log("2")
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
    console.log("3")
    if(!courses)res.status(400).json({
        message:"cannot create course something went wrong"
    })
    res.status(200).json({
        success:true,
        message:"course created successfully",
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
const getlecture=async(req,res,next)=>{
   try{
     const {courseid}=req.query;
    const cour = await course.findById(courseid);
      if (!cour) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    return res.status(200).json({
        success:true,
        lectures:cour.lectures
    })
   }
   catch(e){
         res.status(400).json({
         message:e.message
    })
    }


}

const addlecture=async (req,res,next)=>{
    console.log("kk0")
    try{
        const { courseid } = req.params;
         console.log("cOURSEID->"+courseid)

     const {title,description,videoUrl}=req.body
     console.log(title,description,videoUrl)
    const cour = await course.findById(courseid);
      if (!cour) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    cour.lectures.push({
        title,
        description,
        lecture: { videoUrl }
    })
    cour.numberofLectures = cour.lectures.length;
     await cour.save();
    return res.status(200).json({
      success: true,
      message: "Lecture added successfully",
      lectures: cour.lectures
    });
    
   }
   catch(e){
         res.status(500).json({
         message:e.message
    })
    }
}
 const deletelecture=async(req,res)=>{
   try{
    const {courseid,lectid}=req.body;
    console.log("courseid:"+ courseid)
    console.log(lectid)
    const foundCourse = await course.findById(courseid);
if(!foundCourse){
    res.status(400).json({
        success:false,
        message:'course not found'
    })
}
foundCourse.lectures = foundCourse.lectures.filter(
   (lec) => lec._id.toString() !== lectid
);

foundCourse.numberofLectures = foundCourse.lectures.length;

await foundCourse.save();
res.status(200).json({
    success:true,
    lectures:foundCourse.lectures
})

   }
    catch(e){
         res.status(500).json({
         message:e.message
    })
    }
}
   



export {
    getallcourses,
    createcourses,
    updatecourse,
    deletecourse,
    getlecture,
    addlecture,
    deletelecture,
}