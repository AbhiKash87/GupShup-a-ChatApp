/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAync } from "../AuthSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [uplading, setUploading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch()
  const loggedINUserToken = useSelector((state)=>state.auth.loggedINUserToken);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setUploading(true);

    try {

      dispatch(loginUserAync(data))
      toast({
        title: "Login Successful!",
        description: "You have been logged in successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setUploading(false);
  };


  const fillGuestCredentials = () => {
    setValue("email", "guest@gmail.com");
    setValue("password", "123456");
  };
  const password = watch("password");

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={6}>
      <FormControl isInvalid={!!errors.email} mb={4}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email address",
            },
          })}
        />
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.password} mb={4} position="relative">
        <FormLabel htmlFor="password">Password</FormLabel>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          {...register("password", {
            required: "Password is required",
            minLength: 6,
          })}
        />
        <Box
          position="absolute"
          right="0"
          top="50%"
          transform="translateY(-50%)"
          pr={5}
          pt={7}
          cursor="pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <AiFillEyeInvisible size={20} />
          ) : (
            <AiFillEye size={20} />
          )}
        </Box>
        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
      </FormControl>

      <Button
        type="submit"
        colorScheme="teal"
        size="lg"
        width="full"
        mt={4}
        isLoading={uplading}
      >
        Log In
      </Button>
      <Button
        onClick={fillGuestCredentials}
        colorScheme="red"
        size="lg"
        width="full"
        mt={4}
      >
        Get Guest User Credential
      </Button>
    </Box>
  );
};

export default Login;
