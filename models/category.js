const express = require('express')
const mongoose = require('mongoose');

const categorySchema=mongoose.Schema({
    name: { type: String, required: true },
},{collection:'categories'})

const category=mongoose.model('category',categorySchema);

module.exports=category