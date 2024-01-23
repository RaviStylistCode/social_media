const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter name"],
  },
  email: {
    type: String,
    required: [true, "please enter email"],
    unique: true,
    validate: [validator.isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter password"],
    minLength:[8,'password must be 8 character long'],
    select:false
  },
  photo: {
    type: String,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  follower: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  resetOtp:Number,
  resetOtpExpiry:Date
  
  
});

userSchema.pre("save",async function(next){
  if(this.isModified("password")){
    const salt= await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
  }
  next();
})

userSchema.methods.getJwt=function(){
return jwt.sign({_id:this._id},process.env.Jwt_Token);
}

userSchema.methods.comparePassword=async function(getpassword){
      return await bcrypt.compare(getpassword,this.password);
}

module.exports = mongoose.model("user", userSchema);
