const userModel = require('../models/user.model')
const tokenBlacklistModel = require('../models/blacklist.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


/**
 * @name registerUserController
 * @description registers a new user, exprects username , emailid and password
 * @access Public
 */
async function registerUserController(req,res){
    const {username, email, password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message : "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or : [{username}, {email}]
    })

    if(isUserAlreadyExists){
        if(isUserAlreadyExists == username){
            return res.status(400).json({
                message : "Account already exisits with this username"
            })
        }
        else{
            return res.status(400).json({
                message : "Account already exists with this emailId"
            })
        }
    }

    //hashing the password
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        username,
        email,
        password : hash
    })

    //generate a token for user
    const token =  jwt.sign(
        {id: user._id,username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"})

    // set this token into the cookie

    res.cookie("token", token)
    res.status(201).json({
        message: "User registered successfully",
        user: {
            id : user._id,
            username: user.username,
            email: user.email
        }
    })

}

/**
 * @name loginUserController
 * @description login an existing user, expects emailid and password
 * @access Public
 */
async function loginUserController(req,res){
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({
            message: "Please provide Email Id or Password"
        })
    }

    const user = await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message: "Invalid Email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid Email or password"
        })
    }

    // if password valid , generate a token
    const token = jwt.sign(
        {id: user._id,username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"})
    
    res.cookie("token",token)
    res.status(200).json({
        message: "User loggedIn successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutUserController
 * @description logs out an existing user, expects token
 * @access Public
 */
async function logoutUserController(req,res){
    const token = req.cookies.token

    if(!token){
        await tokenBlacklistModel.create({
            token
        })
    }

    res.clearCookie("token")
    res.status(200).json({
        message: "User logged out successfully"
    })

}


async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id : user._id,
            username: user.username,
            email: user.email

        }
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}