/* eslint-disable no-unused-vars */
import React from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';

export const LoadingSpinner = () => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="200px"
    >
      <Spinner 
        size="xl" 
        thickness="4px" 
        speed="0.65s" 
        color="blue.500" 
      />
      <Text mt={4} fontSize="lg" color="gray.600">Loading...</Text>
    </Box>
  );
};


