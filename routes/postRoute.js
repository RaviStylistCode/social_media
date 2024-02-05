const express = require("express");
const {
  uploadPost,
  likeAndUnlikePost,
  deleteSinglePost,
  getPostOfFollowing,
  updateCaption,
  addComments,
  singlePost,
  deleteallPost,
} = require("../controllers/postController");
const { isAuthenticated } = require("../middlewares/auth");
const { fileupload } = require("../middlewares/multer");

const router = express.Router();

router.route("/upload").post(isAuthenticated,fileupload ,uploadPost);

router
  .route("/:id")
  .get(isAuthenticated, likeAndUnlikePost)
  .put(isAuthenticated, updateCaption)
  .delete(isAuthenticated, deleteSinglePost);

router.route("/single/:id").get(isAuthenticated,singlePost);
router.route("/").get(isAuthenticated, getPostOfFollowing);
router.route("/comment/:id").put(isAuthenticated,addComments);
router.route("/delete/all").delete(isAuthenticated,deleteallPost);

module.exports = router;
