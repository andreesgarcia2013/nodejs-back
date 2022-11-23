const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const shippingInfo=require('../models/shippingInfo')
const { ObjectId } = require('mongodb');
const Brand = require('../models/shippingInfo');
const { isAdmin, allowUserInfo } = require('../auth/jwt-auth');

/*Obtiene todas las direcciones de todos los usuarios*/
router.get('/shippingInfo',isAdmin, async (req, res)=>{
    try{
        const shippingInfos = await shippingInfo.find({});
        res.send(shippingInfos);
    }catch (error) {
        console.log(error);
    }
})

/* Obtener todas las direcciones del  usuario dado su id*/
router.get('/shippingInfo/byuser/:id',allowUserInfo, async (req, res)=>{
    try{
        const shippingInfos = await shippingInfo.find({'idUser':new ObjectId(req.params.id)});
        res.send(shippingInfos);
    }catch (error) {
        console.log(error);
    }
})



/* Obtener una sola direccion a partir de su ObjectID */
router.get('/shippingInfo/:id',isAdmin, async (req, res)=> {
    try {
        const shippingInfos = await shippingInfo.find({"_id":new ObjectId(req.params.id)});
        res.send(shippingInfos)
    } catch (error) {
        console.log(error)
    }
})


/* Crea una nueva direccion a partir del JSON que se recibe ¿validar back o front? */
router.post('/shippingInfo',isAdmin, async (req,res)=>{
    try{
        let shippingInfoData = req.body
        shippingInfoData['idUser'] = new ObjectId(req.body.idUser)
        const newShipingInfo = new shippingInfo(shippingInfoData)
        let saveShippingInfo = await newShipingInfo.save()
        res.send(saveShippingInfo)
    }catch(error){
        console.log(error)
    }
})

/* Se tiene que recibir un JSON con todos los campos, si se omite uno, al hacer la actualización lo marcará como nulo o mandara
   un error debido a las reglas establecidas en el esquema de mongoose*/
   router.put('/shippingInfo/:id',isAdmin, async(req,res)=>{
    try{
        shippingInfo.findOne({_id: new ObjectId (req.params.id)}, async(error,doc)=>{
            if(error) throw error;
            console.log(doc)
            doc.idUser=new ObjectId( req.body['idUser'])
            doc.alias=req.body['alias']
            doc.country=req.body['country']
            doc.state=req.body['state']
            doc.address=req.body['address']
            doc.cp=req.body['cp']
            doc.phone=req.body['phone']
            /* for (const img in images) {
                images.push
            }
            doc.gallery=images */
            let updatedshippingInfo = await doc.save()
            res.send(updatedshippingInfo)
        })
    }catch(error){
        console.log(error)
    }
})

/* Se puede recibir un JSON con los datos especificos que se quiere actualizar, y al momento de ejecutar la consulta los campos
   que no se encuentren en el JSON simplemente se quedan igual */
   router.patch('/shippingInfo/:id',isAdmin, async(req,res)=>{
    try{
        const patchshippingInfoData = req.body
        shippingInfo.updateOne({_id: new ObjectId(req.params.id)}, patchshippingInfoData, async(error,doc)=>{
            if (error) throw error;
            res.send(doc)
        })
    }catch(error){
        console.log(error)
    }
})
/* Elimina una direccion apartir de su ObjectID */
router.delete('/shippingInfo/:id',isAdmin, async(req,res)=>{
    try{
        shippingInfo.findOne({_id:new ObjectId(req.params.id)}, async(error,doc)=>{
            if(error) throw error;
            await doc.delete().then(()=>{
                res.send("shippingInfo deleted")
            })
        })
    }catch(error){
        console.log(error)
    }
})

module.exports = router;

