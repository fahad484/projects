const Listing =require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema ,reviewSchema} = require("./schema.js");
const Review =require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be Logged in to continue!");
        return res.redirect("/login");  // return otherwise express will trigger two res state one here and one in next()
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

module.exports.isowner = async(req,res,next)=>{
    let{id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.userStatus._id)){
        req.flash("error","you are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map(el=> el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }

}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map(el=> el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }

}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let{id, reviewid}=req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.userStatus._id)){
        req.flash("error","you are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

