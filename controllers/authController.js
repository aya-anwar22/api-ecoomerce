const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');
const transporter = require('../config/transportMail.js');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const EMAIL_VERIFICATION_TIMEOUT = 10 * 60 * 1000
const generateCode = () => Math.floor((  100000+ Math.random() *900000 )).toString()

const sendVerificationEmail = async(user) => {


    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to:user.email,
        subject: 'Active email',
        html: `<h1>${user.verficationEmail}</h1>`

    }
    await transporter.sendMail(mailOptions)
}


const sendRestePassword= async(user) => {


    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to:user.email,
        subject: 'Rest  password',
        html: `<h1>${user.restePassword}</h1>`

    }
    await transporter.sendMail(mailOptions)
}


async function generateTokens(user, regenerateReshershToken = false){
    const acessToken = jwt.sign(
        {userId: user.id},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2h"}
    )

    let refreshToken = user.refreshToken
    let refreshTokenExpiry = user.refreshTokenExpiry

    if(regenerateReshershToken || !refreshToken || new Date() > refreshTokenExpiry){
        refreshToken = jwt.sign(
                {userId: user.id},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "15d"}
        )
        refreshTokenExpiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        user.set({refreshToken,  refreshTokenExpiry})
        await user.save();
    }
    return {acessToken, refreshToken, refreshTokenExpiry}
}

// sign-up
exports.signUp = asyncHandler(async(req, res) =>{

    const {name, email ,password, phoneNumber} = req.body;

    if(!name || !email  || !password || !phoneNumber){
        return res.status(400).json({
            message: "name, email ,password, phoneNumber are required"
        })
    }

    const existingUser = await User.findOne({ email });
    if(existingUser){

        if(existingUser.isVerified){
            return res.status(409).json({
                message: "User Already existes in DB "
            });
        } else{

            const newCode = generateCode();
            existingUser.verficationEmail = newCode;
            existingUser.verficationEmailExpire = new Date( Date.now() + EMAIL_VERIFICATION_TIMEOUT);
            await existingUser.save();

            await sendVerificationEmail(existingUser)
            return res.status(200).json({message: "Verificatin code send , please virify your account"})

        }

    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCode = generateCode();

    const newUser = new User ({
        name,
        email ,
        password: hashedPassword,
        phoneNumber,
        verficationEmail : newCode,
        verficationEmailExpire:new Date( Date.now() + EMAIL_VERIFICATION_TIMEOUT),
        role: email === process.env.ADMIN_EMAIL ? "admin" : "user",

    })
    await newUser.save();
    await sendVerificationEmail(newUser)
    return res.status(201).json({
        message: "rejestration sucessfully. please verify your email"
    })



})
// virify- email

exports.virfiyEmail = asyncHandler(async(req, res) =>{
    const {email , code} = req.body;
    if(!email || !code){
        return res.status(400).json({message: "please provide email and code"});
    }

    const user = await User.findOne({ email });
    if(!user){
        return res.status(404).json({message: "user not found"})
    }

    if(!user.verficationEmail || user.verficationEmail !== code || new Date() > user.verficationEmailExpire){
        return res.status(400).json({
            message: "Invaild or expire verfication code "
        })
    }


    user.isVerified = true;
    user.verficationEmail = null;
    user.verficationEmailExpire = null
    await user.save();
    return res.status(200).json({
        message: "Email virifes sucessfully"
    })



});

// login
exports.login = asyncHandler(async(req, res) =>{
    const {email , password} =req.body ;
    if(!email || !password){
        return res.status(400).json({
            message: "Please provid email and password"
        })
    }

    const user = await User.findOne({ email });
    if(!user){
        return res.status(404).json({message: "user not found"})
    }

    const isMathch = await bcrypt.compare(password, user.password);
    if(!isMathch){
        return res.status(400).json({message: "email or password invaild"})
    }

    if(!user.isVerified){
        return res.status(400).json({
            message:  "please active your account first"
        })
    }

    const {acessToken, refreshToken} = await generateTokens(user);

    res.status(200).json({
        message: "login successfully",
        role: user.role,
        acessToken:acessToken,
        refreshToken:refreshToken
    })
})
// forget- password
exports.forgetPassword = asyncHandler(async(req, res) =>{
    const { email } = req.body;
    const user = await User.findOne({ email })
    if(!user){
        return res.status(404).json({
            message:" User not found"
        })
    }

    const code = generateCode();
    user.restePassword = code;
    user.restePasswordExpire = new Date(Date.now()  + EMAIL_VERIFICATION_TIMEOUT)
    await user.save();
    await sendRestePassword(user);
    res.status(200).json({
        message: "Rest password email send"
    })

})
// rest password
exports.resetPassword = asyncHandler(async(req, res) =>{
    const {email , code , newPassword} = req.body
    const user = await User.findOne({ email });
    if(!user){
        return res.status(404).json({
            message: "User not found"
        })
    }

    if(!user.restePassword || user.restePassword !== code || new Date() > user.restePasswordExpire){
        return res.status(400).json({
            message: "Invaild or expire reste password"
        })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.restePassword = null;
    user.restePasswordExpire = null;
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
        message: "password reste Sucessfully "
    })

});


// refreshToken
exports.refreshToken = asyncHandler(async(req, res) =>{
    const { refreshToken } = req.body;
    const user = await User.findOne({refreshToken});
    if(!user){
        return res.status(404).json({
            messsage: "User not found"
        })
    }
    try{
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const{acessToken, refreshToken: newRefreshToken} = await generateTokens(user, true)
        return res.status(200).json({"acessToken":acessToken , refreshToken: newRefreshToken})
    } catch(error){
        return res.status(403).json({message: "invaild refresh token", erroe: error.message})
    }

})
// logout

exports.logout = asyncHandler(async(req, res) =>{
    const { refreshToken } = req.body;
    const user = await User.findOne({refreshToken});
    if(!user){
        return res.status(404).json({
            messsage: "User not found"
        })
    }

    user.refreshToken=null;
    user.refreshTokenExpiry = null
    await user.save();
    return res.status(200).json({
        message: "Logout Sucessfully"
    })


})