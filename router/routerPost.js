const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const User = require('../schemas/userSchema');
const Post = require('../schemas/postSchema');
const SECRET = "MERNSECRET";
// function requireLogin(req,res,next){
//   const {authorization} = req.headers
//   //authorization === Bearer ewefwegwrherhe
//   if(!authorization){
//       return res.status(401).json({error:"you must be logged in"})
//   }
//   const token = authorization.replace("Bearer ","")
//   jwt.verify(token,SECRET,(err,payload)=>{
//     if(err){
//       return   res.status(401).json({error:"you must be logged in"})
//     }
//     const {_id} = payload
//     User.findById(_id).then(userdata=>{
//         req.user = userdata
//         next()
//     })
//   })
// }
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
router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .sort('-createdAt')
    .then((posts)=>{
        res.status(200).json({posts})
    }).catch(err=>{
        console.log(err)
    })
    
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body} = req.body 
    if(!title || !body){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        postedBy:req.user,
        approved:"Pending"
    })
    post.save().then(result=>{
        res.status(201).json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(posts=>{
        res.status(200).json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findByIdAndDelete({_id:req.params.postId},(err,data)=>{
        if(err){
            console.log("error occurred");
            res.status(400).json({});
        }else{
            console.log(data);
            res.status(200).json({});
        }
    })
})
router.put('/approvePost/:postId',requireLogin,(req,res)=>{
    console.log("Entered Router");
    console.log(req);
    Post.findByIdAndUpdate({_id:req.params.postId}, { approved: 'Yes' },(err,data)=>{
        if(err){
            console.log("error occurred");
            res.status(400).json({});
        }else{
            console.log(data);
            res.status(200).json({});
        }
    })
})
router.put('/notapprovePost/:postId',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate({_id:req.params.postId}, { approved: 'No' },(err,data)=>{
        if(err){
            res.status(400).json({});
        }else{
            res.status(200).json({});
        }
    })
})

module.exports = router