import { useState, useContext, useEffect } from "react";
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
      orderBy("createAt", "desc")
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
                      ? "message-purple"
                      : "bg-gray-100"
                  }`}
                >
                  {message.text}
                  <div
                    className={`text-xs ${
                      message.senderId === user.uid
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.time}
                  </div>
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
      </div>
    </ScrollArea>
  );
};

export default MessagesArea;
