const utils = require('../utils/utils');
const mongoose = require("mongoose");
const schema = require('../Schema/schema');


const loginWithGoogle = async (req,res) => {

}

const loginWithFaceBook = async (req,res) => {

}


const login =  async (req, res) => {
    const header = req.headers;
    const base64Credentials = header?.authorization.split(' ')[1];
    const decodedData = atob(base64Credentials);
    const inputString = decodedData;
    
    const [email, password] = inputString.split(':');  

    const existingUser = await schema.register.findOne({ email: email});
    const decryptPassword = utils.decrypt(existingUser?.password);

    console.log(existingUser);
    if (existingUser && password===decryptPassword) {
        const token = utils.generateAccessToken({username:email});
        const loginSchema = new schema.login({
            registration_Id:existingUser._id,
            email:email,
            token:token
        })
     await loginSchema.save();
     return res.json({email:email,token:token,registerationId:existingUser._id});

    }else{
        return res.status(400).json(utils.convertIntoResponse({ message:"Record not found please register yourSelf or login via another method " }));
    }
}


const register = async (req, res) => {
    try {
        const header = req.headers;
        const base64Credentials = header?.authorization.split(' ')[1];
        const decodedPassword = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [name, mobile, email, password] = decodedPassword.split(':');
       
        const newPassword = utils.encrypt(password);
        const newRegistration = new schema.register({
            name: name,
            email: email,
            mobile: mobile,
            password: newPassword
        });

        const existingUser = await schema.register.findOne({ $or: [{ email: email }, { mobile: mobile }] });
        if (existingUser) {
            return res.status(400).json(utils.convertIntoResponse({ message: 'User already exists with this email' }));
        }else{
            await newRegistration.save();
            return res.json(utils.convertIntoResponse({
                message: 'Registration Successful!',
                payload: {
                    name: name,
                    email: email,
                }
            }));
        }
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json(utils.convertIntoResponse({
            message: 'Registration failed!',
            error: error.message
        }));
    }
}


module.exports={login,register,loginWithGoogle,loginWithFaceBook}