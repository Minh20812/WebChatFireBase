// import ChatTabs from "@/components/Chat/SideBar/ChatTabs";
// import SearchBar from "../components/Chat/SideBar/SearchBar";
// import UserList from "@/components/Chat/SideBar/UserList";
// import SettingsBtn from "@/components/Chat/SideBar/SettingsBtn";
// import ChatHeader from "@/components/Chat/Chat Area/ChatHeader";
// import Messages from "@/components/Chat/Chat Area/Messages";
// import MessageInput from "@/components/Chat/Chat Area/MessageInput";

// const MainRouter = ({ user }) => {
//   return (
//     <div className="flex h-screen bg-background">
//       {/* Sidebar */}
//       <div className="w-full max-w-xs border-r flex flex-col">
//         {/* Search Bar */}
//         <SearchBar />

//         {/* Tabs for Chat/Users */}
//         <ChatTabs />

//         {/* Chat/User List */}
//         <UserList />

//         {/* Settings Button */}
//         <SettingsBtn />
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {selectedChat ? (
//           <>
//             {/* Chat Header */}
//             <ChatHeader />

//             {/* Messages */}
//             <Messages />

//             {/* Message Input */}
//             <MessageInput />
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-muted-foreground">
//             Select a chat to start messaging
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainRouter;

import { useState } from "react";
import Chat from "@/components/Chat";

const MainRouter = ({ user, setUser }) => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div>
      <Chat
        user={user}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        setUser={setUser}
      />
    </div>
  );
};

export default MainRouter;
