import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Image, File, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { auth, db } from "@/firebase/firebase";
import EmojiPicker from "emoji-picker-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

const InputArea = () => {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { conversationName, conversationId, conversationPhoto } =
    useContext(AppContext);

  const handleSumbit = async (e) => {
    e.preventDefault();

    if (text.trim() === "") return;

    //the collection reference in which data will be stored
    const collectionRef = collection(db, "chats");

    //add data in the relevant collection
    await addDoc(collectionRef, {
      text,
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName,
      receiverId: conversationId,
      receiverName: conversationName,
      receiverPhoto: conversationPhoto,
      createAt: serverTimestamp(),
    });

    setText("");
    setIsOpen(false);
  };

  return (
    <form className="p-4 border-t border-indigo-100" onSubmit={handleSumbit}>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Paperclip className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Image className="w-4 h-4 mr-2" />
              Send Image
            </DropdownMenuItem>
            <DropdownMenuItem>
              <File className="w-4 h-4 mr-2" />
              Send File
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder="Type a message..."
          className="flex-1"
          onChange={(e) => setText(e.target.value)}
          value={text}
          type="text"
        />
        <Button className="hover-gradient" type="submit">
          <Send className="w-5 h-5 mr-2" />
          Send
        </Button>
      </div>
    </form>
  );
};

export default InputArea;
