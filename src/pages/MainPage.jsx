import SidebarHeader from "@/components/sidebar/Header";
import Conversations from "@/components/sidebar/Conversations";
import ChatHeader from "@/components/chatarea/ChatHeader";
import MessagesArea from "@/components/chatarea/MessagesArea";
import InputArea from "@/components/chatarea/InputArea";
import { AppContext } from "@/context/AppContext";
import EmptyMessageArea from "@/components/chatarea/EmptyMessageArea";
import { useContext } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatLayout = () => {
  const { conversationId } = useContext(AppContext);
  return (
    <div className="h-[100dvh] flex flex-col bg-white overflow-hidden">
      {/* Main Container */}
      <div className="flex-1 flex">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden md:flex md:w-80 lg:w-96 flex-col border-r border-indigo-100">
          <SidebarHeader />

          <Conversations />
        </div>

        {/* Main Chat Area */}

        {conversationId ? (
          <div className="h-[100dvh] flex flex-col w-full">
            {/* Chat Header */}
            <ChatHeader className="shrink-0" />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
              <MessagesArea />
            </div>

            {/* Input Area */}
            <InputArea className="shrink-0" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3">
              {/* Mobile menu trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 bg-white">
                  {/* Mobile Sidebar Content */}
                  <div className=" flex items-center justify-between">
                    <SidebarHeader />
                  </div>

                  <div className="h-[calc(100vh-180px)]">
                    <Conversations />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <EmptyMessageArea />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
