import {
  Search,
  Settings,
  Phone,
  Video,
  Send,
  Menu,
  EllipsisVertical,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState, useEffect, useRef } from "react";
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

export default function Chat({ user, selectedChat, setSelectedChat }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastMessageRef = useRef(null);

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

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-full max-w-xs border-r">
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
                  onClick={() => {
                    setSelectedChat(user.user);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 ${
                    selectedChat === user.user ? "bg-slate-200" : ""
                  }`}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage />
                    <AvatarFallback>
                      {user.user ? user.user[0] : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {user.user || "Unknown User"}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
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
              {user.displayName}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="p-0 w-full max-w-xs bg-white text-black"
        >
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
                    onClick={() => {
                      setSelectedChat(user.user);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 ${
                      selectedChat === user.user ? "bg-slate-200" : ""
                    }`}
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage />
                      <AvatarFallback>
                        {user.user ? user.user[0] : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {user.user || "Unknown User"}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
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
                {user.displayName}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <Avatar className="h-10 w-10 bg-black text-white">
                <AvatarImage />
                <AvatarFallback>{selectedChat[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h2 className="font-medium truncate">{selectedChat}</h2>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex"
                >
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="min-h-full">
                <div className="space-y-4">
                  <div className="flex gap-3 flex-col-reverse">
                    {filteredMessages.reverse().map((msg, index) => (
                      <div
                        key={msg.id}
                        ref={
                          index === filteredMessages.length - 1
                            ? null
                            : lastMessageRef
                        }
                        className={`mb-2 rounded-lg p-2 max-w-[80%] flex gap-1 ${
                          msg.senderUser === user.displayName
                            ? " items-center self-end"
                            : ""
                        }`}
                      >
                        <EllipsisVertical
                          className={`cursor-pointer ${
                            msg.senderUser === user.displayName
                              ? "bg-muted"
                              : "hidden"
                          }`}
                        />

                        <Avatar className="h-8 w-8 bg-black text-white">
                          <AvatarImage
                     
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

                        <EllipsisVertical
                          className={` cursor-pointer ${
                            msg.senderUser === user.displayName
                              ? "hidden"
                              : "bg-muted"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form
                className="flex gap-2 max-w-3xl mx-auto"
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
                <Button type="submit">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          // Welcome Screen
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Welcome to Chat</h2>
              <p className="text-muted-foreground">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
