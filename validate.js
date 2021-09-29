const {validationResult,check} = require('express-validator');

exports.validateSignUp = [
  check('fName').notEmpty().withMessage("first name is required"),
  check('lName').notEmpty().withMessage("last name is required"),
  check('email').isEmail().withMessage("Enter valid Email"),
  check('password').isLength({min:6}).withMessage("Password must contain atleast 6 characters")
];
exports.validatedSignUp = (req,res,next)=>{
  const errors = validationResult(req);
  if(errors.array().length > 0){
    return res.status(400).json(errors.array()[0].msg);
  }
  next();
}

exports.validateSignIn = [
  check('email').isEmail().withMessage("Enter valid Email"),
  check('password').isLength({min:6}).withMessage("Password must contain atleast 6 characters")
];
exports.validatedSignIn = (req,res,next)=>{
  const errors = validationResult(req);
  if(errors.array().length > 0){
    return res.status(400).json(errors.array()[0].msg);
  }
  next();
}

exports.userMiddleware =(req,res,next)=>{
  if(!req.user.role === 'user'){
    res.status(400).send("User Access Denied");
  }
  next();
}

exports.adminMiddleware =(req,res,next)=>{
  if(!req.user.role === 'admin'){
    res.status(400).send("Admin Access Denied");
  }
  next();
}