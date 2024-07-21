import  CryptoJS  from"crypto-js";


export const encrypt = (text) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};

export const decrypt = (data) => {
  return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
};


export const  generateRandomNumber = () => {
  return Math.floor(Math.random() * 900000) + 100000;
}




export const  getCurrentTime = (incremented) =>  {
  const now = new Date();
  incremented && now.setMinutes(now.getMinutes() + incremented);
  const options = {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  return now.toLocaleString('en-IN', options);
}

export const convertToResponse = ({data,messageText , messageType , status}) => {
  return  {
        data:data,
        message:{ messageText:messageText,messageType:messageType, },
        status:status

    }
    ;
}