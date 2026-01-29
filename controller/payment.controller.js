import { razorpay } from "../middleware/auth.middleware.js";
import user from "../models/usermodel.js";
import payment from "../models/paymentModel.js";
export const paymentapikey =(req,res,next)=>{
          res.status(200).json({
            success:true,
            message:"razorpay api key is:",
            key:process.env.RAZOR_PAY_API_KEY
          })
}

export const buysubscription=async (req,res,next)=>{
    console.log("ok")
    const role=req.user.role;
    if(role=='admin'){
        return res.status(400).json({
            success:false,
            message:"admin cant buy subscription"
        })
    }
    const User = await user.findById(req.user.id);
   try{
     const subscription=await razorpay.subscriptions.create({
        plan_id:process.env.RAZOR_PAY_PLAN_ID,
        customer_notify:1,
        total_count: 12
    })
console.log(subscription);
   User.subscription.id=subscription.id
   User.subscription.status=subscription.status

   await User.save();

   res.status(200).json({
      message:'subscription done',
      subscription
   })
   }
   catch(e){
    res.status(404).json({
        message:e
    })
   }

}

import crypto from "crypto";

export const verifysubscription = async (req, res,next) => {
  try {
    const {
      payment_id,
      subscription_id,
      signature,
    } = req.body;

    // 1️⃣ Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_PAY_SECRET)
      .update(
        payment_id + "|" + subscription_id
      )
      .digest("hex");

    // 2️⃣ Compare signatures
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
    const payment= await payment.create({
    payment_id,
    subscription_id,
    signature,
    })

    // 3️⃣ Update user subscription status
    const User = await user.findById(req.user.id);

    User.subscription.id = razorpay_subscription_id;
    User.subscription.status = "active";

    await User.save();

    res.status(200).json({
      success: true,
      message: "Subscription verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

