/* eslint-disable no-async-promise-executor */
import axios from "axios";
// const BASE_URL = "http://localhost:5000"
const BASE_URL = "https://gupshup-e5ii.onrender.com" 

const getHeader = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Add the token to the Authorization header
  };

  return headers;
};


export function sendMessage(msgInfo) {

    return new Promise(async (resolve,reject) => {
      
      
      const response = await axios.post(
        BASE_URL+"/message/",
        msgInfo,
        { headers: getHeader() }
      );     

        if(response.status===201){
                resolve(response);
      }else{
        reject(response)
      }
    });
}
export function fetchAllMsgByChatId(chatId) {

    return new Promise(async (resolve,reject) => {
      


      const response = await axios.get(
        BASE_URL+`/message/${chatId}`,
        { headers: getHeader() }
      );     

        if(response.status===200){
                resolve(response);
      }else{
        reject(response)
      }
    });
}