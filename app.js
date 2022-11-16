const Connection = require ('./connection')
const dotenv = require ('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const productRoutes = require('./routes/productsRoutes')
const userRoutes = require('./routes/userRoutes')
const brandRoutes = require('./routes/brandRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const authJwt = require('./auth/jwt')
const app = express()
const port = 3000


app.use(express.json())
app.use(authJwt())
app.use('/api/v1/store',userRoutes)
app.use('/api/v1',productRoutes)
app.use('/api/v1',brandRoutes)
app.use('/api/v1',categoryRoutes)

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));