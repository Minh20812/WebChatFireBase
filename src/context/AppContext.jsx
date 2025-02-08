import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unSub();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, room, setRoom }}>
      {children}
    </AppContext.Provider>
  );
};
