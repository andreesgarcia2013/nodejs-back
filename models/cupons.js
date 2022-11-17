const express = require('express');
const mongoose = require('mongoose');

const cuponsSchema = new  mongoose.Schema({
    name: {
        type: String, required: true
    },
    percentaje: {
        type: Number, required: true
    },
    expirate_date: {
        type: String, required: true
    }
},{collection:'cupons'})

const cupon = mongoose.model('cupon',cuponsSchema);
module.exports = cupon;