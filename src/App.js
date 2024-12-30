import { useEffect, useRef, useState } from "react";
import "./App.css";

import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";

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
      "wss://incredible-mabelle-abelananta-405d7d10.koyeb.app",
      {
        withCredentials: true,
      }
    );

    // ://localhost:9013
    // ://incredible-mabelle-abelananta-405d7d10.koyeb.app

    socket.current.on("connect", () => {
      console.log("connected to server");
    });

    return () => {
      socket.current.disconnect(); // Clean up the connection on component unmount
    };
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
        <div className="chatbox">
          <div className="chatbox-header">
            <div className="title">Realtime Chat - SocketIO</div>
          </div>
          <div className="chatbox-body">
            {messages.map((message, index) => (
              <div
                className={`message ${
                  socket.current.id === message.user ? "current-user" : ""
                }`}
                key={index}
              >
                <div className="avatar">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="content">
                  {socket.current.id !== message.user ? (
                    <div className="username">{message.user}</div>
                  ) : (
                    ""
                  )}
                  <div className="text">{message.message}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="chatbox-footer">
            <input
              type="text"
              placeholder="Type a message..."
              value={currentMessage.message}
              onChange={(e) => setCurrentMessage(e.target.value)}
              required
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
