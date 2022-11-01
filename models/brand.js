const express = require('express')
const mongoose = require('mongoose');

const brandSchema=mongoose.Schema({
    name: { type: String, required: true },
},{collection:'brands'})

const brand=mongoose.model('brand',brandSchema);

module.exports=brand