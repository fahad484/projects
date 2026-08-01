const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const controllers = require("../controllers/users.js");

router.route("/signup")
.get(controllers.getsignupRoute)
.post( wrapAsync(controllers.postsignupRoute));

router.route("/login")
.get(controllers.getloginRoute)
.post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash : true}),
    wrapAsync(controllers.postloginRoute));



// router.get("/signup",controllers.getsignupRoute);

// router.post("/signup" , wrapAsync(controllers.postsignupRoute));

// router.get("/login",controllers.getloginRoute);

// router.post("/login",saveRedirectUrl,
//     passport.authenticate("local",{failureRedirect:"/login",failureFlash : true}),
//     wrapAsync(controllers.postloginRoute));

router.get("/logout",controllers.logoutRoute)

module.exports = router;