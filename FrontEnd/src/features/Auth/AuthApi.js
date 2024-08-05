/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */

import axios from "axios";
// const BASE_URL = "http://localhost:5000" 
const BASE_URL = "https://gupshup-e5ii.onrender.com" 

export function signUp(userData) {
    return new Promise(async (resolve,reject) => {
      const response = await axios.post(
        BASE_URL+"/auth/signUpUser",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );     
      if(response.status===201){
        resolve(response);
      }else{
        reject(response)
      }
    });
}

export function fetchLoggedInUser() {
    
  return new Promise(async (resolve,reject) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      };
     
      const response = await axios.get(BASE_URL+'/user/own', { headers });
      if(response.status===200){
        resolve(response);
      }else{
        reject(response)
      }
    } catch (error) {
      reject(error);
    }
  });
}
export function Login(loginInfo) {

    return new Promise(async (resolve,reject) => {
      try{
        const response = await axios.post(
          BASE_URL+"/auth/loginUser",
          loginInfo,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if(response.status===200){
          resolve(response);
        }else{
          reject(response)
        }
      }catch(err){
        reject( err )
      }
      
      
    });
}


export function signOut() {
    
    return new Promise(async (resolve) => {
     
          resolve({ data: 'success' });
             
    });
}

