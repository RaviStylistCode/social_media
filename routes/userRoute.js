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
} = require("../controllers/userController");

const router = express.Router();

const { isAuthenticated } = require("../middlewares/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticated, logoutUser);
router.route("/me").get(isAuthenticated, myProfile);

router.route("/follow/:id").get(isAuthenticated, followAndUnfollow);
router.route("/updatepassword").put(isAuthenticated, updatePassword);
router.route("/update/profile").put(isAuthenticated, updateProfile);

router.route('/delete/me').delete(isAuthenticated,deleteMyProfile); 
router.route('/alluser').get(isAuthenticated,AllUsers);
router.route('/followed/:id').get(isAuthenticated,getUserProfile); 

module.exports = router;
