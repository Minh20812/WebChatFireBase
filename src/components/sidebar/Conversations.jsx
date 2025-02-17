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
    conversationId,
  } = useContext(AppContext);
  const [conversations, setConversations] = useState([]);

  const fetchConversations = useCallback(() => {
    if (!user) return;

    if (!searchQuery || searchQuery.trim() === "") {
      const q = query(
        collection(db, "chats"),
        where("createdAt", "!=", null),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const conversationsArray = {};

        querySnapshot.forEach((doc) => {
          const message = doc.data();
          const isSender = message.senderId === user.uid;
          const isReceiver = message.receiverId === user.uid;

          if (isSender || isReceiver) {
            const chatId = isSender ? message.receiverId : message.senderId;

            if (
              !conversationsArray[chatId] ||
              message.createdAt > conversationsArray[chatId].createdAt
            ) {
              conversationsArray[chatId] = {
                id: chatId,
                ...message,
              };
            }
          }
        });

        // console.log(
        //   "Fetched conversations:",
        //   Object.values(conversationsArray)
        // );
        setConversations(Object.values(conversationsArray));
      });

      return unsubscribe;
    }

    if (searchQuery.includes("@")) {
      // Search in users collection by email
      const q = query(
        collection(db, "users"),
        where("email", ">=", searchQuery),
        where("email", "<=", searchQuery + "\uf8ff")
      );

      return onSnapshot(q, (querySnapshot) => {
        const conversationsArray = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          conversationsArray.push(userData);
        });
        setConversations(conversationsArray);
      });
    } else {
      // Search in chats collection by both receiver and sender names
      const receiverQuery = query(
        collection(db, "chats"),
        where("receiverName", ">=", searchQuery),
        where("receiverName", "<=", searchQuery + "\uf8ff"),
        where("createdAt", "!=", null),
        orderBy("createdAt", "desc")
      );

      const senderQuery = query(
        collection(db, "chats"),
        where("senderName", ">=", searchQuery),
        where("senderName", "<=", searchQuery + "\uf8ff"),
        where("createdAt", "!=", null),
        orderBy("createdAt", "desc")
      );

      // Listen to both queries
      const unsubscribeReceiver = onSnapshot(
        receiverQuery,
        (receiverSnapshot) => {
          const unsubscribeSender = onSnapshot(
            senderQuery,
            (senderSnapshot) => {
              const conversationsArray = {};

              // Process receiver results
              receiverSnapshot.forEach((doc) => {
                const message = doc.data();
                if (
                  message.senderId === user.uid ||
                  message.receiverId === user.uid
                ) {
                  const chatId =
                    message.senderId === user.uid
                      ? message.receiverId
                      : message.senderId;
                  conversationsArray[chatId] = { id: chatId, ...message };
                }
              });

              // Process sender results
              senderSnapshot.forEach((doc) => {
                const message = doc.data();
                if (
                  message.senderId === user.uid ||
                  message.receiverId === user.uid
                ) {
                  const chatId =
                    message.senderId === user.uid
                      ? message.receiverId
                      : message.senderId;
                  conversationsArray[chatId] = { id: chatId, ...message };
                }
              });

              setConversations(Object.values(conversationsArray));
            }
          );

          return () => {
            unsubscribeSender();
          };
        }
      );

      return () => {
        unsubscribeReceiver();
      };
    }
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
    <div className="w-full h-full max-w-sm mx-auto">
      <ScrollArea className="flex-1">
        {conversations.map((conversation) => {
          const {
            id,
            receiverName,
            senderName,
            name,
            receiverId,
            senderId,
            photo,
            receiverPhoto,
            senderPhoto,
            createdAt,
            text,
            email,
          } = conversation;
          const displayName =
            receiverId === user.uid ? senderName || name : receiverName || name;
          const displayPhoto =
            receiverPhoto === user.photoURL
              ? senderPhoto || photo
              : receiverPhoto || photo;

          return (
            <div
              key={id}
              className="flex items-center gap-3 p-3 sm:p-4 hover:bg-indigo-50 cursor-pointer transition-colors"
              onClick={() => {
                setConversationName(displayName);
                setConversationId(
                  receiverId === user.uid ? senderId : receiverId || id
                );
                setConversationPhoto(displayPhoto);
                // console.log("displayName:", displayName);
                // console.log("displayPhoto:", displayPhoto);
                // console.log("receiverId:", receiverId);
                // console.log("id:", id);
                // console.log("conversationId:", conversationId);
              }}
            >
              {displayPhoto ? (
                <img
                  src={displayPhoto}
                  onError={(e) => (e.target.style.display = "none")}
                  alt={displayName}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white text-lg font-bold">
                  {displayName?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm sm:text-base truncate">
                    {displayName}
                  </p>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {formatMessageTime(createdAt)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
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
