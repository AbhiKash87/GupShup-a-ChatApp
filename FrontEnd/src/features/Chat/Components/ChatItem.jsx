/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  IconButton,
  Text,
  HStack,
  VStack,
  useColorModeValue,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@chakra-ui/react";
import { MdDelete, MdGroup, MdPerson } from "react-icons/md"; // Example icons for group and single chat
import { useDisclosure } from "@chakra-ui/react"; // For modal handling
import { useDispatch, useSelector } from "react-redux";
import { deletGroupAsync } from "../ChatSlice";
// import { useSocket } from "../../../SocketContext";
import { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";

const ChatItem = ({ chat, currentUserId }) => {
  const isGroupChat = chat.isGroupChat;
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const hoverBgColor = useColorModeValue("blue.400", "teal.500");
  // const { socket } = useSocket();

  // Determine chat title and other user details
  const chatTitle = isGroupChat
    ? chat.chatName
    : chat.users.find((user) => user._id !== currentUserId)?.name;
  const otherUser = isGroupChat
    ? null
    : chat.users.find((user) => user._id !== currentUserId);

  const loggedINUser = useSelector((state) => state.auth.loggedINUser);

  // Determine latest message details
  const latestMessage = chat.latestMessage;
  const messageContent = latestMessage ? latestMessage.content : "";
  const isSenderCurrentUser = latestMessage?.sender?._id === currentUserId;
  const dispatch = useDispatch();
  const [updatechat, setUpdatechat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLeaveChat = async () => {
    const groupInfo = {
      chatId: chat._id,
      chatDelete: false,
    };

    dispatch(deletGroupAsync(groupInfo));

    onClose();
  };


  const handleDeleteChat = async () => {
    const groupInfo = {
      chatId: chat._id,
      chatDelete: true,
    };

    dispatch(deletGroupAsync(groupInfo));

    onClose();
  };

  return (
    <Box
      cursor="pointer"
      bg={bgColor}
      _hover={{ background: hoverBgColor, color: "white" }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={4}
      py={3}
      mb={2}
      borderRadius="lg"
      shadow="md"
      transition="background 0.3s, color 0.3s"
    >
      <HStack spacing={4} w="100%">
        <Avatar
          size="md"
          name={isGroupChat ? chatTitle : otherUser?.name}
          src={isGroupChat ? null : otherUser?.profilePic}
          bg={isGroupChat ? "transparent" : "gray.200"}
        >
          {isGroupChat ? <MdGroup size={24} /> : <MdPerson size={24} />}
        </Avatar>
        <VStack align="start" spacing={0} flex="1">
          <Text
            fontWeight="bold"
            fontSize={{ base: "md", md: "lg" }}
            isTruncated
            maxWidth="100%"
          >
            {chatTitle}
          </Text>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color={useColorModeValue("gray.600", "gray.300")}
            maxWidth="100%"
            isTruncated
          >
            {latestMessage ? (
              <>
                <Text as="b">
                  {isSenderCurrentUser
                    ? "Me"
                    : latestMessage.sender
                    ? latestMessage.sender.name
                    : "Deleted User"}
                  :
                  {messageContent.length <= 7
                    ? messageContent
                    : messageContent.substring(0, 7) + "..."}
                </Text>
              </>
            ) : (
              "No messages yet"
            )}
          </Text>
        </VStack>
        <IconButton
          aria-label="Delete Chat"
          icon={<MdDelete size={24} color="red.500" />}
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }} // Open confirmation modal on click
          className="hover:text-red-600 mr-3" // Tailwind CSS for hover effect (optional)
        />
      </HStack>

      {/* Confirmation modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalContent className="w-full max-w-md">
          <ModalHeader className="text-center text-lg font-semibold">
            Confirm Delete
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="text-center">
            {`Are you sure you want to ${
              chat.isGroupChat
                ? chat.groupAdmin._id === loggedINUser._id
                  ? "delete"
                  : "leave"
                : "delete"
            } the chat ${chatTitle}?`}
          </ModalBody>
          <ModalFooter className="flex justify-center gap-4">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>

            {chat.isGroupChat ? (
              chat.groupAdmin._id === loggedINUser._id ? (
                <div className="flex flex-row justify-between p-2">
                  <Button colorScheme="blue" onClick={handleDeleteChat} m={2}>
                    Delete(Admin)
                  </Button>

                  <Button colorScheme="red" onClick={handleLeaveChat} m={2}>
                    leave
                  </Button>
                </div>
              ) : (
                <Button colorScheme="red" onClick={handleLeaveChat}>
                  Leave
                </Button>
              )
            ) : (
              <Button colorScheme="red" onClick={handleLeaveChat}>
                Leave
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ChatItem;
