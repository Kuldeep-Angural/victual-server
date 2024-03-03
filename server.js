const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./src/dbConfig/DB.js");
const routes = require("./src/controller/userController.js");
const { appRunDAta } = require("./src/constant/constant.js");
require("./src/passportConfig/passport.js");

const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.json());

connectDB();

app.use(session({
  secret: process.env.TOKEN_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(cors({
  origin:process.env.CLIENT_URL,
  methods:"GET,POST,PUT,DELETE",
  credentials:true
}));
app.use(express.json())


app.use(passport.initialize());
app.use(passport.session());

app.post("/register", routes.register);
app.post("/login", routes.login);

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get('/google/login/success',  routes.loginWithGoogle);
app.get('/google/login/failed', (req, res) => { res.status(400).json({ error: true, message: 'Login Failed' }) });
app.get('/logout', (req, res) => {req.logOut();res.json({ message: 'logout successfully' })});

app.get("/auth/google/callback",passport.authenticate("google", {successRedirect: `${process.env.CLIENT_URL}/`,failureRedirect: '/google/login/failed',}));




app.listen(PORT, () =>{
  console.log("Congratulations Server started Successfully on PORT:", PORT)
  console.log("Wait for Loading all Module")
  // console.log(appRunDAta);
  console.log(' *** THE VICTUAL ***')

}
);

module.exports = { app };
