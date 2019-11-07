import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost");
//
const App = () => {
  const [me, setMe] = useState(null);
  const [chats, setChats] = useState([]);
  const [msgInput, setMsgInput] = useState("");

  const sendClickHandler = () => {
    const msg = msgInput;
    socket.emit("new-chat-from-client", { msg });
  };

  useEffect(() => {
    socket.on("init", data => {
      setMe({
        name: data.name,
        socketId: data.socketId
      });
    });
  }, []);

  useEffect(() => {
    socket.on("new-chat-from-server", data => {
      const chat = data;
      const nextChats = [...chats];
      nextChats.push(chat);
      setChats(nextChats);
    });
  }, [chats]);

  return (
    <div>
      <div className="chat-container">
        {chats.map((chat, i) => {
          const isMe = chat.socketId === me.socketId;
          return (
            <div key={i} className={`chat ${isMe ? "me" : ""}`}>
              <div className="name">{chat.name}</div>
              <div className="msg">{chat.msg}</div>
            </div>
          );
        })}
      </div>
      <input
        value={msgInput}
        onChange={e => {
          setMsgInput(e.currentTarget.value);
        }}
      />
      <button onClick={sendClickHandler}>send</button>
    </div>
  );
};

export default App;
