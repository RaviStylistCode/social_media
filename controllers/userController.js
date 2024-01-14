const User = require("../models/userModel");
const Post = require("../models/postModel");
const asyncError = require("../middlewares/asyncError");
const sendToken = require("../utils/sendToken");

//register karo bhai
exports.registerUser = asyncError(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "please enter all fields",
    });
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "user already exist",
    });
  }

  user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, res, 201, "Registered Successfully");
});

///login karo bhai
exports.loginUser = asyncError(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({
      success: false,
      message: "please enter all fields",
    });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user does not exist",
    });
  }

  const isMatched = await user.comparePassword(password);
  if (!isMatched) {
    return res.status(400).json({
      success: false,
      message: "password does not match",
    });
  }

  sendToken(user, res, 200, `welcome back ${user.name}`);
});

//Logout karo bhai
exports.logoutUser = asyncError((req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logged out successfully",
  });
});

// profile ke liye bhai
exports.myProfile = asyncError(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user does not exist",
    });
  }

  res.status(200).json({
    success: true,
    message: "myProfile",
    user,
  });
});

//follow and unfollow function
exports.followAndUnfollow = asyncError(async (req, res) => {
  const userTofollow = await User.findById(req.params.id);
  const loggedInuser = await User.findById(req.user._id);

  if (!userTofollow) {
    return res.status(400).json({
      success: false,
      message: "user does not exist",
    });
  }

  if (loggedInuser.following.includes(userTofollow._id)) {
    const indexTofollow = loggedInuser.following.indexOf(userTofollow._id);
    const indexfollowers = userTofollow.follower.indexOf(loggedInuser._id);

    loggedInuser.following.splice(indexTofollow, 1);
    userTofollow.follower.splice(indexfollowers, 1);

    await loggedInuser.save();
    await userTofollow.save();

    res.status(200).json({
      success: true,
      message: "unfollowed",
    });
  } else {
    loggedInuser.following.push(userTofollow._id);
    userTofollow.follower.push(loggedInuser._id);

    await loggedInuser.save();
    await userTofollow.save();

    res.status(200).json({
      success: true,
      message: "followed",
    });
  }
});

//update logged in user password
exports.updatePassword = asyncError(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "please enter old and new password",
    });
  }

  const isMatched= await user.comparePassword(oldPassword);
  if(!isMatched){
    return res.status(404).json({
        success:false,
        message:'invalid old password'
    })
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: false,
    message: "password updated successfully",
  });
});

// Profile update
exports.updateProfile = asyncError(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, email } = req.body;

  if (name) {
    user.name = name;
  }

  if (email) {
    user.email = email;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "profile updated successfully",
  });
});

//delete my Profile
exports.deleteMyProfile=asyncError(async(req,res)=>{

    const user=await User.findById(req.user._id);
    const posts=user.posts;
    const userId=user._id;
    const following=user.following;
    const follower= user.follower;
    await user.deleteOne();

    res.cookie('token',null,{expires:new Date(Date.now())});

    for(let i=0;i<posts.length;i++){
        const post = await Post.findById(posts[i]);
        await post.deleteOne();
    }

    for(let i=0;i<follower.length;i++){
        const followUser= await User.findById(follower[i]);
        const index= followUser.following.indexOf(userId);
        followUser.following.splice(index,1);
        await followUser.save();
    }

    for(let i=0;i<following.length;i++){
        const followingUser= await User.findById(following[i]);
        const index= followingUser.follower.indexOf(userId);
        followingUser.follower.splice(index,1);
        await followingUser.save();
    }

    res.status(200).json({
        success:true,
        message:"user deleted successfully"
    });

})

//getUser profile
exports.getUserProfile=asyncError(async(req,res)=>{

    const user= await User.findById(req.params.id).populate("posts");
    if(!user){
        return res.status(400).json({
            success:false,
            message:"user does not exist"
        })
    }
    res.status(200).json({
        success:true,
        message:"single user profile",
        user
    })
})

//All users
exports.AllUsers=asyncError(async(req,res)=>{
    const users= await User.find();
    if(!users){
        return res.status(400).json({
            success:false,
            message:"users not found"
        })
    }

    res.status(200).json({
        success:true,
        message:"All Users Details",
        users
    })
})
