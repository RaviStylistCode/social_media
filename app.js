const express= require("express");
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const cors =require("cors");

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors());

const userRouter=require("./routes/userRoute");
const postRouter=require("./routes/postRoute");

app.use("/api/v1/users",userRouter);
app.use("/api/v1/posts",postRouter);
app.use("/uploads",express.static('uploads'))


module.exports=app;