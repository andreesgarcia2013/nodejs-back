const mongoose = require('mongoose');

const purchaseSchema=mongoose.Schema({
    idUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    },
    name:{
        type:String,
        required: false,
        default:'unknown user'
    },
    address:{
        type: String,
        required: true
    },
    total:{
        type: Number,
        required: true,
        default: 0
    },
    discount:{
        type: Number,
        required: true,
        default: 0
    },
    date:{
        type: String,
        required: true,
        default: ''
    },
    method_payment:{
        type: String,
        required: true,
        default: ''
    },
    products:[
        {   
            _id:false,
            idProduct:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            quantity:{
                type: Number,
                required: true,
                default: 0
            },
        }
    ],
    cardNumber:{
        type: Number,
        required: false,
        default: null
    },
}, {collection:'purchases'})

const purchases=mongoose.model('purchases', purchaseSchema)

module.exports= purchases