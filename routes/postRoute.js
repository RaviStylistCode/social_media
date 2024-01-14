const express = require("express");
const {
  uploadPost,
  likeAndUnlikePost,
  deleteSinglePost,
  getPostOfFollowing,
  updateCaption,
  addComments,
} = require("../controllers/postController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.route("/upload").post(isAuthenticated, uploadPost);

router
  .route("/:id")
  .get(isAuthenticated, likeAndUnlikePost)
  .put(isAuthenticated, updateCaption)
  .delete(isAuthenticated, deleteSinglePost);

router.route("/").get(isAuthenticated, getPostOfFollowing);
router.route("/comment/:id").put(isAuthenticated,addComments);

module.exports = router;
