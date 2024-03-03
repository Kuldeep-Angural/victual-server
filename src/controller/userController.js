const utils = require('../utils/utils');
const mongoose = require("mongoose");
const schema = require('../Schema/schema');

const loginWithFaceBook = async (req,res) => {

}


const loginWithGoogle = async (req,res) => {

    const {id,displayName,emails,photos} =req?.user||{};

    const isExist = await schema.user.findOne({ _id: id});

    if (isExist) {
        const token = utils.generateAccessToken({username:emails[0].value});
        const loginSchema = new schema.login({
            registration_Id:id,
            name:displayName,
            email:emails[0].value,
            googlePhoto:photos[0].value,
            token:token,
            isGoogleLogin:true
        })
            await loginSchema.save();
            return res.status(200).json({message:'login successfully', user:isExist , token:token});
    }else{
        return res.status(400).json(utils.convertIntoResponse({ message:"Record not found please register yourSelf or login via another method " }));
    }
        
 }

const saveGoogleLoginDetails = async (profile) => {
        console.log(profile);
        const existingUser = await schema.user.findOne({ email: email});  
        if (!existingUser) {
            const token = utils.generateAccessToken({username:emails[0].value});
        const loginSchema = new schema.login({
            registration_Id:id,
            name:displayName,
            email:emails[0].value,
            googlePhoto:profile.photos[0].value,
            token:token,
            isGoogleLogin:false
        })
            await loginSchema.save();
        }
        else{
            return res.status(400).json(utils.convertIntoResponse({ message:"Record not found please register yourSelf or login via another method " }));
        }
}

const login =  async (req, res) => {
    const header = req.headers;
    const base64Credentials = header?.authorization.split(' ')[1];
    const decodedData = atob(base64Credentials);
    const inputString = decodedData;
    
    const [email, password] = inputString.split(':');  

    const existingUser = await schema.user.findOne({ email: email});
    const decryptPassword = utils.decrypt(existingUser?.password);

    console.log(existingUser);
    if (existingUser && password===decryptPassword) {
        const token = utils.generateAccessToken({username:email});
        const loginSchema = new schema.login({
            registration_Id:existingUser._id,
            name:existingUser.name,
            email:email,
            token:token,
            isGoogleLogin:false
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

        const existingUser = await schema.user.findOne({ $or: [{ email: email }, { mobile: mobile }] });
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


module.exports={login,register,loginWithGoogle,loginWithFaceBook,saveGoogleLoginDetails}