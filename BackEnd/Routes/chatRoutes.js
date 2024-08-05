const express = require("express");

const { accessChat, fetchAllChats, createGroup, renameGroup, addToGroup, removeFromGroup, groupDelete } = require("../Controllers/chatController");

const chatRouter = express.Router();



chatRouter.post("/", accessChat);
chatRouter.get("/", fetchAllChats);
chatRouter.post("/group", createGroup);
chatRouter.put("/group/rename", renameGroup);
chatRouter.put("/group/add", addToGroup);
chatRouter.put("/group/remove", removeFromGroup);
chatRouter.put("/group/delete", groupDelete);





module.exports = chatRouter;
