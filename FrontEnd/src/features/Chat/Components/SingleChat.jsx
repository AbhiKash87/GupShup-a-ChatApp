/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSender } from "../../ChatLogics/ChatLogic";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon, InfoIcon } from "@chakra-ui/icons";
import {
  addNotification,
  fetchAllMsgByChatIdAsync,
  fetchUserChatsAsync,
  sendMessageAsync,
  setSelectedChat,
  updateMessage,
  // updateSocket,
} from "../ChatSlice";
import ProfileModel from "./ProfileModal";
import GroupUpdateModal from "./GroupUpdateModal";
import { LoadingSpinner } from "./LoadingSpinner";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import TypingIndicator from "./TypingIndicator";
// import { useSocket } from "../../../SocketContext";
const ENDPOINT = "https://gupshup-e5ii.onrender.com";

// const ENDPOINT = "http://localhost:5000";
let socket;
let selectedChatCompare;

const SingleChat = () => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const updateChatUsers = useSelector((state) => state.chat.updateChatUsers);
  const loggedINUser = useSelector((state) => state.auth.loggedINUser);
  const [loading, setLoading] = useState(false);
  const [msgToBeSend, setMsgToBeSend] = useState("");
  const selectedChatMessages = useSelector(
    (state) => state.chat.selectedChatMessages
  );
  const Notifications = useSelector((state) => state.chat.Notifications);
  const dispatch = useDispatch();
  const [socketConnected, setSocketConnected] = useState(false);
  const newMessage = useSelector((state) => state.chat.newMessage);
  const [typing, setTyping] = useState(false);
  const [istyping, setisTyping] = useState(false);
  // const { setSocket } = useSocket();

  useEffect(() => {
    socket = io(ENDPOINT);
    // console.log("Socket connection established.");
    socket.emit("setup", loggedINUser);
    socket.on("connected", () => {
      
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setisTyping(true);
    });
    socket.on("stop typing", () => {
      setisTyping(false);
    });

    socket.on("updateChat", () => {
      
      dispatch(fetchUserChatsAsync());
    });

    //socket handler for msg recieved
    const messageHandler = (newMessageReceived) => {
      
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        dispatch(addNotification(newMessageReceived));
      } else {
        dispatch(updateMessage(newMessageReceived));
      }
      dispatch(fetchUserChatsAsync());
    };
    socket.on("message received", messageHandler);

    return () => {
      socket.off("message received", messageHandler);
      // console.log("socket.disconnect()");
      socket.disconnect();  
    };
  }, [loggedINUser]);

  useEffect(() => {
    if (updateChatUsers) {
      socket.emit("updateChat", updateChatUsers);
    }
  }, [updateChatUsers]);

  useEffect(() => {
    if (selectedChat) {
      setLoading(true);
      dispatch(fetchAllMsgByChatIdAsync(selectedChat._id)).finally(() =>
        setLoading(false)
      );
      socket.emit("join chat", selectedChat._id);
      selectedChatCompare = selectedChat;
    }
  }, [selectedChat, dispatch]);

  useEffect(() => {
    if (newMessage) {
      // console.log("Emitting new message:", newMessage);
      socket.emit("new message", newMessage);
    }
  }, [newMessage]);

  const OnKeyDownHandler = async (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  const sendMessage = async () => {
    const msgInfo = {
      content: msgToBeSend,
      chatId: selectedChat._id,
    };

    dispatch(sendMessageAsync(msgInfo));
    setMsgToBeSend("");
    socket.emit("stop typing", selectedChat._id);
    setTyping(false);
  };

  const typingHandler = (e) => {
    setMsgToBeSend(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let currTime = new Date().getTime();
      let diff = (currTime = lastTypingTime);

      if (typing && diff > timerLength) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const setChat = (chat) => {
    dispatch(setSelectedChat(chat));
  };

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col justify-between h-full">
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            py={2}
            w="100%"
            className="font-sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <div className="flex flex-row justify-between">
              <IconButton
                icon={<ArrowBackIcon />}
                onClick={() => {
                  setChat(null);
                  selectedChatCompare = null;
                }}
              />
              {selectedChat.isGroupChat
                ? selectedChat.chatName.toUpperCase()
                : getSender(
                    loggedINUser,
                    selectedChat.users
                  ).name.toUpperCase()}

              {selectedChat.isGroupChat ? (
                <GroupUpdateModal key={selectedChat._id}></GroupUpdateModal>
              ) : (
                <ProfileModel
                  user={getSender(loggedINUser, selectedChat.users)}
                >
                  <IconButton icon={<InfoIcon />} />
                </ProfileModel>
              )}
            </div>
          </Box>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                overflowY: "scroll",
                scrollbarWidth: "none", // For Firefox
                msOverflowStyle: "none", // For Internet Explorer and Edge
              }}
              className="h-full p-2 border-2 border-gray-500  rounded-md"
            >
              <ScrollableChat messages={selectedChatMessages} />
              {istyping && <TypingIndicator />}
            </div>
          )}

          <FormControl onKeyDown={OnKeyDownHandler} isRequired mt={3}>
            <InputGroup>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter Message"
                value={msgToBeSend}
                onChange={typingHandler}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Send Message"
                  icon={<ArrowForwardIcon boxSize={6} />}
                  onClick={sendMessage}
                  colorScheme="blue"
                  bg="blue.500"
                  _hover={{ bg: "blue.600" }}
                  _active={{ bg: "blue.700" }}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </div>
      ) : (
        <Box className="flex justify-center items-center h-full bg-gray-300 p-20">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a User or Group to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
