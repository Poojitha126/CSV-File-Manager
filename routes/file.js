const express = require('express');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const router= express.Router();
const Netfilx = require('../model/file');
const aqp = require('api-query-params');
const { deleteOne } = require('../model/file');
const { info } = require('console');



const csvFilter = (req, file, cb) => {
    if (file.originalname.includes("csv")) {
      cb(null, true);
    } else {
      cb("Please upload only csv file.", false);
    }
  };
var upload = multer({ dest:  'public/upload/', fileFilter: csvFilter });


router.post('/', upload.single('file'), function (req, res) {
    const fileRows = [];
    csv.parseFile(req.file.path)
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
        console.log(fileRows)
        fileRows.slice(1,-1).forEach(row => {
           
            Netfilx.create({show_id:row[0],type:row[1],title:row[2],director:row[3],cast:row[4],country:row[5],date_added:row[6],release_year:row[7],rating:row[8],duration:row[9],listed_in:row[10],description:row[11]}, function (err, res) {
                if(res){
                    console.log(res)
                }
                console.log(err)
            })
        });
        fs.unlinkSync(req.file.path);
      })

});

router.get("/",async function(req,res){
  try{
    const data= await Netfilx.find();
  res.json({
    status:"success",
    data:data

  })
  }catch(e){
    res.json({
      status:"failed",
      message:e.message
  
    })
  }
  
})
router.get("/:field",async function(req,res){
  try{
    const  field=req.params.field
    const data= await Netfilx.find({},field);
  res.json({
    status:"success",
    data:data

  })
  }catch(e){
    res.json({
      status:"failed",
      message:e.message
  
    })
  }
})
router.get('/find',async function(req,res){
  const { filter } = aqp(req.query);
  // filter={"$and":[{"key1":"value1"},{"key2":"value2"},{"key3":"value3"},{"key4":"value4"}]}
  const data = await Netfilx.find(filter).exec((err, data) => {
      if (err) {
        res.json({
            status:"failed"
        })
      }

      res.json({
          status:"success",
          data:{
              data
          }
      });
    });
});
router.delete('/find',async function(req,res){
  const { filter } = aqp(req.query);
  const data = await Netfilx.find(filter).exec((err, data) => {
            if (err) {
              res.json({
                  status:"failed"
              })
            }
            if (data.length){
              data.map(async parameter=>{
                console.log(parameter._id,parameter.title)
                await Netfilx.deleteOne({_id:info._id})
              })
            }
            res.json({
                status:"success",
                
            });
          
      });
      
    });


module.exports=router;