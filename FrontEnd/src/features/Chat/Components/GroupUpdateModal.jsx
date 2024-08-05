/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { EmailIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserListItem from "./UserListItem";
import { LoadingSpinner } from "./LoadingSpinner";
import UserBatch from "./UserBatch";
import {
  AddUserInGroupAsync,
  clearChatSearch,
  fetchSearchChatAsync,
  fetchUserChatsAsync,
  groupRenameAsync,
  removeUserFromGroupAsync,
} from "../ChatSlice";

import { deletGroupAsync } from "../ChatSlice";

const GroupUpdateModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState();
  const [groupUsers, setGroupUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();

  const ChatSearchResult = useSelector((state) => state.chat.ChatSearchResult);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const loggedINUser = useSelector((state) => state.auth.loggedINUser);
  

  useEffect(() => {
    setGroupName(selectedChat.chatName);
    setGroupUsers(selectedChat.users);
  }, [selectedChat]);





  const handlerSearch = () => {
    setLoading(true);
    dispatch(fetchSearchChatAsync(search));
    setLoading(false);
  };

  const clearSearch = () => {
    dispatch(clearChatSearch());
    setSearch("");
  };

  const handleRename = () => {
    const updatedInfo = {
      groupId: selectedChat._id,
      newGroupName: groupName,
    };
    dispatch(groupRenameAsync(updatedInfo));
    toast({
      title: "Group Name Updated",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top", // Set position to top-left
    });

    clearSearch();
    onClose();
  };

  const handleAddUser = (user) => {
    const userExists = groupUsers.some(u => u._id === user._id);
    if(userExists){
        toast({
            title: "User is already added in the group",
            description: `"${user.name}" is member of group "${groupName}"`,
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top" // Set position to top-left
          });
    }else{

      const addUserInfo = {
        groupId: selectedChat._id,
        userId: user._id,
      };

      dispatch(AddUserInGroupAsync(addUserInfo));
      toast({
        title: `${user.name} Addedd in the Group`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top", // Set position to top-left
      });
    }
    clearSearch();
  };


  const handleRemoveFromGroup = (user) => {

    if(loggedINUser._id !== selectedChat.groupAdmin._id){
        toast({
            title: `You are not Admin of this group`,
            description: "Only admin can remove a member",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top", // Set position to top-left
          });
    }else{
      
        const removeUserInfo = {
            groupId: selectedChat._id,
            userId: user._id,
          };
      
          dispatch(removeUserFromGroupAsync(removeUserInfo));
      
          toast({
            title: `${user.name} removed from the Group`,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top", // Set position to top-left
          });
      
    }
    
  };

 
    const handleLeaveChat = async () => {
      const groupInfo = {
        chatId: selectedChat._id,
        chatDelete: false,
      };
  
      dispatch(deletGroupAsync(groupInfo));
      
      toast({
        title: `You left the group`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top", // Set position to top-left
      });
      onClose();
    };

  return (
    <>
      <IconButton
        icon={<ViewIcon />}
        onClick={onOpen}
        className="flex justify-start"
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="work-sans"
            d="flex"
            justifyContent="center"
          >
            Update Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex text-center flex-col">
            <Box>
              <Box className="my-2 mx-1">
                <FormLabel htmlFor="group-name">Group Name</FormLabel>
                <Box className="flex flex-row">
                  <Input
                    id="group-name"
                    placeholder="Enter Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  <Button
                    className="mx-2"
                    colorScheme="green"
                    onClick={handleRename}
                  >
                    Rename
                  </Button>
                </Box>
              </Box>
              <Box>
                <Wrap>
                  {groupUsers.map((user) => (
                    <UserBatch
                      key={user._id}
                      user={user}
                      handleFunc={() => handleRemoveFromGroup(user)}
                    />
                  ))}
                </Wrap>
              </Box>
              
              {(loggedINUser._id === selectedChat.groupAdmin._id)?(<Box>
                <FormLabel htmlFor="group-users">Add Users</FormLabel>
                <Box className="my-2 mx-1 flex flex-row">
                  <Input
                    id="group-users"
                    placeholder="Search By Name Or Email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button
                    className="mx-2"
                    colorScheme="green"
                    onClick={handlerSearch}
                  >
                    Search
                  </Button>
                  <Button
                    className="mx-2"
                    colorScheme="blue"
                    onClick={clearSearch}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>):(<div className=" flex justify-start text-gray-600 font-bold">Only Admin Can Add Users</div>)}


              <Box>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  ChatSearchResult?.slice(0, 5).map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunc={() => handleAddUser(user)}
                    />
                  ))
                )}
              </Box>
            </Box>
          </ModalBody>


          <ModalFooter className="flex flex-row">
            <Box className=" w-full">
              <Button colorScheme="red" mr={1} onClick={handleLeaveChat}>
                Leave Group
              </Button>
            </Box>
            <Box className=" w-full flex justify-end">
              <Button colorScheme="blue" mr={1} onClick={onClose}>
                Cancel
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupUpdateModal;
