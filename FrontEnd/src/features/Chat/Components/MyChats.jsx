/* eslint-disable no-unused-vars */
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingSpinner } from "./LoadingSpinner.jsx";
import { getSender } from "../../ChatLogics/ChatLogic";
import { deleteNotification, fetchUserChatsAsync, setSelectedChat } from "../ChatSlice.js";
import GroupChatModal from "./GroupChatModal.jsx";
import ChatItem from "./ChatItem";

const MyChats = () => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const userChats = useSelector((state) => state.chat.userChats);
  const loggedINUser = useSelector((state) => state.auth.loggedINUser);
  const dispatch = useDispatch();

  const setChat = (chat) => {
    dispatch(setSelectedChat(chat));
    dispatch(deleteNotification(chat))
  };

  useEffect(() => {
    dispatch(fetchUserChatsAsync());
  }, []);

  const fontSize = useBreakpointValue({
    base: "20px",
    sm: "24px",
    md: "28px",
    lg: "30px",
  });
  const buttonFontSize = useBreakpointValue({
    base: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
  });
  const buttonPaddingX = useBreakpointValue({ base: "2", sm: "4", md: "6" });
  const buttonPaddingY = useBreakpointValue({ base: "1", sm: "2", md: "3" });

  const headerBg = useColorModeValue("gray.100", "gray.700");
  const buttonColorScheme = "teal";

  return (
    <Box
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w="100%"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={2}
        px={2}
        
        fontSize={fontSize}
        fontFamily="Work Sans, sans-serif"
        w="100%"
        bg={headerBg}
        className="flex justify-between w-full  flex-row"
      >
        <Box 
      fontWeight={{ base: "normal", sm: "semibold", md: "bold" }}
      fontSize={{ base: "xl", sm: "xl", md: "2xl", lg: "4xl" }}
      className="pt-3"
    >
      My Chats
    </Box>
        <GroupChatModal>
          <Button
            fontSize={buttonFontSize}
            // px={buttonPaddingX}
            // py={buttonPaddingY}
            rightIcon={<AddIcon />}
            variant="solid"
            colorScheme={buttonColorScheme}
            display="flex"
            alignItems="center"
            justifyContent="center"
            minWidth={{ base: "100px", sm: "120px", md: "140px" }}
            mt={2}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        // h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {userChats ? (
          <Stack overflow="hidden" maxHeight="100vh" width="100%">
            {userChats.map((chat) => (
              <Box
                onClick={() => setChat(chat)}
                // cursor="pointer"
                // bg={
                //   selectedChat && selectedChat === chat ? "#38B2AC" : "#E8E8E8"
                // }
                // color={
                //   selectedChat && selectedChat === chat ? "white" : "black"
                // }
                // px={1}
                // pt={1}
                // borderRadius="lg"
                key={chat._id}
              >
                
                  <ChatItem
                    chat={chat}
                    currentUserId={loggedINUser._id}
                  />
               

              </Box>
            ))}
          </Stack>
        ) : (
          <LoadingSpinner />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
