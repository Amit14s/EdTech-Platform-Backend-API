
import {Schema,model} from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
const userschema = new Schema({
    name:{
        type:String,
        lowercase:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilepic:{
        type:String,
        default:null

    },
    role:{
      type:String,
      enum:["user","admin"],
      default:"user"
    },
    forgotpasswordtoken:String,
    forgotpasswordexpiry:Date
},{
    timestamps:true
});

userschema.pre('save', async function(next){
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userschema.methods.generatejwttoken = function () {
    return JWT.sign(
        { id: this._id, email: this.email ,role:this.role},
        "mynameisamiyt",
        { expiresIn: "7d" }
    );
};
userschema.methods.generateforgotpasswordtoken = function () {
    const resetpasswordtoken=crypto.randomBytes(32).toString('hex');

    this.forgotpasswordtoken=crypto.createHash('sha256').update(resetpasswordtoken).digest('hex');
    this.forgotpasswordexpiry=Date.now()+15*60*1000;
    return resetpasswordtoken;
};

const user=model('user',userschema);
export default user