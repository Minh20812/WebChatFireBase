import SidebarHeader from "@/components/sidebar/Header";
import Conversations from "@/components/sidebar/Conversations";
import ChatHeader from "@/components/chatarea/ChatHeader";
import MessagesArea from "@/components/chatarea/MessagesArea";
import InputArea from "@/components/chatarea/InputArea";
import { AppContext } from "@/context/AppContext";
import EmptyMessageArea from "@/components/chatarea/EmptyMessageArea";
import { useContext } from "react";

const ChatLayout = () => {
  const { conversationId } = useContext(AppContext);
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Main Container */}
      <div className="flex-1 flex">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden md:flex md:w-80 lg:w-96 flex-col border-r border-indigo-100">
          <SidebarHeader />

          <Conversations />
        </div>

        {/* Main Chat Area */}

        {conversationId ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <ChatHeader />
            {/* Messages Area */}
            <MessagesArea />
            {/* Input Area */}
            <InputArea />{" "}
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <EmptyMessageArea />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
