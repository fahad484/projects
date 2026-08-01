const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
// const { reviewSchema} = require("../schema.js");
// const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review =require("../models/review.js");
const {validateReview , isLoggedIn,isReviewAuthor}=require("../middleware.js");

const controllers = require("../controllers/reviews.js");

//Reviews
//post  REVIEW route
router.post("/", isLoggedIn,validateReview,wrapAsync( controllers.reviewRoute));

//DELETE REVIEW ROUTE
router.delete("/:reviewid",isLoggedIn, isReviewAuthor,wrapAsync(controllers.destroyreviewRoute));

module.exports = router;