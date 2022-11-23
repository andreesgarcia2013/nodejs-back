const express = require('express')
const mongoose = require('mongoose');

const cardSchema=mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: false},
    number:{ type: Number, required: true },
    cvv:{ type: Number, required: true },
    expires_date:{ type: String, required: true }
},{collection:'cards'})




const card=mongoose.model('card',cardSchema);

module.exports=card