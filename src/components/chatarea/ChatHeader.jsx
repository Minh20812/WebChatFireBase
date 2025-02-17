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
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

const ChatHeader = ({ isOpenViewProfile, setIsOpenViewProfile }) => {
  const { conversationName, conversationPhoto, conversationId, user } =
    useContext(AppContext);

  // ✅ Hàm xóa tin nhắn
  const handleClearChat = async () => {
    if (!conversationId || !user) return;

    const chatQuery = query(
      collection(db, "chats"),
      where("senderId", "in", [user.uid, conversationId]),
      where("receiverId", "in", [user.uid, conversationId])
    );

    try {
      const snapshot = await getDocs(chatQuery);
      const deletePromises = snapshot.docs.map((docRef) =>
        deleteDoc(doc(db, "chats", docRef.id))
      );

      await Promise.all(deletePromises);
      console.log("Chat cleared!");
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const handleOpenModal = () => {
    setIsOpenViewProfile(!isOpenViewProfile);
  };

  return (
    <div className="h-[60px] border-b border-indigo-100 flex items-center justify-between px-3 sm:px-4">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile menu trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 sm:w-80 p-0 bg-white">
            <div className="flex items-center justify-between">
              <SidebarHeader />
            </div>

            <Separator />

            <div className="h-[calc(100vh-180px)]">
              <Conversations />
            </div>
          </SheetContent>
        </Sheet>

        <img
          src={conversationPhoto}
          alt="Current chat"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full"
        />

        <div className="flex flex-col justify-center">
          <h2 className="font-medium text-sm sm:text-base">
            {conversationName}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            Online
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
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
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem onClick={handleOpenModal}>
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleClearChat}>
              Clear Chat
            </DropdownMenuItem>
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
