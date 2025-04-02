import CryptoJS from "crypto-js";

const SECRET_PASSPHRASE = "your_secret_key"; 
const SECRET_KEY = CryptoJS.SHA256(SECRET_PASSPHRASE).toString(); 

export const encryptData = (data: object): string => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
};

export const decryptData = (ciphertext: string): object | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Decryption Error:", error);
    return null;
  }
};
