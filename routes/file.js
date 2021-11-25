const express = require('express');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const router= express.Router();
const Netfilx = require('../model/file');
const aqp = require('api-query-params');



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



module.exports=router;