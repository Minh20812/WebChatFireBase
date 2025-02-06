import { Routes, Route } from "react-router-dom";
import Login from "../components/auth/Login.jsx";
import SignUp from "../components/auth/SignUp.jsx";

const AuthRouter = ({ setUser }) => {
  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black">
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </>
  );
};

export default AuthRouter;
