const mongoose=require("mongoose");




const Schema=mongoose.Schema;
const FileSchema= new Schema({
        show_id:{type:"String"},
        type:{type:"String"},
        title:{type:"String"},
        director:{type:"String"},
        cast:{type:"String"},
        country:{type:"String"},
        date_added:{type:"String"},
        release_year:{type:"String"},
        rating:{type:"String"},
        duration:{type:"String"},
        listed_in:{type:"String"},
        description:{type:"String"}})


const File=mongoose.model("File",FileSchema);
module.exports=File;