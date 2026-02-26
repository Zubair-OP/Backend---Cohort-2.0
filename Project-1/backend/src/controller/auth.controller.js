const userModel = require("../model/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Register = async (req, res) =>{
    const {name , email , password , bio , ProfileImage} = req.body

    const Existeduser = await userModel.findOne({
        $or: [
        {name : name},
        {email : email}
    ]
})

    if(Existeduser){
        return res.status(409).json({
            message : "Username or email already exists"
        })
    }

    const hash = await bcrypt.hash(password , 10);

    const user = await userModel.create({
        name,
        email,
        bio,
        ProfileImage,
        password : hash
    })

    const token = jwt.sign({
        id : user._id,
        username : user.name
    }, process.env.JWT_SECRET_KEY,{
        expiresIn : "1d"
    })

    res.cookie("token", token)

    return res.status(201).json({
        message : "User registered successfully",
        user: {
            email: user.email,
            name: user.name,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}

const login = async (req,res) =>{
    const {name , email , password} = req.body

    const user = await userModel.findOne({
        $or: [
            {name : name},
            {email : email}
        ]
    }).select("+password")

    if(!user){
        return res.status(404).json({
            message : "User not found"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message : "Invalid password"
        })
    }

    const token = jwt.sign({
        id : user._id,
        username : user.name
    }, process.env.JWT_SECRET_KEY,{
        expiresIn : "1d"
    })

    res.cookie("token", token)

    return res.status(200).json({
        message : "User logged in successfully",
        user: {
            email: user.email,
            name: user.name,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}

const getme = async (req,res) =>{
    const user = req.user.id;

    const isValidUser = await userModel.findById(user)

    if(!isValidUser){
        return res.status(404).json({
            message : "User not found"
        })
    }

    return res.status(200).json({
        message : "User found",
        user: {
            email: isValidUser.email,
            name: isValidUser.name,
            bio: isValidUser.bio,
            profileImage: isValidUser.profileImage
        }
    })
}



module.exports = {
    Register,
    login,
    getme
}