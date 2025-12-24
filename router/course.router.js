import { Router } from "express";
import {jwttoken,isauthorized}from "../middleware/auth.middleware.js";
import  upload  from "../middleware/multtt.js";
import { getallcourses,createcourses ,updatecourse,deletecourse} from "../controller/course.controller.js";

const router=Router();
 
router.route("/")
.get(getallcourses)
.post(jwttoken,isauthorized,upload.single("thumbnail"),createcourses)

router.route("/:id")
.post(jwttoken,isauthorized,updatecourse)
.delete(jwttoken,isauthorized,deletecourse)

export default router;