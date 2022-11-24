const express = require('express')
const mongoose = require('mongoose');

const shippingInfoSchema=mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: false},
    alias: { type: String, required: true },
    country:{ type: String, required: true },
    state:{ type: String, required: true },
    address:{type:String,required:true},
    number:{type:Number,required:true},
    cp:{ type: Number, required: true },
    phone:{ type: Number, required: true }
},{collection:'shippingInfo'})

const shippingInfo=mongoose.model('shippingInfo',shippingInfoSchema);

module.exports=shippingInfo