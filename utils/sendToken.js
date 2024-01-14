
const sendToken=(user,res,statusCode,message)=>{
    const token= user.getJwt();
    const options={
        httpOnly:true,
        maxAge:process.env.Jwt_expiry * 60 * 1000
    }

    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        message,
        user,
        token
    })
}

module.exports=sendToken;