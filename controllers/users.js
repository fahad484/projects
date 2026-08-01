const User = require("../models/user.js");

module.exports.getsignupRoute = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.postsignupRoute = async(req,res)=>{
    try{
        let{username , email ,password } =req.body;
        const newuser = new User({ email,username});
        const registereduser = await User.register(newuser,password);
        // console.log(registereduser);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");

        });
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}

module.exports.getloginRoute = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postloginRoute = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logoutRoute = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}