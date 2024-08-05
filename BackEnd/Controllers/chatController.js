const { default: mongoose } = require("mongoose");
const Chat = require("../Models/chatModel");
const messageModel = require("../Models/messageModel");
const User = require("../Models/userModel");

const accessChat = async (req, res) => {
  const { userId } = req.body;

  // console.log("req.user.id:",req.user._id)
  // console.log("userId",userId)
  if (!userId) {
    console.log("userId param not send with request");
    return res
      .json({ message: "userId param not send with request" })
      .status(400);
  }

  let isChat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  })
    .select("-createdAt -updatedAt")
    .populate("users", "id name email profilePic")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email pic",
  });

  // console.log("this chat is accessed: ",isChat._id);

  if (isChat) {
    res.json(isChat).status(200);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [userId, req.user._id],
    };

    try {
      const newChat = await new Chat(chatData);
      let savedChat = await newChat.save();
      savedChat = await Chat.findById(savedChat._id)
        .select("-createdAt -updatedAt")
        .populate("users", "id name email profilePic");
      res.json(savedChat).status(200);
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  }
};

const fetchAllChats = async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "name email pic profilePic")
      .populate("groupAdmin", "name email profilePic")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email profilePic",
    });

    res.json(chats).status(200);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};

const createGroup = async (req, res) => {
  // console.log(req.body);
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please Fill all the fields" });
  }

  let users = req.body.users;

  users.push(req.user);

  try {
    const chatData = {
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    };

    const newChat = await new Chat(chatData);
    let savedChat = await newChat.save();
    savedChat = await Chat.findById(savedChat._id)
      .populate("users", "id name email profilePic")
      .populate("groupAdmin", "id name email profilePic");
    res.json(savedChat).status(200);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};

const renameGroup = async (req, res) => {
  try {
    const { groupId, newGroupName } = req.body;

    let updatedChat = await Chat.findByIdAndUpdate(
      groupId,
      {
        chatName: newGroupName,
      },
      {
        new: true,
      }
    )
      .select("-createdAt -updatedAt")
      .populate("users", "id name email profilePic")
      .populate("groupAdmin", "id name email profilePic")
      .populate("latestMessage");

      updatedChat = await User.populate(updatedChat, {
        path: "latestMessage.sender",
        select: "name email profilePic",
      });

    res.json(updatedChat).status(200);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};

const addToGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    let updatedChat = await Chat.findByIdAndUpdate(
      groupId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .select("-createdAt -updatedAt")
      .populate("users", "id name email profilePic")
      .populate("groupAdmin", "id name email profilePic")
      .populate("latestMessage");

      updatedChat = await User.populate(updatedChat, {
        path: "latestMessage.sender",
        select: "name email profilePic",
      });

    if (!updatedChat) {
      res.json({ message: "group not found" }).status(400);
    }
    res.json(updatedChat).status(200);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};

const removeFromGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    let updatedChat = await Chat.findByIdAndUpdate(
      groupId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .select("-createdAt -updatedAt")
      .populate("users", "id name email profilePic")
      .populate("groupAdmin", "id name email profilePic")
      .populate("latestMessage");

      updatedChat = await User.populate(updatedChat, {
        path: "latestMessage.sender",
        select: "name email profilePic",
      });

    if (!updatedChat) {
      res.json({ message: "group not found" }).status(400);
    }
    res.json(updatedChat).status(200);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};

const groupDelete = async (req, res) => {
  try {
    const { chatId, chatDelete } = req.body;

    if (!chatId) {
      return res.status(400).json({ message: "chatId missing" });
    }

    const requestedUser = req.user;

    let chatisDeleted = false;

    const chat = await Chat.findById(chatId)
      .populate("users", "name email")
      .populate("groupAdmin", "name email");
   
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.isGroupChat) {
      if (chat.groupAdmin._id.equals(requestedUser._id)) {
        if (chatDelete || chat.users.length === 1) {
          await Chat.findByIdAndDelete(chatId);
          chatisDeleted = true;
        } else {
          await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { users: requestedUser._id } },
            { new: true }
          );

          if (chat.users.length > 1) {
            await Chat.findByIdAndUpdate(
              chatId,
              { groupAdmin: chat.users[0] },
              { new: true }
            );
          }
        }
      } else {
        await Chat.findByIdAndUpdate(
          chatId,
          { $pull: { users: requestedUser._id } },
          { new: true }
        );
      }
    } else {
      await Chat.findByIdAndDelete(chatId);
      chatisDeleted = true;
    }


    console.log("chatisDeleted",chatisDeleted);

    if(chatisDeleted){

      if (!mongoose.Types.ObjectId.isValid(chat._id)) {
        throw new Error("Invalid chat ID");
      }
      
      const result = await messageModel.deleteMany({ chat: chat._id });
  
      if (result.deletedCount === 0) {
        console.log("No messages found for the given chat ID.");
      } else {
        console.log(`${result.deletedCount} messages were deleted.`);
      }
    }



    return res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(400);
    return res.json({ message: err.message });
  }
};


module.exports = {
  accessChat,
  fetchAllChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
  groupDelete,
};
