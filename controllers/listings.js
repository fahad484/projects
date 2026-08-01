const Listing =require("../models/listing.js");


const api_key= process.env.MAP_KEY;



module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}


module.exports.createRoute = (req,res)=>{
    res.render("listings/create.ejs");
}

module.exports.showRoute = async(req,res)=>{
    let { id }=req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you are requesting does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.newRoute = async(req,res,next)=>{

    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(req.body.listing.location)}&limit=1&apiKey=${process.env.MAP_KEY}`);
    const data = await response.json();

    let url = req.file.path;
    let filename = req.file.filename;

    const listing = new Listing(req.body.listing);
    listing.owner =req.user._id;
    console.log(req.body.listing);
    listing.image = { url ,filename };

    listing.geometry = data.features[0].geometry;
    let newlisting = await listing.save();
    console.log(newlisting);
    req.flash("success","new listing created successfully!");
    res.redirect("/listings");

}
module.exports.categoryRoute =async(req,res)=>{
    let {category}= req.query;
    let allListings =await Listing.find({category});
    
    // console.log(listings);
    
    // if( typeof listings[0] == "undefined" ) this is also correct but below is more accurate

    if( allListings.length === 0  ){     
        req.flash("success",`Listings relevent to ${category}!`);
        return res.redirect("/listings");   
    }
    res.render("listings/index.ejs",{allListings});
  
}

module.exports.searchRoute = async(req,res)=>{
    let { query , location , category ,price}=req.query;
   
    console.log(query,location,category,price);

    let filter={};

    if(query){
        filter.title={
            $regex:query,
            $options:"i",
        }
    }
    if(location){
        filter.location={
            $regex:location,
            $options:"i",
        }
    }
    if(category){
        filter.category={
            $regex:category,
            $options:"i",
        }
    }
    if(price){
        if(price === "1000-7000"){
            filter.price={$gte:1000 ,$lte:7000};
        }else if(price === "8000-15000"){
            filter.price ={$gte:8000 ,$lte:15000};
        }else if(price ==="15000"){
            filter.price ={gte:15000};
        }
        
    }
    let allListings =await Listing.find(filter);

    if(allListings.length === 0){
        req.flash("error","No listings found!");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs",{allListings});

}

module.exports.editRoute = async(req,res)=>{
    let{id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are requesting does not exist!");
        res.redirect("/listings");
    }

    let originalimageurl = listing.image.url;
    originalimageurl = originalimageurl.replace("upload/","upload/h_300,w_250/")
    res.render("listings/edit.ejs",{listing , originalimageurl});
}

module.exports.updateRoute =  async(req,res)=>{

    // if(!req.body || !req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing.");
    // }
    let{ id }=req.params;
    const listing = req.body.listing;
    
    let editlisting = await Listing.findByIdAndUpdate(id, listing);
    
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    
    editlisting.image={url,filename};
    await Listing.save();
    }
    //await Listing.findByIdAndUpdate(id, {...req.body.listing});// de-construct object to get parameter fields for db. 
    req.flash("success"," listing updated successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyRoute = async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully!");
    res.redirect("/listings");
}