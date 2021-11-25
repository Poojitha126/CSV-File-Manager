const express=require("express");
const bodyParser = require("body-parser");

const app=express();
const mongoose=require("mongoose");
const fileRoutes=require("./routes/file");
const path=require("path")

mongoose.connect("mongodb://localhost/netflix");

app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs'); 
app.use(bodyParser())
app.get("/",function(req,res){
    res.render("./index")
})


app.use("/upload-csv",fileRoutes);
app.listen('3070', function(err){
    if(err){console.log("Error in running Server", err); return;}
    console.log("Server is up and running at port", 3070);
});