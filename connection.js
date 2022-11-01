const dotenv = require ('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTION_STRING).then(()=>{
    console.log('Conection Successfully')
}).catch((error)=>{
    console.log(error);
});

module.exports = mongoose;