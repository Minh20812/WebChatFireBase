import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginForm = () => {
  //   const [isLoading, setIsLoading] = useState(false);
  //   const router = useRouter();

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setIsLoading(true);

  //     // Simulate login - replace with actual authentication
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     router.push("/chat");

  //     setIsLoading(false);
  //   };

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="m@example.com" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required />
      </div>
      <Button className="w-full" type="submit">
        Sign in
      </Button>
    </form>
  );
};

export default LoginForm;
