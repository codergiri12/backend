const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    postedBy:{
       type:ObjectId,
       ref:"user"
    },
    approved:{
        type:String,
    }
},{timestamps:true})

const postCollection = new mongoose.model("Post",postSchema);
module.exports= postCollection;