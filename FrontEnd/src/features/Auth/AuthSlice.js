/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {signUp,Login,signOut, fetchLoggedInUser} from './AuthApi'



const initialState = {
  loggedINUserToken: null,
  loggedINUser:null,
  isProtected:false,
  status: "idle",
  error:null,
};


export const fetchLoggedInUserAsync = createAsyncThunk(
  "auth/fetchLoggedInUser",
  async () => {
    const response = await fetchLoggedInUser();
    return response.data; 
  }
);

export const signUpAsync = createAsyncThunk(
  "auth/signUp",
  async (userData) => {
    
    const response = await signUp(userData);
    return response.data; 
  }
);

export const loginUserAync = createAsyncThunk(
  "auth/Login",
  async (loginInfo,{rejectWithValue}) => {
    
   try{
    const response = await Login(loginInfo);
    return response.data; 
   }catch(error){
      return rejectWithValue(error)
   }
  }
);

export const signOutAsync = createAsyncThunk(
  "auth/signOut",
  async () => {
    
    const response = await signOut();
    return response.data; 
  }
);


export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateToken: (state,token) => {
      // console.log(token.payload)
      state.loggedINUserToken = token.payload;
      state.isProtected = true;
    },
    getToken: (state,token) => {
      return state.loggedINUserToken;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedINUserToken = action.payload.token;
        state.isProtected = true;
        localStorage.setItem('token',action.payload.token)
        const error ={
          message:action.payload.message
        }
        state.error = error;
      })
      .addCase(loginUserAync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUserAync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedINUserToken = action.payload.token;
        state.isProtected = true;
        localStorage.setItem('token',action.payload.token)
        const error ={
          message:action.payload.message
        }
        state.error = error;
      })

      .addCase(loginUserAync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signOutAsync.fulfilled, (state,action) => {
        state.status = "idle";
        state.loggedINUserToken = null;
        state.loggedINUser = null;
        state.isProtected = false;
        localStorage.removeItem('token')
       
      })
      .addCase(fetchLoggedInUserAsync.pending, (state) => {
        state.status = "loading";
    })
    .addCase(fetchLoggedInUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedINUser = action.payload.user;
    }) 
  },
});

export const {userLogOut,updateToken,getToken} = authSlice.actions;
export default authSlice.reducer;


