/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  accessChat,
  AddUserInGroup,
  createGroup,
  deleteGroup,
  fetchSearchChat,
  fetchUserChats,
  groupRename,
  removeUserFromGroup,
} from "./ChatApi";
import { fetchAllMsgByChatId, sendMessage } from "./MessageApi";

const initialState = {
  ChatSearchResult: null,
  userChats: null,
  selectedChat: null,
  selectedChatMessages: [],
  newMessage: null,
  Notifications: [],
  updateChatUsers:null,
  status: "idle",
};

export const fetchSearchChatAsync = createAsyncThunk(
  "chat/fetchSearchChat",
  async (searchQuery) => {
    const response = await fetchSearchChat(searchQuery);
    return response.data;
  }
);

export const accessChatAsync = createAsyncThunk(
  "chat/accessChat",
  async (userId, thunkAPI) => {
    const response = await accessChat(userId);
    await thunkAPI.dispatch(fetchUserChatsAsync());
    return response.data;
  }
);
export const sendMessageAsync = createAsyncThunk(
  "chat/sendMessage",
  async (msgInfo, thunkAPI) => {
    const response = await sendMessage(msgInfo);
    // await thunkAPI.dispatch(fetchUser(userId));
    await thunkAPI.dispatch(fetchUserChatsAsync());
    return response.data;
  }
);

export const createGroupAsync = createAsyncThunk(
  "chat/createGroup",
  async (groupInfo, thunkAPI) => {
    const response = await createGroup(groupInfo);
    return response.data;
  }
);

export const deletGroupAsync = createAsyncThunk(
  "chat/deleteGroup",
  async (groupInfo, thunkAPI) => {
    const response = await deleteGroup(groupInfo);
    await thunkAPI.dispatch(fetchUserChatsAsync());
    return response.data;
  }
);

export const groupRenameAsync = createAsyncThunk(
  "chat/groupRename",
  async (groupInfo) => {
    const response = await groupRename(groupInfo);
    return response.data;
  }
);

export const AddUserInGroupAsync = createAsyncThunk(
  "chat/AddUserInGroup",
  async (addUserInfo) => {
    const response = await AddUserInGroup(addUserInfo);
    return response.data;
  }
);

export const removeUserFromGroupAsync = createAsyncThunk(
  "chat/removeUserFromGroup",
  async (removeUserInfo) => {
    const response = await removeUserFromGroup(removeUserInfo);
    return response.data;
  }
);

export const fetchUserChatsAsync = createAsyncThunk(
  "chat/fetchUserChats",
  async () => {
    const response = await fetchUserChats();
    return response.data;
  }
);
export const fetchAllMsgByChatIdAsync = createAsyncThunk(
  "chat/fetchAllMsgByChatId",
  async (chatId) => {
    const response = await fetchAllMsgByChatId(chatId);
    return response.data;
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChatSearch: (state) => {
      state.ChatSearchResult = null;
    },
    setSelectedChat: (state, chat) => {
      state.selectedChat = chat.payload;
    },
    updateMessage: (state, msgToAdd) => {
      state.selectedChatMessages.push(msgToAdd.payload);
    },
    updateUpdateChatUsers: (state, updateChatUsers) => {
      state.updateChatUsers=updateChatUsers.payload;
    },
    addNotification: (state, newNtf) => {
      newNtf = newNtf.payload;
      const index = state.Notifications.findIndex(
        (ntf) => ntf.chat._id === newNtf.chat._id
      );
      if (index !== -1) {
        state.Notifications[index] = newNtf;
      } else {
        state.Notifications = [...state.Notifications, newNtf];
      }

      state.Notifications.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
    },
    deleteNotification: (state, newChat) => {
      newChat = newChat.payload;
      state.Notifications = state.Notifications.filter(
        (ntf) => ntf.chat._id !== newChat._id
      );
      state.Notifications.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchSearchChatAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSearchChatAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.ChatSearchResult = action.payload.users;
      })
      .addCase(accessChatAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(accessChatAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedChat = action.payload;
      })
      .addCase(createGroupAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createGroupAsync.fulfilled, (state, action) => {
        state.status = "idle";
        if (state.userChats === null) {
          state.userChats = [];
        }

        state.userChats.push(action.payload);
        state.selectedChat = action.payload;
        state.updateChatUsers = action.payload;
        state.userChats.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      })
      .addCase(sendMessageAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedChatMessages.push(action.payload);
        state.newMessage = action.payload;
      })
      .addCase(groupRenameAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(groupRenameAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedChat = action.payload;
        state.updateChatUsers = action.payload;

        console.log(state.selectedChat);
        state.userChats = state.userChats.map((chat) =>
          chat._id === action.payload._id ? action.payload : chat
        );
        state.userChats.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      })
      .addCase(AddUserInGroupAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(AddUserInGroupAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedChat = action.payload;
        state.updateChatUsers = action.payload;
        state.userChats = state.userChats.map((chat) =>
          chat._id === action.payload._id ? action.payload : chat
        );

        state.userChats.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      })

      .addCase(removeUserFromGroupAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeUserFromGroupAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedChat = action.payload;
        state.updateChatUsers = action.payload;
        state.userChats = state.userChats.map((chat) =>
          chat._id === action.payload._id ? action.payload : chat
        );
        
        state.userChats.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      })

      .addCase(deletGroupAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletGroupAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.updateChatUsers = action.payload;
      })

      .addCase(fetchUserChatsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserChatsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userChats = action.payload;

        if (state.selectedChat) {
          const chatIndex = state.userChats.findIndex(
            (chat) => chat._id === state.selectedChat._id
          );

          if (chatIndex === -1) {
            state.selectedChat = null;
          } else {
            state.selectedChat = state.userChats[chatIndex];
          }
        }
      })
      .addCase(fetchAllMsgByChatIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllMsgByChatIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedChatMessages = action.payload;
      });
  },
});

export const {
  clearChatSearch,
  setSelectedChat,
  updateMessage,
  addNotification,
  deleteNotification,
  // updateSocket
} = chatSlice.actions;
export default chatSlice.reducer;
