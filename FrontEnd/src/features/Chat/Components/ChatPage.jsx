/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Box} from "@chakra-ui/react";
import Sidedrawer from "./Sidedrawer";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";

const ChatPage = () => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  
  return (
    <div className="w-full">
      <Sidedrawer/>
      <Box className="flex justify-between w-full h-[91.5vh] p-3">
      <Box
          display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
          width={{ base: "100%", md: "39%" }}
        >
          <MyChats />
        </Box>
        <Box
          display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
          width={{ base: "100%", md: "60%" }}
        >
          <ChatBox />
        </Box>
      </Box>
    </div>
  );
};

export default ChatPage;
