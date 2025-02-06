import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";

const Routers = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return !user ? (
    <AuthRouter setUser={setUser} />
  ) : (
    <MainRouter user={user} setUser={setUser} />
  );
};

export default Routers;
