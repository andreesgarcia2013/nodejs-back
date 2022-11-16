const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const product= require('../models/product')
const category= require('../models/category')
const brand=require('../models/brand')


const { ObjectId } = require('mongodb');
const Product = require('../models/product');
const { json } = require('body-parser');

/* Obtener todos los produtos de la collección */
router.get('/products', async (req, res)=>{
    try{
        const products = await product.find({}).populate('brand', 'name -_id').populate('category', 'name -_id');
        res.send(products);
    }catch (error) {
        console.log(error);
    }
})

/* Obtener un solo producto a partir de su ObjectID */
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

/* Obtener los productos a partir del ID de la categoría a la que pertenecen TRATAR DE USAR AGREGATION FM */
router.get('/products/byCategory/:id', async (req,res)=>{
    try{
        /* const filter = { category : new ObjectId(req.params.id)}
        let docs = await product.aggregate([
            { $match: filter },
            { $lookup: {
                from: 'product',
                localField: 'category',
                foreignField: '_id',
                as: 'categories'
            }}
        ]); */
        const products = await product.find({'category':new ObjectId(req.params.id)}).populate('category', 'name -_id').populate('brand','name -_id')
        res.send(products)
    }catch(error){
        console.log(error)
    }
})

/* Obtener los productos a partir del ID de la marca a la que pertenecen TRATAR DE USAR AGREGATION FM */
router.get('/products/byBrand/:id', async (req,res)=>{
    try{
        /* const filter = { category : new ObjectId(req.params.id)}
        let docs = await product.aggregate([
            { $match: filter },
            { $lookup: {
                from: 'product',
                localField: 'category',
                foreignField: '_id',
                as: 'categories'
            }}
        ]); */
        const products = await product.find({'brand':new ObjectId(req.params.id)}).populate('category', 'name -_id').populate('brand','name -_id')
        res.send(products)
    }catch(error){
        console.log(error)
    }
})

/* Crea un nuevo producto a partir del JSON que se recibe ¿validar back o front? */
router.post('/products', async (req,res)=>{
    try{
        let productData = req.body
        productData['brand'] = new ObjectId(req.body.brand)
        productData['category'] = new ObjectId(req.body.category)
        const newProduct = new product(productData)
        let saveProduct = await newProduct.save()
        res.send(saveProduct)
    }catch(error){
        console.log(error)
    }
})

/* Se tiene que recibir un JSON con todos los campos, si se omite uno, al hacer la actualización lo marcará como nulo o mandara
   un error debido a las reglas establecidas en el esquema de mongoose*/
router.put('/products/:id', async(req,res)=>{
    try{
        product.findOne({_id: new ObjectId (req.params.id)}, async(error,doc)=>{
            if(error) throw error;
            console.log(doc)
            doc.name=req.body['name']
            doc.description=req.body['description']
            doc.price=req.body['price']
            doc.available_items=req.body['available_items']
            doc.available=req.body['available']
            doc.flavor=req.body['flavor']
            doc.measure=req.body['measure']
            doc.quantity=req.body['quantity']
            doc.filing=req.body['filing']
            doc.brand=new ObjectId(req.body['brand'])
            doc.category = new ObjectId(req.body['category'])
            doc.gallery = req.body['gallery'];
            /* for (const img in images) {
                images.push
            }
            doc.gallery=images */
            let updatedProduct = await doc.save()
            res.send(updatedProduct)
        })
    }catch(error){
        console.log(error)
    }
})

/* Se puede recibir un JSON con los datos especificos que se quiere actualizar, y al momento de ejecutar la consulta los campos
   que no se encuentren en el JSON simplemente se quedan igual */
router.patch('/products/:id', async(req,res)=>{
    try{
        const patchProductData = req.body
        product.updateOne({_id: new ObjectId(req.params.id)}, patchProductData, async(error,doc)=>{
            if (error) throw error;
            res.send(doc)
        })
    }catch(error){
        console.log(error)
    }
})

/* Elimina un producto a partir de su ObjectID */
router.delete('/products/:id', async(req,res)=>{
    try{
        product.findOne({_id:new ObjectId(req.params.id)}, async(error,doc)=>{
            if(error) throw error;
            await doc.delete().then(()=>{
                res.send("Product deleted")
            })
        })
    }catch(error){
        console.log(error)
    }
})


module.exports = router;