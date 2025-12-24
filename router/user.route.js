import {Router} from "express";
import { register,login,logout,aboutme,forgotpassword ,resetpassword,changepassword,updater} from "../controller/usercontroller.js";
import {jwttoken ,isauthorized}from "../middleware/auth.middleware.js";
import  upload  from "../middleware/multtt.js";
const router=Router();
router.get('/get',(req,res)=>{
       try{
        return res.status(200).json({
            success:true,
            message:"hey the router first get is running correctly"
        })
       }
       catch(err){
        return req.status(400).json({
            success:false,
            message:err.message
        })
       }
    });
router.post('/register',upload.single("profilepic"),register);
router.post('/login',login);
router.post('/logout',logout);
router.post('/aboutme',jwttoken,aboutme);
router.post('/forgot_password',forgotpassword);
router.post('/reset/:resettoken',resetpassword);
router.post('/changepassword',jwttoken,changepassword);
router.post('/update',jwttoken,updater);
export default router;