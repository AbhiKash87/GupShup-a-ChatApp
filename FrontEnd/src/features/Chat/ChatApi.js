/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */
import axios from "axios";

const BASE_URL = "http://localhost:5000" 
const getHeader = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Add the token to the Authorization header
  };

  return headers;
};


export function fetchSearchChat(searchQuery) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        BASE_URL+`/user?search=${searchQuery}`,
        { headers: getHeader() }
      );

      if (response.status === 200) {
        resolve(response);
      } else {
        reject(response);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function accessChat(userId) {
  return new Promise(async (resolve, reject) => {
    const response = await axios.post(
      BASE_URL+"/chats",
      {
        userId: userId,
      },
      {
        headers: getHeader(),
      }
    );

    if (response.status === 200) {
      resolve(response);
    } else {
      reject(response);
    }
  });
}
export function createGroup(groupInfo) {
  return new Promise(async (resolve, reject) => {
    const response = await axios.post(
      BASE_URL+"/chats/group/",
      groupInfo,

      { headers: getHeader() }
    );

    if (response.status === 200) {
      resolve(response);
    } else {
      reject(response);
    }
  });
}
export function groupRename(groupInfo) {
  return new Promise(async (resolve, reject) => {
    const response = await axios.put(
      BASE_URL+"/chats/group/rename",
      groupInfo,
      { headers: getHeader() }
    );

    if (response.status === 200) {
      console.log(response);
      resolve(response);
    } else {
      reject(response);
    }
  });
}

export function AddUserInGroup(groupInfo) {
  return new Promise(async (resolve, reject) => {
   

    const response = await axios.put(
      BASE_URL+"/chats/group/add",
      groupInfo,
      { headers:getHeader() }
    );

    if (response.status === 200) {
      resolve(response);
    } else {
      reject(response);
    }
  });
}

export function removeUserFromGroup(removeUserInfo) {
  return new Promise(async (resolve, reject) => {
    const response = await axios.put(
      BASE_URL+"/chats/group/remove",
      removeUserInfo,
      { headers: getHeader() }
    );

    if (response.status === 200) {
      resolve(response);
    } else {
      reject(response);
    }
  });
}

export function deleteGroup(deleteChatInfo) {
  return new Promise(async (resolve, reject) => {
    const response = await axios.put(
      BASE_URL+"/chats/group/delete",
      deleteChatInfo,
      { headers: getHeader() }
    );

    if (response.status === 200) {
      resolve(response);
    } else {
      reject(response);
    }
  });
}

export function fetchUserChats() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(BASE_URL+"/chats", {
        headers: getHeader(),
      });
      if (response.status === 200) {
        resolve(response);
      } else {
        reject(response);
      }
    } catch (error) {
      reject(error);
    }
  });
}
