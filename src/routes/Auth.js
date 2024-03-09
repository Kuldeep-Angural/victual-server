const { Router } = require('express');
const { userAlreadyExist, registrationSuccessFully, userNotFound, invalidPassword, loginSuccessfully, accessTokenCreatedSuccessfully, logout, internalServerError } = require('../constant/constant');
const { decrypt, encrypt } = require('../utils/utils');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt');
const { user, userToken } = require('../modal/Modals');
const jwt = require('jsonwebtoken');

const router = Router();

const getUserCredentials = (req) => {
   
        const header = req.headers;
        const base64Credentials = header?.authorization.split(' ')[1];
        const decodedContent = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        console.log(decodedContent.split(':'));
        return decodedContent.split(':');
    
};

router.post('/signup', async (req, res) => {
    try {
        const [name, mobile, email, password] = getUserCredentials(req);
        const newPassword = encrypt(password);

        const existingUser = await user.findOne({ email: email  });
        if (existingUser) {
            return res.status(400).json({ message: userAlreadyExist });
        }

        const newUser = new user({ name, email, mobile, password: newPassword });
        await newUser.save();
        
        return res.status(201).json({ message: registrationSuccessFully });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError });
    }
});

router.post('/login', async (req, res) => {
    try {
        const [email, password] =  getUserCredentials(req);
        console.log(email, password);
        const userRecord = await user.findOne({ email });
        if (!userRecord) {
            return res.status(400).json({ message: userNotFound });
        }

        const decryptedPassword = decrypt(userRecord.password);
        if (password !== decryptedPassword) {
            return res.status(400).json({ message: invalidPassword });
        }
        const { accessToken, refreshToken } = await generateTokens(userRecord);       
        const userData = btoa(userRecord._id+':'+userRecord.name + ':'+userRecord.email+':'+ userRecord.mobile+':'+userRecord.roles);
        return res.status(200).json({ message: loginSuccessfully, accessToken, refreshToken,userData:userData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError });
    }
});


router.post("/refreshToken", async (req, res) => {
    console.log(req);
    verifyRefreshToken(req.body.refreshToken)
    .then(( tokenDetails ) => {
        console.log(tokenDetails);
        const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
        const accessToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_TIME }
        );
        res.status(200).json({
            accessToken,
            message: accessTokenCreatedSuccessfully,
        });
    })
    .catch((err) =>{
        res.status(400).json(err)
        console.log(err);   
    });
});


router.delete("/logout", async (req, res) => {
    try {
        const token = await userToken.findOneAndDelete({ token: req.body.refreshToken });
        if (!token) {
            return res.status(200).json({ error: false, message: 'logged-out' });
        }
        res.status(200).json({ error: false, message: logout });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: internalServerError });
    }
});

module.exports = router;
