const {User} = require('../models/user');
const { ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {isAdmin,allowUserInfo,isAuthorized} =require('../auth/jwt-auth')


router.get(`/`, isAdmin ,async (req, res) =>{
    /* if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0]==='Bearer'){
        jwt.verify(req.headers.authorization.split(' ')[1],process.env.SECRET,function(err,decoded){
            console.log(decoded)
        });
    } */
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})

router.get('/:id', allowUserInfo ,async(req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found.'})
    } 
    res.status(200).send(user);
})

/* router.post('/', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        role: req.body.role,
        purchases: req.body.purchases,
        avatarId: req.body.purchases
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('The user cannot be created!')

    res.send(user);
}) */

router.put('/:id',allowUserInfo,async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            avatarId: req.body.avatarId,
            isAdmin: req.body.isAdmin,
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('The user cannot be created!')

    res.send(user);
})

//PATCH USERS
router.patch('/:id',allowUserInfo,async(req,res)=>{
    try{
        const userData = req.body
        if(req.body.password) {
            newPassword = bcrypt.hashSync(req.body.password, 10)
        }else{
            delete req.body.password
        }
        User.updateOne({_id: new ObjectId(req.params.id)},userData, async(err,doc)=>{
            if(err) throw err;
            res.send(doc)
        })
    }catch(error){
        console.log(error)
    }
})

router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.SECRET;
    if(!user) {
        return res.status(400).send('User not found.');
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn : '1d'}
        )
       
        res.status(200).send({user: user.email, token: token}) 
    } else {
       res.status(400).send('Password is wrong!');
    }
})


router.post('/register', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.isAdmin,
        avatarId: new ObjectId(req.body.avatarId)
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('The user cannot be created!')

    res.send(user);
})


router.delete('/:id',allowUserInfo, (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`,isAdmin, async (req, res) =>{
    const userCount = await User.countDocuments()

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})


module.exports =router;