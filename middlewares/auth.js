const User=require("../models/userModel");
const jwt=require("jsonwebtoken");

exports.isAuthenticated=async(req,res,next)=>{

    const {token}=req.cookies;
    if(!token){
        return res.status(400).json({
            success:false,
            messsage:'Login First'
        })
    }
    const decode= jwt.verify(token,process.env.Jwt_Token)
    req.user= await User.findById(decode._id);
    next();
}