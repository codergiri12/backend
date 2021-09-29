const express = require('express');
const jwt = require('jsonwebtoken');
const UserCollection = require('../schemas/userSchema');
const SECRET = "MERNSECRET"
const router = express.Router();
const {validateSignUp,validatedSignUp} = require('../validate');

function requireLogin(req,res,next){
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token,SECRET);
    req.user = user;
    next();
  } else {
    return res.status(400).send("Authorization required");
  }
}

//creates new user check-->email already exists or not
router.post('/signup',validateSignUp,validatedSignUp,async(req,res)=>{
  try {
    
    const {fName,lName,email,password} = req.body;
    const doc = {
      fName : fName,
      lName : lName,
      email : email,
      password : password,
      userName : fName +" "+lName ,
      role:'user',
    }
    const userDocument = new UserCollection(doc);
    console.log(userDocument);
    const emailExists = await UserCollection.findOne({
      email : req.body.email
    });
    if(emailExists){
      return res.status(400).send("This user already exists");
    }
    const saveUser =await userDocument.save();
    res.status(201).send(saveUser)
  } catch (error) {
    console.log(error)
  }
});
//checks password , assign token  , checks with that email user exists or not
router.post('/signin',async(req,res)=>{
  try {
    const enteredDetails = req.body;
    const user = await UserCollection.findOne({email : enteredDetails.email});

    if(enteredDetails.password===user.password && enteredDetails.role=='user'){
      const token = jwt.sign( {_id : user._id,role:user.role},SECRET,{expiresIn:'1h'})
      const {_id , fName , lName , email , role , password , userName} = user;
      res.status(200).json({
        token,
        user:{
          _id,fName,lName,email,role,password,userName
        }
      })
    }else{
      res.status(400).json({});
    }
  } catch (error) {
    console.log("error in signin ",error)
  }
});

router.get('/allusers',requireLogin,async(req,res)=>{
  try {
    const user = await UserCollection.find({role:'user'});
    // console.log(user);
    res.status(200).json({data:user});
  } catch (error) {
    console.log("error in signin ",error)
  }
});
router.delete('/deleteuser/:uId',requireLogin,(req,res)=>{
  UserCollection.findByIdAndDelete({_id:req.params.uId},(err,data)=>{
      if(err){
          console.log("error occurred");
          res.status(400).json({});
      }else{
          console.log(data);
          res.status(200).json({});
      }
  })
})

module.exports = router;