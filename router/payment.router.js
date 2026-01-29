import { Router } from "express";
import { jwttoken } from "../middleware/auth.middleware.js";
import { paymentapikey,buysubscription,verifysubscription } from "../controller/payment.controller.js";
const router=Router();

router.route('/apikey').get(jwttoken,paymentapikey);
router.route('/subscription').post(jwttoken,
    buysubscription);
router.route('/verify').post(jwttoken,verifysubscription);


export default router