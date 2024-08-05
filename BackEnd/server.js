const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connectDb = require("./Config/mongoDb");
const colors = require("colors");
var cors = require("cors");
const authRouter = require("./Routes/authRoutes");
const userRouter = require("./Routes/userRoutes");
const { errorHandler, notFound } = require("./middlewares/errormiddleware");
const authenticateToken = require("./middlewares/authenticateToken");
const chatRouter = require("./Routes/chatRoutes");
const messageRouter = require("./Routes/messageRoutes");
const path = require('path');
dotenv.config();

connectDb();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", authenticateToken, userRouter);
app.use("/chats", authenticateToken, chatRouter);
app.use("/message", authenticateToken, messageRouter);


// -----------------------Deployment--------------------------


if(process.env.NODE_ENV ==='production'){
  const __dirname1 = path.resolve();
  app.use(express.static(path.join(__dirname,'/FrontEnd/dist')))
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname1,"FrontEnd","dist","index.html"));
  })
}else{
  app.get("/", (req, res) => {
    res.json({ message: "Api has started running" }).status(200);
  });
}


// -----------------------Deployment--------------------------
app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`.cyan);
});

const io = require("socket.io")(server, {
  pingTimeout: 6000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("User ID joined:", userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });


  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });


  socket.on("updateChat", (chat) => {
    // console.log("updateChat signal recived",chat);

    if (chat && !chat.users) return console.log("chat.users not defined");

    chat.users && chat.users.forEach((user) => {
          //  console.log(user._id);
           socket.in(user._id).emit("updateChat");
    });

  });


  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (chat && !chat.users) return console.log("chat.users not defined");

    chat.users && chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });


});
