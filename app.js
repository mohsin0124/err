const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(()=>{
        console.log("connected to db");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("iam root");
});

// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
    
//     if(error){
//        // let errMsg = error.details.map((el)=> el.message).join(",");
//        const errMsg=[];
//        error.details.foreach(el=> el.errMsg.push(el.message));
//        throw new ExpressError(400,errMsg.join(","));
//     } else{
//         next();
//     }
// }; 


// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);

//     if (error) {
//         // Initialize an empty array to hold error messages
//         const errMsg = [];
        
//         // Add each error message to the array
//         error.details.forEach(el => {errMsg.push(el.message);
//         });

//         console.log("Collected error messages:", errMsg.join(", "));

//         // Join the error messages with commas and throw a single error
//         throw new ExpressError(400,errMsg.join(", "));
//     } else {
//         next();
//     }
// };


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        // Initialize an empty array to hold error messages
        const errMsg = [];

        // Collect all error messages in the array
        error.details.forEach(el => {
            errMsg.push(el.message); // Collect each error message
        });

        console.log("Collected error messages:", errMsg.join(", ")); // Debugging output

        // Throw an error with all messages joined by commas
        throw new ExpressError(400,errMsg.join(", "));
    } else {
        next();
    }
};




//index route
app.get("/listings",wrapAsync(async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));


//create route
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{

    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    const newListing = new Listing(req.body.listing);
    
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    //let {title, description, image, price, country, location} = req.body;
 
    // if(!newListing.title){
    //     throw new ExpressError(400,"Title is missing");
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400,"Description is missing");
    // }
    // if(!newListing.location){
    //     throw new ExpressError(400,"Location is missing");
    // }

    await newListing.save();
    res.redirect("/listings");
  
}));

//edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id",validateListing,wrapAsync(async (req,res) => {
    // if(!req.body.listings){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapAsync(async (req,res) =>{
    let {id} = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    console.log(delListing);
    res.redirect("/listings");
}));


// app.get("/testlisting",async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send(sampleListing);

// });
//edge://flags/

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
    //res.send("something went wrong");
});

app.listen(8080,()=>{
    console.log("listening to port 8080");
});


