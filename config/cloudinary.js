import {v2 as cloudinary} from "cloudinary";
 cloudinary.config({
    cloud_name:process.env.CLOUD_NAME||"dkhn0lsla",
    api_key:process.env.CLOUD_API||'656546488192244',
    api_secret:process.env.CLOUD_SECRET||'AcMAdo67hOsjYDQrFFBp3CvWfRc'
 })
 export default cloudinary;