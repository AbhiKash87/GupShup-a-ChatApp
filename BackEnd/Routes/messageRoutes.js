const express = require("express");
const { sendMessage, getAllMessageFromChat } = require("../Controllers/messageController");

const messageRouter = express.Router();



messageRouter.post("/", sendMessage);
messageRouter.get("/:chatId",getAllMessageFromChat);




module.exports = messageRouter;
