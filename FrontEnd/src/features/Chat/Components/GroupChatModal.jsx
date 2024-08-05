/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagLabel,
  useDisclosure,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import UserListItem from "./UserListItem";
import { clearChatSearch, createGroupAsync, fetchSearchChatAsync } from "../ChatSlice";
import UserBatch from "./UserBatch";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState('');
  const [groupUsers, setGroupUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();


  const ChatSearchResult = useSelector((state) => state.chat.ChatSearchResult);
  const loggedINUser = useSelector((state) => state.chat.loggedINUser);

  const addInList = (user) => {
    if(groupUsers.includes(user)){
        toast({
            title: "User Already Selected",
            description: `"${user.name}" is already added in the list`,
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top" // Set position to top-left
          });
    }else{
        setGroupUsers([...groupUsers,user])
    }

  };
  const removeFromList = (user) => {
    setGroupUsers(groupUsers.filter(sel => sel._id!==user._id));
  };
  const handlerSearch = () => {
    setLoading(true);
    dispatch(fetchSearchChatAsync(search));
    setLoading(false);
  };

  const clearSearch = () => {
    dispatch(clearChatSearch());
    setSearch("");
  };

  const handleCreateGroup = ()=>{

    if(!groupName || !groupUsers){
        toast({
            title: "Please fill all the fields",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top" // Set position to top-left
          });
          return ;
    }
    
    const groupInfo = {
            users: groupUsers.map((user)=>user._id),
            name: groupName 
    }

    dispatch(createGroupAsync(groupInfo))
    onClose();
    setSearch('');
    setGroupUsers([]);
    setGroupName(null)
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="work-sans"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex text-center flex-col">
            <Box>
              <Box className="my-2 mx-1">
                <FormLabel htmlFor="group-name">Group Name</FormLabel>
                <Input
                  id="group-name"
                  placeholder="Enter Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </Box>
              <Box>
                <Wrap>
                  {groupUsers.map((user) => (
                    <UserBatch  key={user._id} user={user} handleFunc={()=>removeFromList(user)} />
                  ))}
                </Wrap>
              </Box>
              <Box>
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
                    colorScheme="green"
                    onClick={clearSearch}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
              <Box>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  ChatSearchResult?.slice(0,5).map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user} 
                      handleFunc={() => addInList(user)}
                    />
                  ))
                )}
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Button colorScheme="red" mr={1} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" mr={1} onClick={handleCreateGroup}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
