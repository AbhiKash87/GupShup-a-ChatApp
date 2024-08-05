/* eslint-disable no-unused-vars */
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React from "react";
import Login from "../features/Auth/Component/Login";
import SignUp from "../features/Auth/Component/SignUp";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const HomePage = () => {
  const loggedINUser = useSelector((state) => state.auth.loggedINUser);

  if (loggedINUser) {
    return <Navigate to="/chat"></Navigate>;
  } else {
    return (
      <Container maxW="xl" centerContent>
        <Box className="justify-center flex p-3 bg-white w-full mt-10 mx-10 border-2 rounded-lg">
          <Text className="text-2xl font-semibold font-serif">Gup-Shup</Text>
        </Box>
        <Box
          className={` p-1 bg-white w-full m-5 border-[2px]} rounded-lg`}
          color={"black"}
        >
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab className="w-[50%]">Log In</Tab>
              <Tab className="w-[50%]">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    );
  }
};

export default HomePage;
