if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app =express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Listing =require("./models/listing.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;



const flash= require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");

const listingRouter=require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const wrapAsync = require('./utils/wrapAsync.js');



const DB_Url=process.env.ATLASDB_URL;


main().then(()=>{
    console.log("connection successful");
    
    }).catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(DB_Url);
}

const store = MongoStore.create({
    mongoUrl:DB_Url,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
    //in sec
});

store.on("error",(err)=>{
    console.log("ERROR inmongosession store",err);
});

const sessionOptions = {
    store:store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() +1000*60*60*24*7,
        maxAge : 1000*60*60*24*7,
        httpOnly : true,
    }
}
app.get("/",(req,res)=>{
    res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error =req.flash("error");
    res.locals.userStatus = req.user;
    next();
})

//navbar search dynamic element add--> location and category
        app.use(wrapAsync(async (req, res, next) => {
            res.locals.locations = await Listing.distinct("location");
            res.locals.categories = await Listing.distinct("category");
            next();
        }));



app.use(methodoverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.listen(8080,()=>{
    console.log('app is running at port 8080');
});



//middleware to catch error for page not found
app.all("/*splash",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let{statusCode= 500 ,message="something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});