const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Product = new Schema({
    name: {
        type: String,
        required: true
      },
    productCode: {
        type: String,
        required: true
      },
    quantity: {
        type: Number,
        required: true
      },
    price: {
        type: Number,
        required: true
      },
    brand: {
        type: String,
        required: true
      },
    model: {
        type: String,
        required: true
      },
    category: {
        type: String,
        required: true
      },
})

module.exports = mongoose.model("Product", Product)
