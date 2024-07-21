
import  jwt  from 'jsonwebtoken';
import  userToken  from'../modal/Token.js';
import  { invalidRefreshToken, validRefreshToken } from '../constant/constant.js';
import dotenv from "dotenv";
import token from '../modal/Token.js';
import user from '../modal/User.js';

dotenv.config();


export const generateTokens = async (user) => {
    try {
        const payload = { _id: user._id, roles: user.roles };
        const accessToken = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_TIME }
        );

        const existingToken = await token.findOneAndDelete({ userId: user._id });
        
        const tokens = await new userToken({ userId: user._id, token: accessToken }).save();
        return tokens?.token ;
    } catch (error) {
        throw error;
    }
};

export const generateRefreshToken = async (data) => {
    console.log(data);
    try {
        const payload = { _id: data._id, roles: data.roles , email:data?.email };
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_TIME }
        );
     const updated = await user.findByIdAndUpdate(data._id,{
            name:data.name,
            email:data.email,
            mobile:data.mobile,
            refreshToken:refreshToken,
            roles:data.roles,
            isVerified:true,
          
        })
        return refreshToken;
    } catch (error) {
            return error
    }
}

export const verifyRefreshToken = async (refreshToken) => {
    try {
        const privateKey = process.env.REFRESH_TOKEN_SECRET;
        const doc = await token.findOne({ token: refreshToken });
        
        if (!doc) {
            throw { message: invalidRefreshToken };
        } else {
            const tokenDetails = jwt.verify(refreshToken, privateKey);
            return {
                tokenDetails,
                message: validRefreshToken
            };
        }
    } catch (error) {
        throw error;
    }
};
