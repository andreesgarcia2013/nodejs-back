const express = require('express')
const mongoose = require('mongoose');

const avatarsImgSchema=mongoose.Schema({
    url: { type: String, required: true }
},{collection:'avatarsImg'})

const avatarsImg=mongoose.model('avatarsImg',avatarsImgSchema);

module.exports=avatarsImg