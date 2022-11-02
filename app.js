const Connection = require ('./connection');
const dotenv = require ('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productsRoutes')
const app = express();
const port = 3000
app.use(express.json());
app.use('/api/v1/store',productRoutes)

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));