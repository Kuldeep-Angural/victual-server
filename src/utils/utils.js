const CryptoJS = require("crypto-js");

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



module.exports = {
  convertIntoResponse,
  encrypt,
  decrypt,
};
