const { ObjectID } = require('bson');
const mongoose = require('mongoose');
const brand=require('./brand')

const productSchema=mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    available_items: { type: Number, required: true, min: 0, max: 1000 },
    available:{type:Boolean, required:true},
    flavor: { type: String, required: true },
    measure: { type: String, required: true },
    quantity: { type: Number, required: true},
    filing:{ type: String, required: true },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand',
        require: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        require: false
    },
    gallery : { type : Array , "default" : [] } 
}, {collection:'products'})

const product=mongoose.model('product', productSchema)

module.exports= product