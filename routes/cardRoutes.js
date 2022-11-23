const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const card=require('../models/card')
const { ObjectId } = require('mongodb');
const { isAdmin, allowUserInfo,isUser, isAuthorized } = require('../auth/jwt-auth');

/*Obtiene todas las tarjetas de todos los usuarios*/
router.get('/cards',isAdmin, async (req, res)=>{
    try{
        const cards = await card.find({});
        res.send(cards);
    }catch (error) {
        console.log(error);
    }
})

/* Obtener todas las tarjetas del  usuario dado su id*/
router.get('/cards/byuser/:id',allowUserInfo, async (req, res)=>{
    try{
        const cards = await card.find({'ownerId':new ObjectId(req.params.id)});
        res.send(cards);
    }catch (error) {
        console.log(error);
    }
})

/* Obtener una sola tarjeta a partir de su ObjectID */
router.get('/cards/:id',allowUserInfo, async (req, res)=> {
    try {
        const cards = await card.find({"_id":new ObjectId(req.params.id)});
        res.send(cards)
    } catch (error) {
        console.log(error)
    }
})

/* Crea una nueva tarjeta a partir del JSON que se recibe ¿validar back o front? */
router.post('/cards',isAuthorized, async (req,res)=>{
    try{
        let cardData = req.body
        cardData['ownerId'] = new ObjectId(req.body.ownerId)
        const newCard = new card(cardData)
        let saveCard = await newCard.save()
        res.send(saveCard)
    }catch(error){
        console.log(error)
    }
})

/* Se puede recibir un JSON con los datos especificos que se quiere actualizar, y al momento de ejecutar la consulta los campos
   que no se encuentren en el JSON simplemente se quedan igual */
   router.patch('/cards/:id',isAuthorized, async(req,res)=>{
    try{
        const patchCardData = req.body
        card.updateOne({_id: new ObjectId(req.params.id)}, patchCardData, async(error,doc)=>{
            if (error) throw error;
            res.send(doc)
        })
    }catch(error){
        console.log(error)
    }
})

/* Se tiene que recibir un JSON con todos los campos, si se omite uno, al hacer la actualización lo marcará como nulo o mandara
   un error debido a las reglas establecidas en el esquema de mongoose*/
   router.put('/cards/:id',isAuthorized, async(req,res)=>{
    try{
        card.findOne({_id: new ObjectId (req.params.id)}, async(error,doc)=>{
            if(error) throw error;
            console.log(doc)
            doc.ownerID=new ObjectId( req.body['ownerId'])
            doc.number=req.body['number']
            doc.cvv=req.body['cvv']
            doc.expires_date=req.body['expires_date']
            /* for (const img in images) {
                images.push
            }
            doc.gallery=images */
            let updatedCard = await doc.save()
            res.send(updatedCard)
        })
    }catch(error){
        console.log(error)
    }
})

/* Elimina una tarjeta apartir de su ObjectID */
router.delete('/cards/:id',isAuthorized, async(req,res)=>{
    try{
        card.findOne({_id:new ObjectId(req.params.id)}, async(error,doc)=>{
            if(error) throw error;
            await doc.delete().then(()=>{
                res.send("Card deleted")
            })
        })
    }catch(error){
        console.log(error)
    }
})






module.exports = router;