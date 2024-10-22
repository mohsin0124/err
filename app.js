// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const Listing = require("../models/listing.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// main()
//     .then(()=>{
//         console.log("connected to db");
//     })
//     .catch((err)=>{
//         console.log(err);
//     });

// async function main(){
//     await mongoose.connect(MONGO_URL);
// };

// app.get("/",(req,res)=>{
//     res.send("iam root");
// });

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
//     res.send("successful listing");

// });
// //edge://flags/
// app.listen(8080,()=>{
//     console.log("listening to port 8080");
// });


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    try {
        await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to DB");
    } catch (err) {
        console.log("Connection error:", err);
    }
}

main();

app.get("/", (req, res) => {
    res.send("I am root");
});

app.get("/testlisting", async (req, res) => {
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India",
    });

    try {
        await sampleListing.save();
        console.log("Sample was saved");
        res.send("Successful listing");
    } catch (err) {
        console.error("Error saving listing:", err);
        res.status(500).send("Error saving listing");
    }
});


app.listen(8080, () => {
    console.log("Listening on port 8080");
});