const User = require("../Models/userModel");
const Message = require("../Models/messageModel");
const chatModel = require("../Models/chatModel");

const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      // console.log("Invalid data passed into request");
      return res.status(400).json({
        error:
          "Invalid data passed into request. Content and chatId are required.",
      });
    }

    const messageData = {
      sender: req.user._id,
      content: content, 
      chat: chatId,
    };
    const newMessage = new Message(messageData);
    let savedMessage = await newMessage.save();

    await chatModel.findByIdAndUpdate(
      chatId, 
      { latestMessage: savedMessage },
      { new: true }
    );

    savedMessage = await savedMessage.populate("sender", "name profilePic");
    savedMessage = await savedMessage.populate("chat");
    savedMessage = await User.populate(savedMessage, {
      path: "chat.users",
      select: "name profilePic email",
    });

    

    return res.status(201).json(savedMessage);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllMessageFromChat = async (req, res) => {
  try {
    const chatId = await req.params.chatId;
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name profilePic")
      .populate("chat");

    return res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { sendMessage, getAllMessageFromChat };
