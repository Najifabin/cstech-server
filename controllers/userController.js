const users = require('../models/userModel')
const jwt = require('jsonwebtoken')


// login
exports.loginController = async (req,res)=>{
    console.log('inside login');
    const {email,password} = req.body
    // console.log(email,password);
    
    try{
        const existingUser = await users.findOne({email,password})
        // console.log(existingUser);
        
        if(existingUser){
            // token generation
            const token = jwt.sign({userId:existingUser._id},process.env.JWTPASSWORD)
            // console.log(token);
            
            res.status(200).json({user:existingUser,
                token
            })
        }else{
            res.status(404).json("Invalid Email / Password")
        }
    }catch(err){
        res.status(401).json(err)
    }
}