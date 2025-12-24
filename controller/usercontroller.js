import user from "../models/usermodel.js"
import bcrypt from "bcryptjs";
import sendmail from "../model/sendmail.js";
import crypto from "crypto";
import cloudinary from "../config/cloudinary2.js";
import fs from "fs";
const deletelocal=(path)=>{
    fs.unlink(path,()=>{})
}
const cookieoption={
maxAge:7*24*60*60*1000,
httpOnly:true,
secure:true
}
const register=async (req,res,next)=>{
    const {name,email,password}=req.body;
    if(!name||!email||!password){
        return res.status(400).json({
            message:"all fields are required"
        })
    }
    const userexits=await user.findOne({email});
    if(userexits){
        return res.status(400).json({
            message:"user already exits"
        })
    }
    let profilepicurl=null;
    if(req.file){
         const uploadr = await cloudinary.uploader.upload(req.file.path, { folder: "profile" });
    profilepicurl = uploadr.secure_url;

   
    deletelocal(req.file.path);
    }
   
    const person=await user.create({
        name,
        email,
        password,
        profilepic:profilepicurl
    });
    if(!person){
        return res.status(400).json({
            message:"user registration failed plese try again later"
        })
    }
    const token=await person.generatejwttoken();
    res.cookie('token',token,cookieoption);
    person.password=undefined;
    res.status(200).json({
        success:true,
        message:"user registered successfully",
        person
    })
}

const login=async(req,res,next)=>{
    const{email,password}=req.body;
    if(!email||!password){
        return res.status(400).json({
            message:"every field is required"
        })
    }
    const person=await user.findOne({email});
    if(!person){
        return res.status(400).json({
            message:"user not found"
        })
    }
    const isMatch = await bcrypt.compare(password, person.password);
    if(!isMatch){
        return res.status(400).json({
            message:"wrong password"
        })
    }

    const token=person.generatejwttoken();
    res.cookie('token',token,cookieoption);
    res.status(200).json({
        success:true,
        message:"user logged in succcessfully",
        person
    })
}

const logout=async (req,res,next)=>{
    try{
        res.clearCookie("token",cookieoption);
    res.status(200).json({ message: "Logged out successfully" });
    }
    catch(err){
        return res.status(400).json({
            message:err
        })
    }
}
const aboutme=async(req,res,next)=>{
   const userid=req.user.id;
   const people=await user.findById(userid);
   if(!people)return res.status(400).json({message:"no data"});
   res.status(200).json({
    user:people
   })
}

const forgotpassword=async(req,res,next)=>{
   const { email } = req.body;    
   const person=await user.findOne({email});
   if(!user){
    res.status(400).json({
        success:false,
        message:"email not registered"
    })
   }
   const resetpasswordtoken=person.generateforgotpasswordtoken();
   await person.save();
   if(!resetpasswordtoken){
     forgotpasswordtoken=undefined;
    forgotpasswordexpiry=undefined;
    res.status(400).json({
       
        message:"token not generated"
    })
   }
   const send=sendmail(resetpasswordtoken);
   if(send){
    console.log(resetpasswordtoken);
    res.status(200).json({
        message:`the reset password  token is sent to ${email}`
    })
   }
}
const resetpassword=async (req,res,next)=>{
    const {resettoken} = req.params;
    const {password}=req.body;
     const forgotpasswordtoken = crypto.createHash('sha256').update(resettoken).digest('hex');
     const people=await user.findOne({
        forgotpasswordtoken,
        forgotpasswordexpiry:{$gt:Date.now()}
     })
     if(!people){
        res.status(400).json({
            message:"sesion expired url does not work"
        })
     }
     people.password=password;
     people.forgotpasswordtoken=undefined;
     people.forgotpasswordexpiry=undefined;
     await people.save();
     res.status(200).json({
        message:"password changed successfully"
     })
}
const changepassword= async (req,res,next)=>{
        const{oldpass,newpass}=req.body;
      if(!oldpass||!newpass)res.status(400).json({
        success:false,
        message:"every field is required!!!!"
      })
      const id=req.user.id;
      const person=await user.findById(id);
      if(!person)res.status(4000).json({
        message:"something went wrong"
      })
      const com=await bcrypt.compare(oldpass,person.password);
      if(!com)res.status(400).json({
        message:"old password is wrong,i.e, it do not match!!!!!!!"
      })
      person.password=newpass;
      await person.save();
      res.status(200).json({
        message:"paswwword changed successfully"
      })
      person.password=undefined;
}
const updater=async(req,res,next)=>{
     const id=req.user.id;
     const people=await user.findByIdAndUpdate(
        id,
        {
            $set:req.body
        },
        {
            new:true,
            runValidators:true
        }
     )
     if(!people){
        res.status(400).json({
            succes:false,
            message:"something went wrong!!!!!!!"
        })
     }
     res.status(200).json({
        success:true,
        message:"updated successfully"
     })

};
export {
    register,
    login,
    logout,
    aboutme,
    forgotpassword,
    resetpassword,
    changepassword,
    updater
}