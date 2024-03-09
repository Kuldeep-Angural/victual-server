const { accessDenied, accessDeniedNotValidToken, notAuthorized } = require("../constant/constant");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authentication = async (req, res, next) => {
    const token = req.header("x-access-token");
    console.log(token);
    if (!token) {
        return res.status(403).json({
            message: accessDenied
        });
    } else {
        try {
            const tokenDetails = jwt.verify(
                token,
                process.env.TOKEN_SECRET
            );
            console.log(tokenDetails);
            req.user = tokenDetails;
            next();
        } catch (error) {
            res.status(403).json({ message: accessDeniedNotValidToken });
        }
    }
};

const checkRoles = (roles) => {
    return (req, res, next) => {
        roles.push("user");
        if (req.user.roles.includes(...roles)) {
            next();
        } else {
            res.status(403).json({ error: true, message: notAuthorized });
        }
    };
};

module.exports = {
    checkRoles,
    authentication
};
