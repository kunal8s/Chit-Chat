const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protectRoute = async (req,res,next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized - No taken found"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized - Invalid token"});
        }
        const user = await User.findById(decoded.userId).select('-password');
        req.user = user;
        next();
    }
    catch(error){
        console.log('Error in protectRoute middleware :',error.message);
        res.status(500).json({error:"Internal server error"});
    }
}



module.exports = protectRoute;