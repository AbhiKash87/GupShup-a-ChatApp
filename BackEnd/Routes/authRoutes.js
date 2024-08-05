const express = require("express");
const { registerUser, logInUser } = require("../Controllers/authController");

const authRouter = express.Router();



authRouter.post("/signUpUser", registerUser);
authRouter.post("/loginUser",logInUser );




module.exports = authRouter;
