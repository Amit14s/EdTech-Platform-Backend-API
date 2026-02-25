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
    success:true,
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
    console.log(generatedSignature==signature)
    if(generatedSignature !==signature){
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
    const Payment= await payment.create({
    payment_id: payment_id,
    subscription_id:subscription_id,
    payment_signature:signature,
    })
    // 3️⃣ Update user subscription status
    const User = await user.findById(req.user.id);

    User.subscription.id = subscription_id;
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

export const unsubscribe=async (req,res,next)=>{
     try{

      const id=req.user.id;
      const people= await user.findById(id);
      if (!people.subscription.id) {
      return res.status(400).json({
        success: false,
        message: "No active subscription found",
      });
    }
      const subscription_id=people.subscription.id;
      const subscription= await razorpay.subscriptions.cancel(subscription_id,{ cancel_at_cycle_end: 0 } );
       people.subscription.id=""
   people.subscription.status="Not Subscribed"

   await people.save();

   res.status(200).json({
     success:true,
      message:'subscription done',
      subscription
   })

     }
     catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } 
}

export const allpayment= async (req,res,next)=>{
  try{
    const count = Number(req.query.count) || 10;

    const payments= await razorpay.subscriptions.all({
      count:count||10
    });
    return res.status(200).json({
     success:true,
      payments
    })
  }
   catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } 
}


