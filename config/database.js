const mongoose=require("mongoose");

const connectDatabase=async()=>{
try {
    const {connection}= await mongoose.connect(process.env.Mongo_Uri)
    console.log(`Database is connected with ${connection.host}`)
} catch (error) {
    console.log(`database Error : ${error.message}`)
}}

module.exports=connectDatabase;