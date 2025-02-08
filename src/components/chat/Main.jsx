import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import Message from "./Message";
import Arrow from "./Arrow";

const Main = ({ room }) => {
  const [message, setMessage] = useState([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const lastMsgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    const collectionRef = collection(db, "messages");

    //Query settings
    const q = query(
      collectionRef,
      where("room", "==", room),
      orderBy("createAt", "asc")
    );

    // Realtime listener
    const unsub = onSnapshot(q, (data) => {
      const temp = [];

      data.docs.forEach((element) => {
        temp.push(element.data());
      });

      setMessage(temp);
    });

    return () => unsub();
  }, []);

  //Focus on new incoming message
  useEffect(() => {
    if (message.length > 0) {
      const lastMsg = message[message.length - 1];

      if (lastMsg.author.id === auth.currentUser.uid) {
        //If last message is sent by current user then scroll bottom every time
        scrollToBottom();
      } else if (isAtBottom) {
        //If last message is sent by some other user and isAtBottom is true then scroll bottom
        scrollToBottom();
      }
    }
  }, [message]);
  const scrollToBottom = () => {
    lastMsgRef.current.scrollIntoView();
  };

  //Scroll position
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 200);
  };

  return (
    <main
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 relative p-3 flex flex-col gap-3 w-full overflow-y-auto"
    >
      {message.length < 1 ? (
        <div className="h-full grid place-items-center  text-zinc-400">
          <p>Send the first message in the chat</p>
        </div>
      ) : (
        message.map((item, i) => <Message key={i} data={item} />)
      )}
      <div ref={lastMsgRef} />
      <Arrow isAtBottom={isAtBottom} handleScroll={scrollToBottom} />
    </main>
  );
};

export default Main;
