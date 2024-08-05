/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { ViewIcon, EmailIcon,  } from '@chakra-ui/icons';
import {
    Avatar,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import 'tailwindcss/tailwind.css';

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton icon={<ViewIcon />} onClick={onOpen} className="flex justify-start" />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="rounded-lg shadow-lg">
          <ModalHeader className="flex flex-col items-center bg-blue-500 p-4">
          <Avatar size='2xl' cursor='pointer' name={user.name} src={user.profilePi}></Avatar>
            <h2 className="text-2xl font-bold text-white mt-4">{user.name}</h2>
          </ModalHeader>
          <ModalCloseButton className="text-white" />
          <ModalBody className="flex flex-col items-center p-4 bg-gray-100">
            <div className="flex items-center mb-4 text-blue-600">
              
              <p className="text-md text-gray-700">Name: {user.name}</p>
            </div>
            <div className="flex items-center text-blue-600">
              <EmailIcon className="mr-2" />
              <p className="text-md text-gray-700">Email: {user.email}</p>
            </div>
          </ModalBody>
          <ModalFooter className="bg-gray-100">
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
