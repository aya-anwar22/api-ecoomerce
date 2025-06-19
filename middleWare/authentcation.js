const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');

const authentication = asyncHandler(async(req, res, next) =>{
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(token){
        try{
            const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
            const user = await User.findById(decoded.userId).select('-password') 

            if(!user){
                return res.status(404).json({
                    messahe:" User not found"
                })
            }
            req.user = user.toObject();
            next();
        }catch(error){
            return res.status(401).json({message: "invaid token"}, error.message)
        }

    } else{

        return res.status(401).json({message: "No token provided"})

    }
});

module.exports  = authentication