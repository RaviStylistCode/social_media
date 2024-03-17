const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  myProfile,
  followAndUnfollow,
  updatePassword,
  updateProfile,
  deleteMyProfile,
  AllUsers,
  getUserProfile,
  forgetPassword,
  resetPassword,
  findUserByQuery,
} = require("../controllers/userController");

const router = express.Router();

const { isAuthenticated } = require("../middlewares/auth");
const { fileupload } = require("../middlewares/multer");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticated, logoutUser);
router.route("/me").get(isAuthenticated, myProfile);

router.route("/follow/:id").get(isAuthenticated, followAndUnfollow);
router.route("/updatepassword").put(isAuthenticated, updatePassword);
router.route("/update/profile").put(isAuthenticated, fileupload,updateProfile);

router.route('/delete/me').delete(isAuthenticated,deleteMyProfile); 
router.route('/alluser').get(AllUsers);
router.route("/search").get(findUserByQuery);
router.route('/followed/:id').get(isAuthenticated,getUserProfile); 

router.route("/forget/password").post(forgetPassword);
router.route("/reset/password").post(resetPassword);

module.exports = router;
