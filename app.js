const Connection = require ('./connection')
const dotenv = require ('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const productRoutes = require('./routes/productsRoutes')
const userRoutes = require('./routes/userRoutes')
const brandRoutes = require('./routes/brandRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const shippingRoutes = require('./routes/shippingInfoRoutes')
const avatarImgRoutes = require('./routes/avatarImgRoutes')
const cardRoutes=require('./routes/cardRoutes')
const cuponsRoutes=require('./routes/cuponsRoutes')
const authJwt = require('./auth/jwt')
const app = express()
const port = 3000
const cors = require('cors')
var corsOptions = {
    origin: 'http://localhost:8081',
    optionsSuccessStatus: 200,
    methods: "GET,PUT,POST,DELETE,PATCH"
}
app.use(cors(corsOptions));
app.use(express.json())
/* app.use(authJwt()) */
app.use('/api/v1/store',userRoutes)
app.use('/api/v1',productRoutes)
app.use('/api/v1',brandRoutes)
app.use('/api/v1',categoryRoutes)
app.use('/api/v1',shippingRoutes)
app.use('/api/v1',avatarImgRoutes)
app.use('/api/v1',cuponsRoutes)
app.use('/api/v1',cardRoutes)
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));