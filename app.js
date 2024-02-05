const express= require("express");
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const cors =require("cors");

const app=express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(cors({
//     origin: "*",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false,
//     optionsSuccessStatus: 204
//   }));

const userRouter=require("./routes/userRoute");
const postRouter=require("./routes/postRoute");

app.use("/api/v1/users",userRouter);
app.use("/api/v1/posts",postRouter);
app.use("/uploads",express.static('uploads'));


module.exports=app;