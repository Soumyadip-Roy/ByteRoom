import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import useChatStore from "../store/chatStore";

// Create socket connection with forced websocket transport to help in offline/local networks
// const serverUrl = process.env.REACT_APP_SERVER_URL || window.location.hostname;
const serverUrl = window.location.hostname;

const socket = io(`http://${serverUrl}:3000`, {
  transports: ["websocket"],
  forceNew: true,
  reconnection: true,
});

const ChatRoom = ({ userInfo, onLeave }) => {
  const { nickname, room } = userInfo;
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { messages, users, addMessage, setUsers, clearMessages } =
    useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.emit("join_room", { nickname, room });

    socket.on("user_joined", ({ users }) => {
      setUsers(users);
    });

    socket.on("user_left", ({ users }) => {
      setUsers(users);
    });

    socket.on("receive_message", (message) => {
      addMessage(message);
    });

    return () => {
      socket.emit("leave_room", { nickname, room });
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("receive_message");
      clearMessages();
    };
  }, [nickname, room, setUsers, addMessage, clearMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        room,
        author: nickname,
        message: message.trim(),
        time: new Date().toLocaleTimeString(),
      };
      // Emit message to server and add it locally
      socket.emit("send_message", messageData);
      addMessage(messageData);
      setMessage("");
    }
  };

  const handleLeave = () => {
    socket.emit("leave_room", { nickname, room });
    onLeave();
  };

  return (
    <div className='w-full max-w-4xl mx-auto h-screen flex flex-col'>
      <div className='p-4 border-b flex justify-between items-center bg-gray-100'>
        <h2 className='text-xl font-bold text-gray-800'>Room: {room}</h2>
        <button
          onClick={handleLeave}
          className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors'>
          Leave Room
        </button>
      </div>

      <div className='flex flex-1 overflow-hidden'>
        <div className='flex-1 flex flex-col p-4'>
          <div className='flex-1 overflow-y-auto mb-4 space-y-2 p-2 border rounded'>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-[80%] break-words ${
                  msg.author === nickname
                    ? "ml-auto bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}>
                <div className='font-bold text-sm'>{msg.author}</div>
                <div>{msg.message}</div>
                <div className='text-xs opacity-75 mt-1'>{msg.time}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className='flex gap-2'>
            <input
              type='text'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Type a message...'
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              type='submit'
              className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
              Send
            </button>
          </form>
        </div>

        <div className='w-48 border-l p-4 bg-gray-50'>
          <h3 className='font-bold mb-2 text-gray-700'>Online Users</h3>
          <div className='space-y-1'>
            {users.map((user) => (
              <div
                key={user}
                className={`text-sm ${
                  user === nickname
                    ? "text-blue-500 font-bold"
                    : "text-gray-600"
                }`}>
                {user}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
