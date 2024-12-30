import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chats",
  initialState: {
    allChats: [],
    chatMessages: {}, // Messages
  },
  reducers: {
    addChats: (state, action) => {
      state.allChats = action.payload;
    },
    addSingleChat: (state, action) => {
      state.allChats.push(action.payload);
    },
    addChatMessages: (state, action) => {
      state.chatMessages = { ...state.chatMessages, ...action.payload };
    },
    removeUserFromChat: (state, action) => {
      const { chatId, userId } = action.payload;

      state.allChats = state.allChats.filter((chat) => {
        if (chat._id == chatId) {
          return chat.users.filter((user) => user._id != userId);
        } else {
          return true;
        }
      });
    },
    exitChat: (state, action) => {
      const chatId = action.payload;
      state.allChats = state.allChats.filter((chat) => chat._id != chatId);
    },
  },
});

export const {
  addChats,
  addSingleChat,
  addChatMessages,
  removeUserFromChat,
  exitChat,
} = chatSlice.actions;
export default chatSlice.reducer;
