/* eslint-disable react/prop-types */
import { Avatar, Box, Text, HStack, VStack, useColorModeValue } from "@chakra-ui/react";
// import { OnlineStatus } // Import custom OnlineStatus component (explained below)

const UserListItem = ({ user, handleFunc }) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700'); // Dynamic background color
  const hoverBgColor = useColorModeValue('blue.400', 'teal.500'); // Dynamic hover background color

  return (
    <Box
      onClick={() => handleFunc(user._id)}
      cursor="pointer"
      bg={bgColor}
      _hover={{ background: hoverBgColor, color: 'white' }}
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
        {/* <OnlineStatus userId={user._id} /> Display online status */}
        <Avatar size="md" name={user && user.name} src={user && user.pic} />
        <VStack align="start" spacing={0} flex="1">
          <Text fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }} isTruncated maxWidth="100%">
            {user && user.name}
          </Text>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color={useColorModeValue('gray.600', 'gray.300')}
            maxWidth="100%"
            isTruncated
          >
            <b>Email:</b> {user && (user.email.length <= 11
                    ? user.email
                    : user.email.substring(0, 11) + "...")}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default UserListItem;
