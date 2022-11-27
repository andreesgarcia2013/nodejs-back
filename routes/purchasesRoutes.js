const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const product= require('../models/product')
const category= require('../models/category')
const {User}=require('../models/user')
const brand=require('../models/brand')
const purchases=require('../models/purchases')
const { ObjectId, AuthMechanism } = require('mongodb');
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
        const Purchases = await purchases.find({idUser:new ObjectId(req.params.id)})
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
        if(req.body.date){
            let date = new Date(req.body.date).toISOString();
            purchasesData['date']= new Date(date)
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

router.get('/reports/purchases/byYear/:year',async(req,res)=>{
    try{
        let firstDay= new Date("01/01/"+req.params.year)
        let lastDay= new Date("12/31/"+req.params.year)
        let data = await purchases.aggregate([
            {
                $match:{
                    date: { $gt: firstDay, $lt: lastDay }
                }
            },
            {
                $group:{
                    _id: null,
                    count:{$sum:1},
                    total:{$sum:"$total"}
                }
            }
        ]).exec();
        res.status(200).send(data) 
    }catch(error){
        console.log(error)
    }
})

router.get('/reports/purchases/byMonth/:month/byYear/:year',async(req,res)=>{
    try{
        let firstDay= new Date(req.params.month+"/01/"+req.params.year)
        let lastDay= new Date(req.params.month+"/31/"+req.params.year)
        let data = await purchases.aggregate([
            {
                $match:{
                    date: { $gt: firstDay, $lt: lastDay }
                }
            },
            {
                $group:{
                    _id: null,
                    count:{$sum:1},
                    total:{$sum:"$total"}
                }
            }
        ]).exec();
        res.status(200).send(data) 
    }catch(error){
        console.log(error)
    }
})

router.get('/reports/purchases/countAll',async(req,res)=>{
    try{
        let data = await purchases.aggregate().count("totalPurchases").exec();
        res.status(200).send(data) 
    }catch(error){
        console.log(error)
    }
})

router.get('/reports/purchases/countProducts',async(req,res)=>{
    try{
        let data = await purchases.aggregate([
            {
                $group:{
                    _id: null,
                    total_prods:{$sum:{$size:"$products"}}
                }
            }
        ]).exec();
        res.status(200).send(data) 
    }catch(error){
        console.log(error)
    }
})

router.get('/reports/users',async(req,res)=>{
    try{
        let data = await User.aggregate().count("totalUsers").exec();
        res.status(200).send(data)
    }catch(error){
        console.log(error)
    }
})

router.get('/reports/products',async(req,res)=>{
    try{
        let data = await product.aggregate().count("totalProducts").exec();
        res.status(200).send(data)
    }catch(error){
        console.log(error)
    }
})


module.exports=router

