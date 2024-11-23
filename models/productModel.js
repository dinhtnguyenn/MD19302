const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const product = new Schema({
    id: {type: ObjectId}, //masp
    name:{type:String}, //tensp
    price: {type: Number},
    quantity: {type: Number},
    category: {type: ObjectId, ref: "category"}
});

module.exports = mongoose.models.product || mongoose.model("product", product);