import multer from "multer";

const storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,"uploads/"),
    filename:(req,file,cb)=>cb(null,Date.now()+"-"+file.originalname)
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image/")){
        cb(null,true);
    }
    else{
        cb(new Error("only image file is allowed"),false)
        
    }
}
const upload=multer({
    storage:storage,
    fileFilter:fileFilter
})

export default upload