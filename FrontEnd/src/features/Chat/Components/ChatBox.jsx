/* eslint-disable no-unused-vars */
import { Box } from '@chakra-ui/react'
import React from 'react'
import SingleChat from './SingleChat'


const ChatBox = () => {


  return (
    <Box
    flexDir="column"
    alignItems="center"
    p={2}
    bg="white"
    w="100%"
    borderRadius="lg"
    borderWidth="1px"
    className='overflow-hidden'
  >
    <SingleChat/>
     
    </Box>
  )
}

export default ChatBox