/* eslint-disable no-unused-vars */
import {
  Avatar,
  Box,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import ProfileModel from "./ProfileModal";
import { signOutAsync } from "../../Auth/AuthSlice";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import {
  accessChatAsync,
  clearChatSearch,
  deleteNotification,
  fetchSearchChatAsync,
  setSelectedChat,
} from "../ChatSlice";
import LoadingSpinner from "../../../Component/LoadingSpinner";
import UserListItem from "./UserListItem";
import { FaBell } from "react-icons/fa";

const Sidedrawer = () => {
  const loggedINUser = useSelector((state) => state.auth.loggedINUser);
  const ChatSearchResult = useSelector((state) => state.chat.ChatSearchResult);
  const Notifications = useSelector((state) => state.chat.Notifications);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const [search, setSearch] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const LogOutHandler = () => {
    dispatch(signOutAsync());
  };
  const handleSearch = () => {
    if (!search.trim()) {
      toast({
        title: "Search box is empty",
        description: "Please enter a name or email.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left", // Set position to top-left
      });
    } else {
      setLoading(true);
      dispatch(fetchSearchChatAsync(search));

      setLoading(false);
    }
  };

  const handleUser = (userId) => {
    // console.log(userId);
    dispatch(accessChatAsync(userId));
    dispatch(clearChatSearch());
    setSearch("");
    onClose();
  };

  const clearSearch = () => {
    dispatch(clearChatSearch());
    setSearch("");
  };

  
  const notificationHandler = (ntf)=>{
    if(ntf.chat.isGroupChat){
      dispatch(setSelectedChat(ntf.chat));
    }else{
      dispatch(accessChatAsync(ntf.sender._id));
    }
    dispatch(deleteNotification(ntf.chat))
  }

  const textColor = useColorModeValue('blue.600', 'blue.300');
  return (
    <>
      <Box className="flex justify-between text-center bg-white w-full px-1 py-2 border-[5px] ">
        <Tooltip label="search users to chat" hasArrow placement="bottom-end" >
          <Button variant="ghost" ref={btnRef} onClick={onOpen} className="bg-gray-300">
            <FontAwesomeIcon icon={faSearch} />
            <Text className="px-2 sm:none md:flex ">Search User</Text>
          </Button>
        </Tooltip>

        <Box d="flex" justifyContent="start" >
        <Text
        fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
        fontWeight="bold"
        letterSpacing="wider"
        color={textColor}
        textShadow="1px 1px 2px rgba(0, 0, 0, 0.1)"
      >
        Gup-Shup
      </Text>
    </Box>

        <div className="flex space-x-4 "> {/* Adds space between the menus */}
      <Menu>
        <MenuButton as={Button} className="relative "  >
          <FaBell className="text-xl m-1 " />
          {Notifications.length > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center z-10">
              {Notifications.length}
            </span>
          )}
        </MenuButton>
        <MenuList>
          {Notifications.length === 0 ? (
            <MenuItem>No new messages</MenuItem>
          ) : (
            Notifications.map((ntf) => (
              <MenuItem key={ntf._id} onClick={()=>{
                notificationHandler(ntf);
              }}> 
                {`New message `}
                {ntf.chat.isGroupChat ? `in ${ntf.chat.chatName.toUpperCase()} ` : ""}
                {` from ${ntf.sender.name.toUpperCase()}`}
              </MenuItem>
            ))
          )}
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton as={Button}>
          <Avatar
            size="sm"
            cursor="pointer"
            name={loggedINUser.name}
            src={loggedINUser.pic}
          />
        </MenuButton>
        <MenuList>
          <ProfileModel user={loggedINUser}>
            <MenuItem>My Profile</MenuItem>
          </ProfileModel>
          <MenuDivider />
          <MenuItem onClick={LogOutHandler}>Log Out</MenuItem>
        </MenuList>
      </Menu>
    </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader className="border-b-2">Search Users</DrawerHeader>

          <DrawerBody>
            <Box className="flex pb-2 p-2">
              <Input
                placeholder="Search By Name Or Email"
                className="my-2 mx-1"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                className="my-2 mx-1"
                colorScheme="green"
                onClick={handleSearch}
              >
                Go
              </Button>
            </Box>

            <Box>
              {loading ? (
                <LoadingSpinner />
              ) : (
                ChatSearchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunc={handleUser}
                  />
                ))
              )}
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme="blue" onClick={clearSearch}>
              Clear Search
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidedrawer;
