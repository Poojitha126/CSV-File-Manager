
const express=require("express");
const bodyParser = require("body-parser");

const app=express();
const mongoose=require("mongoose");
const fileRoutes=require("./routes/file");
const path=require("path")
const UserRoutes=require("./routes/user");
const jwt=require("jsonwebtoken");

mongoose.connect("mongodb://localhost/netflix");

app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs'); 
app.use("/upload",function(req,res,next){
    try{
        const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token){
        res.status(401).json({
            status:"failed",
            message:"Not Authenticated"
        });
        
    }
    const decoded=jwt.verify(token,"Secret-123");
    if (!decoded){
        return res.status(401).json({
            status:"failed",
            message:"Invalid token"
        })
    }
    req.user=decoded.data //getting the user id from token
    }catch(e){
        return res.status(500).json({
            status:"failed",
            message:e.message
        })
    }
    next();
})
app.use(bodyParser.json())
app.get("/upload",function(req,res){
    res.render("./index")
})

app.use("/",UserRoutes);
app.use("/upload-csv",fileRoutes);
app.listen('3070', function(err){
    if(err){console.log("Error in running Server", err); return;}
    console.log("Server is up and running at port", 3070);
});