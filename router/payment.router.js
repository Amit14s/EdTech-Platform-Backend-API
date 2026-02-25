import { Router } from "express";
import { jwttoken,isauthorized } from "../middleware/auth.middleware.js";
import { paymentapikey,buysubscription,verifysubscription,unsubscribe,allpayment } from "../controller/payment.controller.js";

const router=Router();

router.route('/apikey').get(jwttoken,paymentapikey);
router.route('/subscription').post(jwttoken,
    buysubscription);
router.route('/verify').post(jwttoken,verifysubscription);
router.route('/cancel').post(jwttoken,unsubscribe);
router.route('/all').post(jwttoken,isauthorized('admin'),allpayment)


export default router