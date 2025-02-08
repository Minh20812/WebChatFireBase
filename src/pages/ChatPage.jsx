import React, { useContext } from "react";
import Header from "../components/chat/Header";
import Main from "../components/chat/Main";
import Form from "../components/chat/Form";
import { AppContext } from "../context/AppContext";

const ChatPage = () => {
  const { room, setRoom } = useContext(AppContext);

  return (
    <div className="h-screen md:grid md:place-items-center">
      <div className="bg-white text-darkgray md:w-[80vw] md:max-w-[600px] h-screen md:h-[80vh] md:rounded-md overflow-hidden flex flex-col">
        <Header room={room} setRoom={setRoom} />
        <Main room={room} />
        <Form room={room} />
      </div>
    </div>
  );
};

export default ChatPage;
