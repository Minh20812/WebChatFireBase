import { useContext, useEffect, useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppContext } from "@/context/AppContext";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

const Conversations = () => {
  const {
    searchQuery,
    user,
    setConversationName,
    setConversationId,
    setConversationPhoto,
  } = useContext(AppContext);
  const [conversations, setConversations] = useState([]);

  // 🔹 Tách logic fetch dữ liệu ra function riêng
  const fetchConversations = useCallback(() => {
    if (!user) return;

    const collectionRef = searchQuery.includes("@") ? "users" : "chats";
    const field = searchQuery.includes("@") ? "email" : "receiverName";

    let q = query(
      collection(db, collectionRef),
      where(field, ">=", searchQuery),
      where(field, "<=", searchQuery + "\uf8ff")
    );

    if (!searchQuery.includes("@")) {
      q = query(
        q,
        where("senderId", "==", user.uid),
        orderBy("createAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const conversationsArray = querySnapshot.docs.reduce((acc, doc) => {
        const message = doc.data();
        const chatId =
          message.senderId === user.uid ? message.receiverId : message.senderId;

        if (!acc[chatId]) {
          acc[chatId] = { id: doc.id, ...message };
        }
        return acc;
      }, {});

      setConversations(Object.values(conversationsArray));
    });

    return unsubscribe;
  }, [searchQuery, user]);

  useEffect(() => {
    const unsubscribe = fetchConversations();
    return () => unsubscribe?.();
  }, [fetchConversations]);

  // 🔹 Hàm định dạng thời gian
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";

    const messageDate = timestamp.toDate();
    const now = new Date();
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));

    return diffDays === 1
      ? "Yesterday"
      : diffDays >= 3
      ? "Long ago"
      : messageDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
  };

  return (
    <div>
      <ScrollArea className="flex-1">
        {conversations.map((conversation) => {
          const {
            id,
            receiverName,
            name,
            receiverId,
            photo,
            receiverPhoto,
            createAt,
            text,
            email,
          } = conversation;
          const displayName = receiverName || name;
          const displayPhoto = photo || receiverPhoto;

          return (
            <div
              key={id}
              className="flex items-center gap-3 p-4 hover:bg-indigo-50 cursor-pointer transition-colors"
              onClick={() => {
                setConversationName(displayName);
                setConversationId(receiverId || id);
                setConversationPhoto(displayPhoto);
              }}
            >
              {displayPhoto ? (
                <img
                  src={displayPhoto}
                  onError={(e) => (e.target.style.display = "none")}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white text-lg font-bold">
                  {displayName?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-medium truncate">{displayName}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatMessageTime(createAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {text || email}
                </p>
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default Conversations;
