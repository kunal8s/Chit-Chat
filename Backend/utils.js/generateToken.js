const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId,res) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '15d'
    });

    res.cookie("jwt",token,{
        httpOnly:true,
        maxAge: 15*24*60*60*1000,
        sameSite:"strict", // strict means cookie will only be set if the domain in the URL bar is the same as the domain of the cookie.
        secure: process.env.NODE_ENV !== 'development' 
    }); 
    }
module.exports = generateTokenAndSetCookie;


/*
httpOnly:
When set to true, the cookie cannot be accessed or modified via client-side JavaScript (e.g., document.cookie). or cross site scripting attack*/ 