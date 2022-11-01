const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const product= require('../models/product')
const category= require('../models/category')
const brand=require('../models/brand')


const { ObjectId } = require('mongodb')


router.get('/products', async (req, res)=>{
    try{
        const products = await product.find({}).populate('brand', 'name -_id').populate('category', 'name -_id');
        res.send(products);
    }catch (error) {
        console.log(error);
    }
})

router.get('/products/:id', async (req, res)=> {
    try {
        const products = await product.find({"_id":new ObjectId(req.params.id)}).
        populate('category').populate('brand', 'name -_id').
        populate('category', 'name -_id');
        //console.log(products)
        res.send(products)
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;