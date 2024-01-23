const mongoose=require("mongoose");

const postSchema= new mongoose.Schema({

    caption:String,
    photo:{
        type:String,
        required:[true,'please add an image']
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },

    createdAt:{
        type:Date,
        default:Date.now
    },

    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],

    comments:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'user'
            },
            comment:{
                type:String,
                required:true
            }  
        }
    ],
    
    numOfView:{
        type:Number,
        default:0
    }
    
});

module.exports= mongoose.model("post",postSchema);