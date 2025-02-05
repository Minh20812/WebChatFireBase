import { Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { db, realtimeDB } from "../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { ref, push } from "firebase/database";

export default function Chat({ user }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(
        "Fetched Messages:",
        snapshot.docs.map((doc) => doc.data())
      ); // Kiểm tra dữ liệu
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      setUsers(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchUsers();
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: message,
        senderUser: user.displayName,
        receiverUser: selectedChat,
        timestamp: serverTimestamp(),
        email: user.email,
        uid: user.uid,
      });

      // Send real-time message
      push(ref(realtimeDB, "messages"), {
        text: message,
        senderUser: user.displayName,
        receiverUser: selectedChat,
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderUser === user.displayName &&
        msg.receiverUser === selectedChat) ||
      (msg.senderUser === selectedChat && msg.receiverUser === user.displayName)
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-full max-w-xs border-r flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs for Chat/Users */}
        <div className="flex border-b">
          <Button
            variant="ghost"
            className="flex-1 rounded-none hover:bg-slate-100"
            onClick={() => setSelectedChat(null)}
          >
            Chats
          </Button>
          <Button
            variant="ghost"
            className="flex-1 rounded-none hover:bg-slate-100"
          >
            Users
          </Button>
        </div>

        {/* Chat/User List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {/* Chat List Items */}
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedChat(user.user)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 ${
                  selectedChat === user.user ? "bg-muted" : ""
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                  <AvatarFallback>
                    {user.user ? user.user[0] : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {user.user || "Unknown User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      2m ago
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    Latest message preview...
                  </p>
                </div>
              </button>
            ))}

            {/* Online Users */}
            <div className="pt-4">
              <h3 className="px-2 text-sm font-medium text-muted-foreground">
                Online Users
              </h3>
              <div className="mt-2 space-y-2">
                {["Frank", "Grace", "Henry"].map((name) => (
                  <button
                    key={name}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32`}
                        />
                        <AvatarFallback>{name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-background" />
                    </div>
                    <span className="text-sm font-medium">{name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Settings Button */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 hover:bg-slate-100"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-black text-white">
                <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                <AvatarFallback>{selectedChat[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium">{selectedChat}</h2>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <div className="flex gap-3 flex-col-reverse">
                  {filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="mb-2 bg-muted rounded-lg p-3 max-w-[80%] flex gap-1"
                    >
                      <Avatar className="h-8 w-8 bg-black text-white">
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32`}
                        />
                        <AvatarFallback>{msg.senderUser[0]}</AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="text-sm">
                          <strong>{msg.senderUser}:</strong> {msg.text}
                        </p>
                        <span className="text-xs text-muted-foreground mt-1">
                          {msg.timestamp?.toDate().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">I'm doing great! How about you?</p>
                    <span className="text-xs text-primary-foreground/70 mt-1">
                      2:31 PM
                    </span>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button type="submit">Send</Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
