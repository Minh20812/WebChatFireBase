import { useState, useContext, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  or,
  and,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

const MessagesArea = () => {
  const { conversationId, user, conversationPhoto } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!conversationId || !user) return;

    const q = query(
      collection(db, "chats"),
      or(
        and(
          where("senderId", "==", user.uid),
          where("receiverId", "==", conversationId)
        ),
        and(
          where("senderId", "==", conversationId),
          where("receiverId", "==", user.uid)
        )
      ),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(chatArray);
    });

    return () => unsubscribe();
  }, [conversationId, user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const messageDate = timestamp.toDate();
    return messageDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const MessageContent = ({ message }) => {
    // Nếu là tin nhắn hình ảnh
    if (message.fileType?.startsWith("image")) {
      return (
        <div className="relative">
          <img
            src={message.fileUrl}
            alt="Sent image"
            className="max-w-[300px] rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
          <span
            className={`block text-xs mt-1 ${
              message.senderId === user.uid ? "text-black" : "text-gray-500"
            }`}
          >
            {formatMessageTime(message.createdAt)}
          </span>
        </div>
      );
    }

    // Nếu là tin nhắn file
    if (message.fileUrl && !message.fileType?.startsWith("image")) {
      return (
        <div>
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-500 hover:underline"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {message.text}
          </a>
          <span
            className={`block text-xs mt-1 ${
              message.senderId === user.uid ? "text-black" : "text-gray-500"
            }`}
          >
            {formatMessageTime(message.createdAt)}
          </span>
        </div>
      );
    }

    // Nếu là tin nhắn text thông thường
    return (
      <div>
        <p>{message.text}</p>
        <span
          className={`block text-xs mt-1 ${
            message.senderId === user.uid ? "text-black" : "text-gray-500"
          }`}
        >
          {formatMessageTime(message.createdAt)}
        </span>
      </div>
    );
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === user.uid ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex gap-2 max-w-[70%] ${
                message.senderId === user.uid ? "flex-row-reverse" : ""
              }`}
            >
              {message.senderId !== user.uid && (
                <img
                  src={conversationPhoto}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full self-end"
                />
              )}
              <div className="group relative">
                <div
                  className={`p-3 rounded-lg ${
                    message.senderId === user.uid
                      ? "bg-indigo-400 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <MessageContent message={message} />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 -right-10 hidden group-hover:flex"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessagesArea;
