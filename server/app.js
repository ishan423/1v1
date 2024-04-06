import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const secretKeyJWT = "asdasdsadasdasdasdsa";
const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    // methods:"*",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "asdasjdhkasdasdas" }, secretKeyJWT);

  res
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json({
      message: "Login Success",
    });
});

// io.use((socket, next) => {
//   cookieParser()(socket.request, socket.request.res, (err) => {
//     if (err) return next(err);

//     const token = socket.request.cookies.token;
//     if (!token) return next(new Error("Authentication Error"));

//     const decoded = jwt.verify(token, secretKeyJWT);
//     next();
//     // try {
//     // } catch (error) {
//     //   next(new Error("Authentication Error"));
//     // }
//   });
// });

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);


  // added
  // socket.emit("welcome",`welcome to server`);
  // socket.broadcast.emit("welcome",`${socket.id} joined to server`);


  // ({room,message})=>(data)
  socket.on("message", ({room,message}) => {
    console.log({room,message});
    // Send the message to all users in the room
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    console.log("User joined room", room);
    // Join the specified room
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
