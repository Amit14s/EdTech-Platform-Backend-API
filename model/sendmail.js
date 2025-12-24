const sendmail=async (token)=>{
   const resetpasswordurl= `/frontend/${token}`;
   return resetpasswordurl;
    
}
export default sendmail;