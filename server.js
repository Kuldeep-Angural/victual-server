const express = require("express");
const cors = require("cors");
const DBCONNECTON = require("./src/dbConfig/DB");
require('dotenv').config()
const auth = require('./src/routes/Auth');
const { config } = require("dotenv");
const userRouter = require('./src/routes/user');

const app = express();
const PORT = process.env.PORT || 8081;
app.use(express.json());

config();
DBCONNECTON();

app.use(cors({ origin:process.env.CLIENT_URL,methods:"GET,POST,PUT,DELETE",credentials:true}));
app.use('/test',(req,res)=>{
  return res.json("hello);
                  })
app.use('/api',auth);
app.use('/api/user',userRouter);


app.listen(PORT, () =>{
  console.log("Congratulations Server started Successfully on PORT:", PORT)
  console.log("Wait for Loading all Module")
  console.log(' *** THE VICTUAL ***')

}
);

module.exports = { app };
