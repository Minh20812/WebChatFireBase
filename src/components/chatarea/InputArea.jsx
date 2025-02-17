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
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

const CLOUD_NAME = "djojfg2rr"; // Thay thế với cloud name của bạn
const UPLOAD_PRESET = "ChatRealTime"; // Thay thế với upload preset của bạn

const InputArea = () => {
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { conversationName, conversationId, conversationPhoto } =
    useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() === "") return;

    try {
      const collectionRef = collection(db, "chats");
      await addDoc(collectionRef, {
        text,
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName,
        senderPhoto: auth.currentUser.photoURL,
        receiverId: conversationId,
        receiverName: conversationName,
        receiverPhoto: conversationPhoto,
        createdAt: serverTimestamp(),
      });

      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return;

    setIsUploading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("cloud_name", CLOUD_NAME);

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        // Save to Firestore
        const collectionRef = collection(db, "chats");
        await addDoc(collectionRef, {
          text: file.type.startsWith("image")
            ? "📷 Image sent"
            : "📄 File sent",
          fileUrl: data.secure_url,
          fileType: file.type,
          senderId: auth.currentUser.uid,
          senderName: auth.currentUser.displayName,
          senderPhoto: auth.currentUser.photoURL,
          receiverId: conversationId,
          receiverName: conversationName,
          receiverPhoto: conversationPhoto,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form className="p-4 border-t border-indigo-100" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isUploading}>
            <Button variant="ghost" size="icon">
              <Paperclip className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-white">
            <DropdownMenuItem
              onSelect={() => document.getElementById("fileInput").click()}
            >
              <Image className="w-4 h-4 mr-2" />
              Send Image
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => document.getElementById("fileInput").click()}
            >
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
          disabled={isUploading}
        />

        <Button
          className="hover-gradient"
          type="submit"
          disabled={isUploading || text.trim() === ""}
        >
          <Send className="w-5 h-5 mr-2" />
          Send
        </Button>

        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={(e) => uploadFile(e.target.files[0])}
        />

        {isUploading && (
          <div className="fixed bottom-20 right-4 bg-white p-4 rounded-lg shadow-lg">
            <p>Uploading file...</p>
          </div>
        )}
      </div>
    </form>
  );
};

export default InputArea;
