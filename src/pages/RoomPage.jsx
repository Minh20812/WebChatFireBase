import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../firebase/firebase";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const RoomPage = () => {
  const { setRoom } = useContext(AppContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const room = e.target[0].value.toLowerCase();
    setRoom(room);
  };

  const handleLogout = () => {
    signOut(auth);
  };
  return (
    <div className="wrapper">
      <form
        onSubmit={handleSubmit}
        className="box flex flex-col gap-10 text-center "
      >
        <h1 className="text-4xl font-bold">Chat Room</h1>
        <p className="text-gray-400">Which room will you join?</p>
        <input
          type="text"
          placeholder="Eg: React"
          required
          className="border border-gray-300 rounded-md shadow-lg p-2 px-4"
        />
        <button
          type="submit"
          className="bg-zinc-600 border border-gray-300 rounded-md p-2 text-white hover:bg-zinc-800 transition cursor-pointer"
        >
          Join Room
        </button>
        <button
          onClick={handleLogout}
          type="button"
          className="bg-red-600 border border-gray-300 rounded-md p-2 text-white hover:bg-red-800 transition cursor-pointer"
        >
          Logout
        </button>
      </form>
    </div>
  );
};

export default RoomPage;
