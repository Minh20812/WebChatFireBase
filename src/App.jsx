import React, { useContext } from "react";
import LoginPage from "./pages/LoginPage";
import RoomPage from "./pages/RoomPage";
import ChatPage from "./pages/ChatPage";
import Loader from "./components/chat/Loader";
import { AppContext } from "./context/AppContext";
import MainPage from "./pages/MainPage";

const App = () => {
  const { user, room, setRoom } = useContext(AppContext);

  if (user === undefined) {
    return <Loader />;
  }

  if (user === null) return <LoginPage />;

  if (room) return <ChatPage room={room} setRoom={setRoom} />;

  return <MainPage />;
  // return <RoomPage setRoom={setRoom} />;
};

export default App;
