const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating: { 
        type: Number,
        min: 1,
        max:5,
        require: true
    },
    comment: {
        type: String,
        require: true
    },
    author:{ 
        type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         require: true 
    }
},{timestamps: true});

const watchSchema = new Schema({
    name: { 
        type: String,
        require: true
    },
    image: { 
        type: String,
        require: true
    },
    price: { 
        type: Number,
        require: true
    },
    isAutomatic: {
        type: Boolean, 
        default: false
    },
    description: {
        type: String, 
        require: true
    },
    comments: [commentSchema],
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brands",
        require: true
    },
},{ timestamps: true, });

const watches = mongoose.model("Watch", watchSchema);
module.exports = watches;
