const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");
const socket = require("socket.io");
const app = express();
require("dotenv").config();
const path = require("path");


app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/messages", messagesRoute);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err.message));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

const server = app.listen(process.env.PORT || 5000, () =>
  console.log(`Server is running on port: ${process.env.PORT}`)
);

const io = socket(
  server
  //   {
  //   cors: {
  //     origin: "http://localhost:3000",
  //     credentials: true,
  //   },
  // }
);

const OnlineUsers = new Map();

io.on("connection", (socket) => {
  let UserID;
  global.chatSocket = socket;
  socket.on("add-user", (userID) => {
    UserID = userID;
    OnlineUsers.set(userID, socket.id);
  });
  socket.on("disconnect", () => {
    OnlineUsers.delete(UserID);
  });

  socket.on("send-message", async (msg) => {
    const { to } = msg;

    if (to.startsWith("c:"))
      return socket.broadcast.emit("receive-message", msg);

    const toSocketID = OnlineUsers.get(to);
    if (toSocketID) return socket.to(toSocketID).emit("receive-message", msg);
  });
});
