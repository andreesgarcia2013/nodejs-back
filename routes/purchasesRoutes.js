const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const product= require('../models/product')
const category= require('../models/category')
const brand=require('../models/brand')
const purchases=require('../models/purchases')
const { ObjectId } = require('mongodb');
const { json } = require('body-parser');
const {isAdmin,allowUserInfo,isAuthorized} =require('../auth/jwt-auth')

router.get('/purchases', async(req,res)=>{
    try{
        const Purchases = await purchases.find({}).populate('idUser', 'name -_id')
                                                .populate({
                                                    path:'products',
                                                    populate:{
                                                        path:'idProduct',
                                                        select:'name gallery -_id',
                                                        model:'product'
                                                    }
                                                });
        res.send(Purchases);
    }catch (error) {
        console.log(error);
    }
})

router.get('/purchases/byUser/:id', async(req,res)=>{
    try{
        const Purchases = await purchases.find({idUser:new ObjectId(req.params.id)}).populate('idUser', 'name -_id')
                                                .populate({
                                                    path:'products',
                                                    populate:{
                                                        path:'idProduct',
                                                        select:'name gallery price _id',
                                                        model:'product'
                                                    }
                                                });
        res.send(Purchases);
    }catch (error) {
        console.log(error);
    }
})

router.get('/purchases/:id',async(req,res)=>{
    try{
        const Purchase = await purchases.findById({_id:new ObjectId(req.params.id)})
                                                .populate({
                                                    path:'products',
                                                    populate:{
                                                        path:'idProduct',
                                                        select:'name gallery price _id',
                                                        model:'product'
                                                    }
                                                });
        if(Purchase.idUser!==null){
            await Purchase.populate('idUser', 'name -_id');
        }
        res.send(Purchase);
    }catch (error) {
        console.log(error);
    }
})

router.post('/purchases',async(req,res)=>{
    try{
        let purchasesData=req.body
        if(req.body.idUser){
            purchasesData['idUser']=new ObjectId(req.body.idUser)
        }
        if(req.body.products!==[]&&req.body.products){
            var n=req.body.products.length
            let products = []
            for (let i=0;i<n;i++){
                let prodDetails = {
                    "idProduct":new ObjectId(req.body.products[i].idProduct),
                    "quantity":req.body.products[i].quantity
                }
             products[i]=prodDetails
            }
            purchasesData['products']=products
        }
        const newPurchase = new purchases(purchasesData)
        let savePurchase = await newPurchase.save()
        res.status(200).send(savePurchase)
    }catch(error){
        console.log(error)
    }
})


module.exports=router

