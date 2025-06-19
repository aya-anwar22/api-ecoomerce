const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');
const bcrypt = require('bcrypt')

// for admin
//CRUD
//CREATE USER
exports.addUser = asyncHandler(async(req, res) =>{
    const isAdmin = req.user && req.user.role === "admin";
    if(!isAdmin){
        return res.status(403).json({
            message: "Acess, denied... Admin only"
        })
    }
    const {name, email ,password, phoneNumber, role} = req.body;
    const user = await User.findOne({ email });
    if(user && user.isVerified){
        return res.status(400).json({
            message: "use already in DB"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name, 
        email ,
        password:hashedPassword,
        phoneNumber,
        role,
        isVerified:true
    })
     await newUser.save();
     return res.status(201).json({
        message: "User create successfully"
     })
})


// get all user
exports.getAllUser = asyncHandler(async(req, res) =>{
    const isAdmin = req.user && req.user.role === "admin";
    if(!isAdmin){
        return res.status(403).json({
            message: "Acess, denied... Admin only"
        })
    }

    const users = await User.find().select('-password');
    res.status(200).json(users)
})

exports.getUserById = asyncHandler(async(req, res) =>{
    const isAdmin = req.user && req.user.role === "admin";
    if(!isAdmin){
        return res.status(403).json({
            message: "Acess, denied... Admin only"
        })
    }

    const userId = req.params.userId;
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            message: "user not found"
        })
    }

    res.status(200).json(user)

})


exports.updateUserByAdmin = asyncHandler(async(req, res) =>{
    const isAdmin = req.user && req.user.role === "admin";
    if(!isAdmin){
        return res.status(403).json({
            message: "Acess, denied... Admin only"
        })
    }

    const userId = req.params.userId;
    const {role} = req.body;
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            message: "user not found"
        })
    }


    user.role = role;
    await user.save();
    res.status(200).json({
        message: "user update successfully"
    })
})

exports.deletUser = asyncHandler(async(req, res) =>{
    const isAdmin = req.user && req.user.role === "admin";
    if(!isAdmin){
        return res.status(403).json({
            message: "Acess, denied... Admin only"
        })
    }

    const userId = req.params.userId;
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            message: "user not found"
        })
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    user.deletedBy = req.user._id;
    await user.save();

    res.status(200).json({
        message: "user soft delete successfully"
    })

})



//////////////for user /////////////////

exports.getProfile = asyncHandler(async(req, res) =>{

    const userId = req.user._id;
    const user = await User.findById(userId);

    if(!user){
        return res.status(404).json({
            message: "User mot found"
        })
    }

    res.status(200).json(user)
})


exports.updateProfile = asyncHandler(async(req, res) =>{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if(!user){
        return res.status(404).json({
            message: "User mot found"
        })
    }

        const {name , password, phoneNumber, addresses} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        user.name = name;
        user.password = hashedPassword;
        user.phoneNumber = phoneNumber;
        user.addresses = addresses

        await user.save();
        res.status(200).json({message: "User update successfully"})


})


exports.deleteProfile = asyncHandler(async(req, res) =>{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if(!user){
        return res.status(404).json({
            message: "User mot found"
        })
    }



    user.isDeleted = true;
    user.deletedAt = new Date();
    user.deletedBy = req.user._id;
    await user.save();
    res.status(200).json({
        message: "user soft delete successfully"
    })

})