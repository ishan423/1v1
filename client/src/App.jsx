import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
const App = () => {
  const initSocket = async () => {
    const options = {
      "force new connection": true,
      reconnectionAttempt: "Infinity",
      timeout: 10000,
      transports: ["websocket"],
    };
    return io("http://localhost:3000", options);
  };

  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        withCredentials: true,
        "force new connection": true,
        reconnectionAttempt: "Infinity",
        timeout: 10000,
        transports: ["websocket"],
      }),
    []
  );

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");
  const socketRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // socket.emit("message",  message);
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    console.log("called");
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    const init = async () => {
      console.log("helllo");
      
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => console.log(err));
      socketRef.current.on('connect_failed', (err) => console.log(err));

      console.log("socketRef", socketRef.current);

      socketRef.current.on( "connect", () => {
        setSocketId(socketRef.current.id);
        console.log("connected", socket.id);
      });
    };

    init();

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    // changes
    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 500 }} />
      <Typography variant="h6" component="div" gutterBottom>
        {socketID}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          id="submit_button_room"
          onClick={() => joinRoomHandler}
        >
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
