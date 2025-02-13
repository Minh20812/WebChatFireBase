import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Chrome } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "@/firebase/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const LoginPage = () => {
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      console.log(user);

      const collectionRef = collection(db, "users");

      const q = query(collectionRef, where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(collectionRef, {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          createAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Log in to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button className="w-full" type="submit">
            Login
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            type="button"
            onClick={handleLogin}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="text-sm text-muted-foreground">
            <a
              href="/forgot-password"
              className="underline underline-offset-4 hover:text-primary"
            >
              Forgot your password?
            </a>
          </div>
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
