const jwt = require('jsonwebtoken');
const { userToken } = require('../modal/Modals');
const { invalidRefreshToken, validRefreshToken } = require('../constant/constant');
require('dotenv').config();

const generateTokens = async (user) => {
    try {
        const payload = { _id: user._id, roles: user.roles };
        const accessToken = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_TIME }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_TIME }
        );

        const existingToken = await userToken.findOneAndDelete({ userId: user._id });

        await new userToken({ userId: user._id, token: refreshToken }).save();
        console.log(accessToken,refreshToken);
        return { accessToken:accessToken, refreshToken:refreshToken };
    } catch (error) {
        console.log(error);
        throw error;
    }
};


const verifyRefreshToken = async (refreshToken) => {
    try {
        const privateKey = process.env.REFRESH_TOKEN_SECRET;
        const doc = await userToken.findOne({ token: refreshToken });
        
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


module.exports = {
    generateTokens,
    verifyRefreshToken,
};
