import { useEffect, useRef, useState } from "react";
import "./App.css";

import { io } from "socket.io-client";

function App() {
  const socket = useRef();
  // State for storing messages and current message
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  // Function to send a message
  const sendMessage = () => {
    if (currentMessage) {
      socket.current.emit("message", currentMessage);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.current = io(
      "ws://incredible-mabelle-abelananta-405d7d10.koyeb.app"
    );

    // ://localhost:9013
    // ://incredible-mabelle-abelananta-405d7d10.koyeb.app

    socket.current.on("connnection", () => {
      console.log("connected to server");
    });
  }, []);

  useEffect(() => {
    // Listen for incoming messages
    socket.current.on("message", (message) => {
      console.log(socket.current.id);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  return (
    <div className="App">
      <div className="chat-wrapper">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              className={`chatbox ${
                socket.current.id === message.user ? "current" : ""
              }`}
            >
              {socket.current.id !== message.user ? (
                <div className="username">{message.user}</div>
              ) : (
                ""
              )}
              <div key={index} className="message">
                {message.message}
              </div>
            </div>
          ))}
        </div>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Type a message..."
            value={currentMessage.message}
            onChange={(e) => setCurrentMessage(e.target.value)}
            required
            className="input-message"
          />
          <button className="btn-send" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
