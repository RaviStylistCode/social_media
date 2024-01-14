const app=require("./app");
const connectDatabase = require("./config/database");


require("dotenv").config({
    path:'./config.env'
})
connectDatabase();

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})