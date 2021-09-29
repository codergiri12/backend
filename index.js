const express = require('express');
const app = express();
// const path = require('path');
const cors = require('cors')

require('./connectDB');

const PORT = process.env.PORT || 8000;


app.use(express.json())
app.use(cors());

const userRouter = require('./router/routerUser');
const adminRouter = require('./router/routerAdmin')
const postRouter = require('./router/routerPost');

app.use(userRouter);
app.use(adminRouter);
app.use(postRouter);

app.listen(PORT,()=>{
  console.log("server started running")
});