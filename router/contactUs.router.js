import { Router } from "express";
import { jwttoken,isauthorized } from "../middleware/auth.middleware.js";
import { registerProblem,showregisteredProblem } from "../controller/contactU.controller.js";
const router=Router();

router.route('/').post(registerProblem).get(jwttoken,isauthorized("admin"),showregisteredProblem)

export default router