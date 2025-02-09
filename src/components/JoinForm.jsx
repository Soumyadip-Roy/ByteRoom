import React, { useState } from "react";

const JoinForm = ({ onJoin }) => {
  const [nickname, setNickname] = useState("");
  const [room, setRoom] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim() && room.trim()) {
      onJoin({ nickname, room });
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-gray-800'>
          Join Chat Room
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <input
              type='text'
              placeholder='Nickname'
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div>
            <input
              type='text'
              placeholder='Room Name'
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors'>
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinForm;
