const mongoose =require("mongoose");
const Schema =mongoose.Schema;//schema shorthand use
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
       type: String,
       required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
        // type: String,
        // default:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set : (v)=> v==="" ? "https://plus.unsplash.com/premium_photo-1668024966086-bd66ba04262f?q=80&w=892&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category:{
    type:String,
    enum:["Trending","Rooms","Iconic Cities","Mountains","Arctic","Castles","Amazing Pools","Camping","Farm","Beach","7star","Dome","Awesome Yacht","Travel Abroad","Everyone's favourite"],
    required:true,
  }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
         await Review.deleteMany({_id:{$in : listing.reviews}});

    }
   
});

const Listing =mongoose.model("Listing",listingSchema);

module.exports = Listing;