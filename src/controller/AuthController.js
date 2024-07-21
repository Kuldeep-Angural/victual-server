import express from 'express'
import User from '../modal/User.js';
import { emailService } from '../service/emailService.js';
import { veriFyOtp } from '../template/emailVerifyTemplate.js';
import { convertToResponse, generateRandomNumber, getCurrentTime } from '../utils/utils.js';
import { generateRefreshToken, generateTokens } from '../service/authService.js';
import { someThingWentWrong } from '../constant/constant.js';
const router = express.Router();

export const decodeObject = (obj) => {
    const decodedObj = {};
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const encodedValue = obj[key];
            const decodedValue = atob(encodedValue);
            decodedObj[key] = decodedValue;
        }
    }
    return decodedObj;
};

router.post('/emailLogin', async (req, res) => {
    const { email } = decodeObject(req?.body)
    const otp = generateRandomNumber();
    const verificationExpiryTime = getCurrentTime(30);
    try {
        const findUser = await User.findOne({ email: email });
        if (findUser && findUser.isVerified && findUser.refreshToken) {
            const updatedUser = await User.findByIdAndUpdate(findUser._id, {
                verificationCode: otp,
                verificationExpiryTime: verificationExpiryTime
            })
            const emailRes = await emailService({ html: veriFyOtp(otp), subject: 'email Verification otp', text: '', to: email });
            res.json(convertToResponse({ data: { id: updatedUser._id }, messageType: 'success', messageText: 'Verification Otp sent to your email please veryfy', status: 200 }));
        } else {
            const nuser = new User({ email: email, verificationCode: otp, verificationExpiryTime: verificationExpiryTime })
            await nuser.save();
            const emailRes = await emailService({ html: veriFyOtp(otp), subject: 'email Verification otp', text: '', to: email });
            res.json(convertToResponse({ data: { id: nuser._id }, messageType: 'success', messageText: 'Verification Otp sent to your email please enert your otp along with your Details !', status: 201 }));
        }
    } catch (error) {
        res.json(error)
    }
})

router.post('/verify-details', async (req, res) => {
    try {
        const { mobile, name, otp, id } = req.body;

        const findUser = await User.findById(id);

        if (!findUser) {
            throw new Error('User not found');
        }

        console.log(Number(otp) === findUser?.verificationCode, findUser, findUser?.verificationExpiryTime > getCurrentTime());
        if (Number(otp) === findUser?.verificationCode && findUser.verificationExpiryTime > getCurrentTime()) {
            const updatedUser = await User.findByIdAndUpdate(id, {
                mobile: mobile,
                name: name,
                isVerified: true,
            });
            const refreshToken = generateRefreshToken(updatedUser);
            const accessToken = generateTokens(updatedUser)
            res.json(convertToResponse({ data: { id, name, mobile, email: findUser?.email, accessToken: accessToken }, messageType: 'success', messageText: 'Verification Successful!', status: 200 }));
        } else {

            if (findUser.verificationExpiryTime < getCurrentTime()) {
                await User.findByIdAndDelete(id);
                res.json(convertToResponse({ data: {}, messageType: 'error', messageText: 'Token Expired, please retry after some time', status: 202 }));
            } else {
                await User.findByIdAndDelete(id);
                res.json(convertToResponse({ data: {}, messageType: 'error', messageText: 'Invalid OTP', status: 202 }));
            }
        }
    } catch (error) {
        console.log(error);
        res.json(convertToResponse({ data: {}, messageType: 'error', messageText: 'Something went wrong', status: 500 }));
    }
});


router.post('/verify', async (req, res) => {
    const { otp, id } = req.body;
    try {
        const findUser = await User.findById(id);
        console.log(findUser , Number(otp) === findUser?.verificationCode && findUser.verificationExpiryTime > getCurrentTime());
        if (!findUser) { throw new Error('User not found');}

        if (Number(otp) === findUser?.verificationCode && findUser.verificationExpiryTime > getCurrentTime()) {
            const accessToken = await generateTokens(findUser)
            console.log("here");
            res.json(convertToResponse({ data: {email:findUser.email, name:findUser.name , id:findUser._id , roles: findUser.roles, mobile: findUser.mobile, accessToken: accessToken }, messageType: 'success', messageText: 'Verification Successful!', status: 200 }));
        } else {
            if (findUser.verificationExpiryTime < getCurrentTime()) {
                await User.findByIdAndDelete(id);
                res.json(convertToResponse({ data: {}, messageType: 'error', messageText: 'Token Expired, please retry after some time', status: 202 }));
            } else {
                await User.findByIdAndDelete(id);
                res.json(convertToResponse({ data: {}, messageType: 'error', messageText: 'Invalid OTP', status: 202 }));
            }
        }
    } catch (error) {
        res.json(error)
    }

})



router.get('/googleLogin', (req, res) => {
    return res.json('Hello ')
})

export default router;