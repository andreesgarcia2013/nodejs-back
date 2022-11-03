const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const brand=require('../models/brand')
const { ObjectId } = require('mongodb');
const Brand = require('../models/brand');

/* Obtener todas las marcas de la collección */
router.get('/brands', async (req, res)=>{
    try{
        const brands = await brand.find({});
        res.send(brands);
    }catch (error) {
        console.log(error);
    }
})

/* Obtener una sola marca a partir de su ObjectID */
router.get('/brands/:id', async (req, res)=> {
    try {
        const brands = await brand.find({"_id":new ObjectId(req.params.id)});
        res.send(brands)
    } catch (error) {
        console.log(error)
    }
})

/* Crea una nueva marca a partir del JSON que se recibe */
router.post('/brands', async (req,res)=>{
    try{
        let brandData = req.body
        const newBrand = new brand(brandData)
        let saveBrand = await newBrand.save()
        res.send(saveBrand)
    }catch(error){
        console.log(error)
    }
})

/* Actualiza el nombre de la marca*/
   router.put('/brands/:id', async(req,res)=>{
    try{
        brand.findOne({_id: new ObjectId (req.params.id)}, async(error,doc)=>{
            if(error) throw error;
            console.log(doc)
            doc.name=req.body['name'];
            let updatedBrand = await doc.save()
            res.send(updatedBrand)
        })
    }catch(error){
        console.log(error)
    }
})





/* Elimina una marca a partir de su ObjectID */
router.delete('/brands/:id', async(req,res)=>{
    try{
        brand.findOne({_id:new ObjectId(req.params.id)}, async(error,doc)=>{
            if(error) throw error;
            await doc.delete().then(()=>{
                res.send("Brand deleted")
            })
        })
    }catch(error){
        console.log(error)
    }
})

module.exports = router;