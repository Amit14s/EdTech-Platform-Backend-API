
import {model,Schema} from "mongoose";

const createSchema=new Schema({
    title:{
        type:String,
        required:[true,'Tiltle is required'],
        minLength:[8,'Title must be atleast 8 character'],
        maxLength:[60,'title should be less than 60 character'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'description is required'],
        minLength:[20,'description must be atleast 8 character'],
        maxLength:[200,'description should be less than 60 character'],
    },
    category:{
        type:String,
        required:[true,'cateogry is required'],

    },
    thumbnail:{
         public_id:{
           type:String,
         },
         secure_url:{
            type:String,
         }
    },
    lectures:[
        {
            title:String,
            description:String,
            lecture:{
                public_id:{
                    type:String,
                    required:true
                    
                },
                secure_url:{
                    type:String,
                    required:true
                }
            }
        }
    ],
    numberofLectures:{
        type:Number,
        default:0,
    },
    createdBy:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
});

const course =model('course',createSchema);
export default course;