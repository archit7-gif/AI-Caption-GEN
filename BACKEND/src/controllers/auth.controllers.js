

// auth.routes.js ka logic yaha hoga , ek certian route hit karne p ky hoga uska logic yaha ayega

const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');





// Register APi
async function registerController(req,res){
    try {
    const {username , password} = req.body
    
    const isUserExixt = await UserModel.findOne({ username })
    
    if(isUserExixt){ return res.status(409).json({message : "user already exists"})}
    
    const user = await UserModel.create({
    username,
    password : await bcrypt.hash(password,10) }) // hasing the password
    
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
    
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,       // ✅ needed on HTTPS
    sameSite: "None",   // ✅ needed to allow cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week 
    });

    
    res.status(201).json({message : " user registerd sucessfully",user})
    } catch (error) {
    console.log(error)
    }

}



// login API
async function logincontroller(req,res){
    const {username ,password} =req.body
    
    const user = await UserModel.findOne({username})
    
    if(!user){return res.status(404).json({message : "User Not Found"})} 
    
    const EnteredPassword = await bcrypt.compare(password, user.password)
    
    if(!EnteredPassword){return res.status(401).json({message : "Invalid Password" })}
    
    const token = jwt.sign({id: user._id},process.env.JWT_SECRET)
    
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,       // ✅ needed on HTTPS
    sameSite: "None",   // ✅ needed to allow cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week 
    });
    
    res.status(200).json({message : "User Logged In Successfully",user,id: user._id,})
}


// logout controller 

async function logoutController(req, res) {
try {
    res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    });
    res.status(200).json({ message: "User logged out successfully" });
} catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
}
}







module.exports = {
    registerController,
    logincontroller,
    logoutController
}