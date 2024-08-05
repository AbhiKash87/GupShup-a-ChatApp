import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Auth/AuthSlice'
import chatReducer from '../features/Chat/ChatSlice'



export const store = configureStore({
  reducer: {
    auth:authReducer,
    chat:chatReducer
  },
});