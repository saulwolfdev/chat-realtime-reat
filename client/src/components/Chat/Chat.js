import React, { useState, useEffect } from "react";
import querystring from "query-string";
import io from "socket.io-client";

import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

import "./Chat.scss"; 

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

// const ENDPOINT = "localhost:5000";
const ENDPOINT = "https://project-chat-application.herokuapp.com/";
  
  useEffect(() => {
    const { name, room } = querystring.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, (error) => {
          if (error) {
            alert("ERROR CHAT",error);
          }
    });

  }, [ENDPOINT, location.search]);
  
useEffect(() => {
  socket.on("message", (message) => {
    setMessages((messages) => [...messages, message]);
  });

  socket.on("roomData", ({ users }) => {
    setUsers(users);
  });
}, []);

  
  const sendMessage = (event) => {
    event.preventDefault();
    
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };
  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name}/>
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
