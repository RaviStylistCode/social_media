const Post = require("../models/postModel");
const User = require("../models/userModel");
const asyncError = require("../middlewares/asyncError");

//post create kar bhai
exports.uploadPost = asyncError(async (req, res) => {

  const {caption}=req.body;
  const photo=req.file;
  if(!photo){
    return res.status(400).json({
      success:false,
      message:"please add an image"
    })
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user does not exist",
    });
  }

  const options = {
    caption: caption,
    photo: photo.path,
    owner: req.user._id,
  };

  const post = await Post.create(options);

  user.posts.push(post._id);
  await user.save();

  res.status(201).json({
    success: true,
    message: "post uploaded",
    post,
  });
});

//like or unlike post
exports.likeAndUnlikePost = asyncError(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "post does not exist",
    });
  }

  if (post.likes.includes(req.user._id)) {
    const index = post.likes.indexOf(req.user._id);
    post.likes.splice(index, 1);
    await post.save();

    res.status(200).json({
      success: true,
      message: "post Unliked",
    });
  } else {
    post.likes.push(req.user._id);
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post Liked",
    });
  }
});

//post delete kar bhai
exports.deleteSinglePost = asyncError(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user not found",
    });
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).json({
      success: false,
      message: "post not found",
    });
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: "Unauthorize User",
    });
  }

  const postId = post._id;
  await post.deleteOne();

  for(let i=0;i<user.posts.length;i++){
    const index = user.posts[i].indexOf(postId);
    user.posts.splice(index, 1);
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "Post deleted",
  });
});

//delete all post
exports.deleteallPost=asyncError(async(req,res)=>{

  const post = await Post.find();

  if(!post){
    return res.status(404).json({
      success:false,
      message:"post not found"
    });
  }

  for(let i=0;i<=post.length;i++){
    await post[i].deleteOne();
  }

  await post.save();

  res.status(200).json({
    success:true,
    message:`All post deleted successfully`,
    post
  });

})

/// getpost of following user
exports.getPostOfFollowing = asyncError(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user does not exist",
    });
  }
  const posts = await Post.find({
    owner: {
      $in: user.following,
    },
  });

  res.status(200).json({
    success: true,
    message: "Post of Following User",
    posts,
  });
});

// update caption of post
exports.updateCaption = asyncError(async (req, res) => {
  const user = await User.findById(req.user._id);
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).json({
      success: false,
      message: "post not found",
    });
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: "Unauthorized",
    });
  }

  post.caption = req.body.caption;
  await post.save();

  res.status(200).json({
    success: true,
    message: "caption updated",
  });
});

///Add comments
exports.addComments = asyncError(async (req, res) => {
  const user = await User.findById(req.user._id);
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).json({
      success: false,
      message: "post not found",
    });
  }
  const comment = {
    user: req.user._id,
    comment: req.body.comment,
  };
  post.comments.push(comment);
  await post.save();

  return res.status(200).json({
    success: true,
    message: "comment added",
  });
});

exports.singlePost = asyncError(async (req, res) => {

  const post = await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({
            success:false,
            message:"post not found"
        })
    }

  post.numOfView += 1;
  await post.save();

  res.status(200).json({
    success: true,
    message: "single post",
    post,
    
  });
});

exports.allposts=asyncError(async(req,res)=>{

  const post= await Post.find();
  if(!post){
    return res.status(404).json({
      success:false,
      message:"posts not found"
    })
  }

  res.status(200).json({
    success:true,
    post
  })
})
