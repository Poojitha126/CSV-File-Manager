const express = require("express");
const User = require("../model/user");
const bodyParser=require("body-parser");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const router=express.Router();

router.post("/login",async function(req,res){
    try{
        const {email,password}=req.body;
        const user= await User.findOne({email});
        if (!user){
            return res.json({
                status:"failed",
                message:"Not Resgistered"
            })
        }
        const match=await bcrypt.compare(password,user.password);
        if (!match){
            return res.json({
                status:"failed",
                message:"Ivalid Credentials"
            });
        }
       

        const token=jwt.sign({
            exp:Math.floor(Date.now()/1000)+(60*60),
            data:user._id
        },"Secret-123");
        
        res.json({
            status:"success", 
            data:{
                token
            }
        });
    }catch(e){
        return res.json({
            status:"failed",
            message:"Internal Error "
        })
    }
    
})
router.post("/register",async function(req,res){
    try{
        const {name,email,password}=req.body;
        console.log(name,email,password)
        const hash=await bcrypt.hash(password,10);
        await User.create({name,email,password:hash});
        res.json({
            status:"success",
            message:"Signed up"
        })
    }catch(e){
        res.json({
            status:"failed",
            message:e.message
        })
    }
    
})
module.exports=router;