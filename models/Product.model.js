const mongoose = require("mongoose")

const productSchema = {
    name: {type:String},
    description: {type: String},
    category: {type: String, enum:["clothing", "electronics", "furniture", "other"] },
    image: { type: String },
    location: { type: String },
    postedAt: { type: Date },
    price: { type: Number },

}

const ProductModel = mongoose.model("product", productSchema);

module.exports = {ProductModel}