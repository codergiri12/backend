const express = require('express');
const jwt = require('jsonwebtoken');
const UserCollection = require('../schemas/userSchema');
const { validateSignUp, validatedSignUp,validateSignIn, validatedSignIn } = require('../validate');
const SECRET = "MERNSECRET"
const router = express.Router();

function requireSignIn(req,res,next){
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token,SECRET);
    req.user = user;
    next();
  } else {
    return res.status(400).send("Authorization required");
  }
}
//creates new admin check-->email already exists or not
https://giir.herokuapp.com/admin/signout
router.post('/admin/signup',validateSignUp,validatedSignUp,  async(req,res)=>{
  try {
    console.log(req.body);
    const {fName,lName,email,password} = req.body;

    const doc = {
      fName : fName,
      lName : lName,
      email : email,
      password : password,
      userName : fName +" "+lName,
      role:'admin'
    }
    const userDocument = new UserCollection(doc);
    console.log(userDocument);
    const emailExists = await UserCollection.findOne({
      email : req.body.email
    });
    if(emailExists){
      return res.status(400).send("This admin already exists");
    }
    const saveUser =await userDocument.save();
    res.status(201).send(saveUser)
  } catch (error) {
    console.log(error)
  }
});
//checks password and role==='admin' , assign token  , checks with that email user exists or not
router.post('/admin/signin',validateSignIn,validatedSignIn,async(req,res)=>{
  try {
    const enteredDetails = req.body;
    const user = await UserCollection.findOne({email : enteredDetails.email});
    if(user=== null){
      return res.status(400).send("Admin Not found")
    }
    if(enteredDetails.password===user.password && user.role === 'admin'){
      const token = jwt.sign( {_id : user._id, role:user.role},SECRET,{expiresIn:'1d'});
      res.cookie('token',token,{expiresIn:'1h'});
      const {_id , fName , lName , email , role , password , userName} = user;
      res.status (200).json({
        token,
        user:{
          _id,fName,lName,email,role,password,userName
        }
      })
    }
  } catch (error) {
    console.log("error in sigin ",error)
  }
});

router.post('/admin/signout',async(req,res)=>{
  console.log('entered admin router');
  res.clearCookie('token');
  res.status(200).json({message:'Signout successfully'})
});
router.get
router.put
router.delete

module.exports = router;