import { Schema,model } from "mongoose";

const paymentSchema=new Schema({
    payment_id:{
        type:String,
        required:true
    },
    payment_signature:{
        type:String,
        required:true
    },
    subscription_id:{
        type:String,
        required:true
    }
})
const payment=model('payment',paymentSchema)
export default payment