const express=require("express");
const router=express.Router();
const User=require("../models/user.js")
const wrapAsyc = require("../utils/wrapAsyc");
const passport=require("passport")
const {saveRedirectUrl}=require("../middleware.js")

const userController=require("../controllers/users.js")


router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsyc(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{
 failureRedirect:"/login",
 saveRedirectUrl,
 failureFlash:true,
}),
userController.login
);
router.get("/logout",userController.logout);















module.exports=router;