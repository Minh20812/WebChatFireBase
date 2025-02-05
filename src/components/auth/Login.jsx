import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import LoginForm from "./LoginForm";
import { auth, provider, db } from "../../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

const Login = ({ setUser }) => {
  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log("User data:", result.user);
    setUser(result.user);

    try {
      await addDoc(collection(db, "users"), {
        user: result.user.displayName,
        email: result.user.email,
        uid: result.user.uid,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "users"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUser(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex justify-center flex-col">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Sign up
            </a>
          </p>

          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Login With Google
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
