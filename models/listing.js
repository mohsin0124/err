const { ref, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: { 
        type: String,
        required: true,
    },    

    image: {
        filename: String,
        url: {
          type: String,
        default: "https://images.unsplash.com/photo-1483168527879-c66136b56105?q=80&w=1832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) =>
            v === ""
                ? "https://images.unsplash.com/photo-1483168527879-c66136b56105?q=80&w=1832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                :v,
        },
    },
    price: { 
        type: Number,
        required: true,
    },    
    location: { 
        type: String,
        required: true,
    },    
    country: { 
        type: String,
        required: true,
    },    
    // price: Number,
    // location: String,
    // country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
