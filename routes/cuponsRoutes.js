const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const cupon= require('../models/cupons')
const { ObjectId } = require('mongodb');



//Obtener todos los cupones de la collection
router.get('/cupons', async (req, res)=>{
    try{
        const cupons = await cupon.find({});
        res.send(cupons);
    }catch (error) {
        console.log(error);
    }
})

/* Obtener un solo cupon a partir de su ObjectID */
router.get('/cupons/:name', async (req, res)=> {
    try {
        const cupons = await cupon.find({"name": req.params.name});
        res.send(cupons)
    } catch (error) {
        console.log(error)
    }
})

/* Crea un nuevo cupon a partir del JSON que se recibe*/
router.post('/cupons', async (req,res)=>{
    try{
        let cuponData = req.body
        const newCupon = new cupon(cuponData)
        let saveCupon = await newCupon.save()
        res.send(saveCupon)
    }catch(error){
        console.log(error)
    }
})

/* Actualiza el nombre del cupon*/
router.put('/cupons/:id', async(req,res)=>{
    try{
        cupon.findOne({_id: new ObjectId (req.params.id)}, async(error,doc)=>{
            if(error) throw error;
            console.log(doc)
            doc.name=req.body['name'];
            doc.percentaje = req.body['percentaje'];
            doc.expirate_date = req.body['expirate_date'];

            let updatedCupon = await doc.save()
            res.send(updatedCupon)
        })
    }catch(error){
        console.log(error)
    }
})

router.patch('/cupons/:id', async(req,res)=>{
    try{
        const patchCuponData = req.body
        cupon.updateOne({_id: new ObjectId(req.params.id)}, patchCuponData, async(error,doc)=>{
            if (error) throw error;
            res.send(doc)
        })
    }catch(error){
        console.log(error)
    }
})


/* Elimina un cupon a partir de su ObjectID */
router.delete('/cupons/:id', async(req,res)=>{
    try{
        cupon.findOne({_id:new ObjectId(req.params.id)}, async(error,doc)=>{
            if(error) throw error;
            await doc.delete().then(()=>{
                res.send("Cupon deleted !!")
            })
        })
    }catch(error){
        console.log(error)
    }
})

module.exports = router;