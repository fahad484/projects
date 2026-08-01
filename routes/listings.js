const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema } = require("../schema.js");
const{isLoggedIn, isowner ,validateListing}= require("../middleware.js");

const controllers = require("../controllers/listings.js");

const multer  = require('multer')
const{storage}=require("../cloudconfig.js");
const upload = multer({storage});


router.route("/")
.get( wrapAsync(controllers.index ))
.post(isLoggedIn,upload.single("listing[image]"), validateListing ,wrapAsync( controllers.newRoute));
 

//create route
router.get("/new",isLoggedIn, controllers.createRoute);

//category route
router.get("/category",wrapAsync(controllers.categoryRoute));

//search route
router.get("/search",controllers.searchRoute);

router.route("/:id")
.get( wrapAsync( controllers.showRoute))
.put(isLoggedIn,isowner,upload.single("listing[image]"),validateListing , wrapAsync(controllers.updateRoute))
.delete(isLoggedIn,isowner,wrapAsync( controllers.destroyRoute));



// index route
// router.get("/",wrapAsync(controllers.index ));




//show route
// router.get("/:id", wrapAsync( controllers.showRoute));
//new route
// router.post("/",isLoggedIn, validateListing ,wrapAsync( controllers.newRoute));

//edit route
router.get("/:id/edit",isLoggedIn,isowner,wrapAsync( controllers.editRoute));

//update route
// router.put("/:id",isLoggedIn,isowner,validateListing , wrapAsync(controllers.updateRoute));

//delete route
// router.delete("/:id",isLoggedIn,isowner,wrapAsync( controllers.destroyRoute));

module.exports = router;  