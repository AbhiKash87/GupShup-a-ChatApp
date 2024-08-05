/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */

import axios from "axios";


export function signUp(userData) {
    return new Promise(async (resolve,reject) => {
      const response = await axios.post(
        "http://localhost:5000/auth/signUpUser",
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
     
      const response = await axios.get('http://localhost:5000/user/own', { headers });
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
          "http://localhost:5000/auth/loginUser",
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

