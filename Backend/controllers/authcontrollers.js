const bcrypt = require('bcryptjs');
const User = require('../models/user');
const generateTokenAndSetCookie = require('../utils.js/generateToken');


const signup = async (req, res) => {
   try{
    const {fullName,username ,password,confirmPassword,gender} =req.body;
    if(password!==confirmPassword){
        return res.status(400).json({error:"Password do not match"});
    }

    const user = await User.findOne({username});
    if(user){
        return res.status(400).json({error:"Username already exists"});
    }
    // Hash Password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;

    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await User.create({
        fullName,
        username,
        password :hashedPassword,
        gender,
        profilePic:gender==="Male" ? boyProfilePic : girlProfilePic
    })
    if(newUser){
        // Generate JWT token
        generateTokenAndSetCookie(newUser._id,res);

    res.status(201).json({
        _id:newUser._id,
        fullName:newUser.fullName,
        username:newUser.username,
        profilePic:newUser.profilePic
    });
} else{
    res.status(400).json({error:"Invalid user data"});
}

   }
   catch(error){
    // console.log('Error is signup cotroller :',error.message);
    res.status(500).json({error:"Internal server error"});
   }
}   

const login = async (req, res) => {
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = user && await bcrypt.compare(password,user.password);
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid username or password"});
        }
        generateTokenAndSetCookie(user._id,res);

        
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            profilePic:user.profilePic
        });
        // console.log("backend login work fine ")
    }
    catch(error){
        // console.log('Error is login cotroller :',error.message);
        res.status(500).json({error:"Internal server error"});
       }
}

const logout = async (req, res) => {    
   try{
   res.cookie("jwt","",{
       httpOnly:true,
       maxAge:0,    
    });
    res.status(200).json({message:"Logout successfully"});
    // console.log("backend logout work fine ")
   }
   catch(error){
    // console.log('Error is logout cotroller :',error.message);
    res.status(500).json({error:"Internal server error"});
   }
}

module.exports = {
    signup,
    login,
    logout
}