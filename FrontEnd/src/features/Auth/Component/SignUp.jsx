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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUpAsync } from "../AuthSlice";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [profilepic, setProfilepic] = useState(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const navigate = useNavigate();
   const [uplading, setUploading] = useState(false);
   const toast = useToast();
   const dispatch = useDispatch();
   const loggedINUserToken = useSelector((state)=>state.auth.loggedINUserToken);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {

    setUploading(true);
    const { confirmPassword, pic, ...rest } = data;
    const updatedObject = {
      ...rest,
      profilePic: profilepic,
    };


    try {    
      dispatch(signUpAsync(updatedObject))
      toast({
        title: "Registration Successful!",
        description: "Your account has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setUploading(false);
    } catch (err) {
      console.error("Error:", err);
      alert("Error submitting the form. Please try again.");
    }
  };


  const imageHandler = async (pic) => {
    setUploading(true);

    if (!pic) {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setUploading(false);
      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const formData = new FormData();
      formData.append("file", pic);
      formData.append("upload_preset", "gupshup");
      formData.append("cloud_name", "doeu1yrmo");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/doeu1yrmo/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        setProfilepic(data.url);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    } else {
      toast({
        title: "Invalid file type. Please upload a JPEG or PNG image.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setUploading(false);
    }
  };


  const password = watch("password");

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={6}>
      <FormControl isInvalid={!!errors.name} mb={4}>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          {...register("name", { required: "Name is required" })}
        />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

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

      <FormControl
        isInvalid={!!errors.confirmPassword}
        mb={4}
        position="relative"
      >
        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
        <Input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
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
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? (
            <AiFillEyeInvisible size={20} />
          ) : (
            <AiFillEye size={20} />
          )}
        </Box>
        <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel htmlFor="pic">Profile Picture (Optional)</FormLabel>
        <Input
          id="pic"
          type="file"
          accept="image/*"
          onChange={(e) => imageHandler(e.target.files[0])}
        />
      </FormControl>

      <Button
        type="submit"
        colorScheme="teal"
        size="lg"
        width="full"
        mt={4}
        isLoading={uplading}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default SignUp;
