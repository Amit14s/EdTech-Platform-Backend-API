import { Schema,model } from "mongoose"

const contactUsSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    resolved:{
        type:String
    }
})

const contactUs=model('contactUs',contactUsSchema);
export default contactUs
