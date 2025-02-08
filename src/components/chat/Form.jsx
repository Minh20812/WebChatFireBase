import EmojiPicker from "emoji-picker-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../../firebase/firebase";

const Form = ({ room }) => {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSumbit = async (e) => {
    e.preventDefault();

    if (text.trim() === "") return;

    //the collection reference in which data will be stored
    const collectionRef = collection(db, "messages");

    //add data in the relevant collection
    await addDoc(collectionRef, {
      text,
      room,
      author: {
        id: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        photo: auth.currentUser.photoURL,
      },
      createAt: serverTimestamp(),
    });

    setText("");
    setIsOpen(false);
  };

  return (
    <form
      onSubmit={handleSumbit}
      className="p-5 border border-gray-200 shadow-lg flex justify-center gap-3"
    >
      <input
        onChange={(e) => setText(e.target.value)}
        value={text}
        type="text"
        placeholder="write your message..."
        className="border border-gray-200 shadow-sm p-2 px-4 rounded-md w-1/2"
      />
      <div className="relative">
        <div className="absolute -top-[470px] -right-[140px]">
          <EmojiPicker
            open={isOpen}
            onEmojiClick={(e) => setText(text + e.emoji)}
          />
        </div>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="btn text-base"
      >
        😁
      </button>
      <button type="submit" className="btn">
        Send
      </button>
    </form>
  );
};

export default Form;
