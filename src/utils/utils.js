const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const convertIntoResponse = ({ message, payload, ...rest }) => {
  const data = {
    ...(payload && { payload: { ...payload } }),
    message: message || "Success",
    ...rest,
  };
  return data;
};

const encrypt = (text) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};

const decrypt = (data) => {
  return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
};

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
}

const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  convertIntoResponse,
  encrypt,
  decrypt,
  generateAccessToken,
  verifyRefreshToken,
};
