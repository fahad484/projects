const mongoose = require("mongoose");
const express =require("express");
const app = express();
const initdata = require("./data.js");
const listing = require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main();

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initdb= async ()=>{
   await listing.deleteMany({});
   initdata.data = initdata.data.map((obj)=>({...obj,owner:"6a60a9204a337050e086a108"}));
   await listing.insertMany(initdata.data);
   console.log("data was initialised.");
};

initdb();