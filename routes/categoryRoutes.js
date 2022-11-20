const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const category=require('../models/category')
const { ObjectId } = require('mongodb');
const Category = require('../models/category');
const {isAdmin,allowUserInfo,isAuthorized} =require('../auth/jwt-auth')

/* Obtener todas las marcas de la collección */
router.get('/categories', async (req, res)=>{
    try{
        const categories = await category.find({});
        res.send(categories);
    }catch (error) {
        console.log(error);
    }
})

/* Obtener una sola marca a partir de su ObjectID */
router.get('/categories/:id', async (req, res)=> {
    try {
        const categories = await category.find({"_id":new ObjectId(req.params.id)});
        res.send(categories)
    } catch (error) {
        console.log(error)
    }
})

/* Crea una nueva marca a partir del JSON que se recibe */
router.post('/categories',isAdmin, async (req,res)=>{
    try{
        let categoryData = req.body
        const newCategory = new category(categoryData)
        let saveCategory = await newCategory.save()
        res.send(saveCategory)
    }catch(error){
        console.log(error)
    }
})

/* Actualiza el nombre de la marca*/
   router.put('/categories/:id',isAdmin, async(req,res)=>{
    try{
        category.findOne({_id: new ObjectId (req.params.id)}, async(error,doc)=>{
            if(error) throw error;
            console.log(doc)
            doc.name=req.body['name'];
            let updatedCategory = await doc.save()
            res.send(updatedCategory)
        })
    }catch(error){
        console.log(error)
    }
})





/* Elimina una marca a partir de su ObjectID */
router.delete('/categories/:id',isAdmin, async(req,res)=>{
    try{
        category.findOne({_id:new ObjectId(req.params.id)}, async(error,doc)=>{
            if(error) throw error;
            await doc.delete().then(()=>{
                res.send("category deleted")
            })
        })
    }catch(error){
        console.log(error)
    }
})

module.exports = router;