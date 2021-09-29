const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//create schema
var userSchema = new mongoose.Schema({
  fName:{
    type:String,
    required:true,
    trim:true,
  },
  lName:{
    type:String,
    required:true,
    trim:true,
  },
  email:{
    type:String,
    required:true,
    trim:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  userName:{
    type:String
  },
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'
  },
  contactNumber:{type:String},
  profilePicture:{type:String},
  posts:[
    {
      test:{type:String}
    }
  ],
},{timestamps:true});


userSchema.methods = {
  authenticate: (password)=>{
    return bcrypt.compareSync(password,this.hash_password)
  }
}

const UserCollection = new mongoose.model("user",userSchema);

module.exports= UserCollection;