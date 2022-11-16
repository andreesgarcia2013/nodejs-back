const dotenv = require ('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:1234@cluster0.xthwb5c.mongodb.net/proyectoCW').then(()=>{
    console.log('Conection Successfully')
}).catch((error)=>{
    console.log(error);
});

module.exports = mongoose;