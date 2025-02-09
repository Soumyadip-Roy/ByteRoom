import React, { useState, useEffect } from "react";
import ChatRoom from "./components/ChatRoom";
import JoinForm from "./components/JoinForm";

const App = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [userInfo, setUserInfo] = useState({ nickname: "", room: "" });

  // Check localStorage on initial load
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
      setIsJoined(true);
    }
  }, []);

  const handleJoin = (info) => {
    setUserInfo(info);
    localStorage.setItem("userInfo", JSON.stringify(info));
    setIsJoined(true);
  };

  const handleLeave = () => {
    setIsJoined(false);
    setUserInfo({ nickname: "", room: "" });
    localStorage.removeItem("userInfo");
  };

  return (
    <div className='min-h-screen bg-slate-100 p-4'>
      {!isJoined ? (
        <JoinForm onJoin={handleJoin} />
      ) : (
        <ChatRoom userInfo={userInfo} onLeave={handleLeave} />
      )}
    </div>
  );
};

export default App;
