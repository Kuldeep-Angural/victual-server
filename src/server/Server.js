import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import DatabaseConnector from "../dbConfig/DastaBaseConnector.js";
import {serverTest} from '../constant/ServerTesting.js'
import AuthController from '../controller/AuthController.js'
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8081;


app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL || '*', methods: "GET,POST,PUT,DELETE", credentials: true }));
app.options("*", cors());
app.use(session({ secret: "njsbkdbadwq7r923gfb348rt38", resave: false, saveUninitialized: true, }));
app.use(express.json());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth", AuthController);

DatabaseConnector();
app.get("/", (req, res) => res.send(serverTest));
app.get("/api/", (req, res) => res.json({ message: `Server is running on port ${PORT}` }));

app.listen(PORT, () => {
    console.log("Congratulations! Server started successfully on PORT:", PORT);
    console.log("Wait for loading all modules...");
    console.log("*** The Victuals ***");
});
