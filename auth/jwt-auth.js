const {User}= require('../models/user')
const jwt = require('jsonwebtoken')

const isAdmin = async (req, res, next)=>{
    try{
       if(req.headers && req.headers.authorization){
        let type= req.headers.authorization.split(' ')[0]
        let token = req.headers.authorization.split(' ')[1]
        if(type==='Bearer'){
            jwt.verify(token,process.env.SECRET, function(err,decode){
                if(err) res.status(401).json({message:'wrong sign'});
                if(decode.isAdmin===true){
                    next();
                }else{
                    res.status(401).json({message:'unauthorized'})
                }
            })
        }else{
            res.status(401).json({message:'invalid token'})
        }
       }else{
        res.status(401).json({message:'token not found'})
       }
    }catch(error){  
        return next(error)
    }
}

const isUser = async (req,res,next)=>{
    try{
        if(req.headers && req.headers.authorization){
         let type= req.headers.authorization.split(' ')[0]
         let token = req.headers.authorization.split(' ')[1]
         if(type==='Bearer'){
             jwt.verify(token,process.env.SECRET, function(err,decode){
                 if(err) res.status(401).json({message:'wrong sign'});
                 if(decode.isAdmin===false){
                     next();
                 }else{
                     res.status(401).json({message:'unauthorized'})
                 }
             })
         }else{
             res.status(401).json({message:'invalid token'})
         }
        }else{
         res.status(401).json({message:'token not found'})
        }
     }catch(error){  
         return next(error)
     }
}

const isAuthorized = async (req, res, next)=>{
    try{
        if(req.headers && req.headers.authorization){
            let type= req.headers.authorization.split(' ')[0]
            let token = req.headers.authorization.split(' ')[1]
            if(type==='Bearer'){
                jwt.verify(token,process.env.SECRET, function(err,decode){
                    if(err) res.status(401).json({message:'wrong sign'});
                    if(decode){
                        req.userId=decode.userId
                        req.isAdmin=decode.isAdmin
                        next();
                    }else{
                        res.status(401).json({message:'unauthorized'})
                    }
                })
            }else{
                res.status(401).json({message:'invalid token'})
            }
           }else{
            res.status(401).json({message:'token not found'})
           }
    }catch(error){
        return next(error)
    }
}

const allowUserInfo = async(req, res, next)=>{
        try{
            if(req.headers && req.headers.authorization){
                let type= req.headers.authorization.split(' ')[0]
                let token = req.headers.authorization.split(' ')[1]
                if(type==='Bearer'){
                    jwt.verify(token,process.env.SECRET, function(err,decode){
                        if(err) res.status(401).json({message:'wrong sign'});
                        if(decode.userId===req.params.id || decode.isAdmin===true){
                            next();
                        }else{
                            res.status(401).json({message:'unauthorized'})
                        }
                    })
                }else{
                    res.status(401).json({message:'invalid token'})
                }
               }else{
                res.status(401).json({message:'token not found'})
               }
        }catch(error){
            return next(error)
    }
}

const allowUser = async(req, res, next)=>{
    try{
        if(req.headers && req.headers.authorization){
            let type= req.headers.authorization.split(' ')[0]
            let token = req.headers.authorization.split(' ')[1]
            if(type==='Bearer'){
                jwt.verify(token,process.env.SECRET, function(err,decode){
                    if(err) res.status(401).json({message:'wrong sign'});
                    if(decode.userId===req.body.id || decode.isAdmin===true){
                        next();
                    }else{
                        res.status(401).json({message:'unauthorized'})
                    }
                })
            }else{
                res.status(401).json({message:'invalid token'})
            }
           }else{
            res.status(401).json({message:'token not found'})
           }
    }catch(error){
        return next(error)
}
}


module.exports={
    isAdmin,
    isUser,
    isAuthorized,
    allowUserInfo
}