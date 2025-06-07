const express=require("express");
const router=express.Router();
const User=require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware/loggedin.js");
const usersController=require("../controllers/users");

//signup
router.get("/signup",usersController.sigupRender);


router.post("/signup",wrapAsync(usersController.signup));


//login

router.get("/login",usersController.loginRender);

router.post("/login",
    saveRedirectUrl,
     passport.authenticate("local", { failureRedirect: '/login',failureFlash:true })
     ,usersController.loginRoute);

 
 router.get("/logout",usersController.loginDelete);


module.exports=router