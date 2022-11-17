const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const avatarsImg=require('../models/avatarsImg')
const { ObjectId } = require('mongodb');
const Brand = require('../models/avatarsImg');

/* Obtener todas las imagenes de la collección */
router.get('/avatarsImg', async (req, res)=>{
    try{
        const avatarsImgs = await avatarsImg.find({});
        res.send(avatarsImgs);
    }catch (error) {
        console.log(error);
    }
})

/* Obtener una sola imagen a partir de su ObjectID */
router.get('/avatarsImg/:id', async (req, res)=> {
    try {
        const avatarsImgs = await avatarsImg.find({"_id":new ObjectId(req.params.id)});
        res.send(avatarsImgs)
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;