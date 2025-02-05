import { useState, useEffect } from "react";
import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";

const Routers = () => {
  const [user, setUser] = useState(() => {
    // Retrieve user from localStorage if it exists
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Save user to localStorage whenever it changes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <>{!user ? <AuthRouter setUser={setUser} /> : <MainRouter user={user} />}</>
  );
};

export default Routers;
