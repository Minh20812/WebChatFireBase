import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Phone, Video, MoreVertical, Menu } from "lucide-react";
import Conversations from "../sidebar/Conversations";
import SidebarHeader from "../sidebar/Header";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

const ChatHeader = () => {
  const { conversationName, conversationPhoto } = useContext(AppContext);

  return (
    <div className="h-[60px] border-b border-indigo-100 flex items-center justify-between px-4">
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

            <Separator />

            <Separator />

            <div className="h-[calc(100vh-180px)]">
              <Conversations />
            </div>
          </SheetContent>
        </Sheet>

        <img
          src={conversationPhoto}
          alt="Current chat"
          className="w-10 h-10 rounded-full"
        />

        <div>
          <h2 className="font-medium">{conversationName}</h2>
          <p className="text-sm text-muted-foreground">Online</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="w-5 h-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Clear Chat</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
