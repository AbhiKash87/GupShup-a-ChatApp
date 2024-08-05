const express = require("express");
const { registerUser, logInUser, getAllUser, getUser, } = require("../Controllers/userController");

const userRouter = express.Router();





userRouter.get("/",getAllUser );
userRouter.get("/own",getUser );




module.exports = userRouter;
