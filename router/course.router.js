import { Router } from "express";
import {jwttoken,isauthorized}from "../middleware/auth.middleware.js";
import  upload  from "../middleware/multtt.js";
import { getallcourses,createcourses ,updatecourse,deletecourse,getlecture,addlecture,deletelecture} from "../controller/course.controller.js";
const router=Router();
 
router.route("/")
.get(getallcourses)
.post(jwttoken,isauthorized('admin'),upload.single("file"),createcourses)

router.route('/lectures').get(jwttoken,getlecture).delete(jwttoken,isauthorized('admin'),deletelecture)
router.route("/:id")
.post(jwttoken,isauthorized('admin'),updatecourse)
.delete(jwttoken,isauthorized('admin'),deletecourse)


router.route(
  "/:courseid/lectures").post(
  jwttoken,
  isauthorized("admin"),
  addlecture
);

export default router;