import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Settings, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { AppContext } from "@/context/AppContext";
import { SettingsModal } from "./SettingModal";

const SidebarHeader = () => {
  const { searchQuery, setSearchQuery, user } = useContext(AppContext);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "Your Name",
    email: "your.email@example.com",
    phone: "+1 234 567 890",
    location: "New York, USA",
    website: "https://yourwebsite.com",
    bio: "Write something about yourself...",
    avatar: "/placeholder.svg?height=96&width=96",
  });

  const handleLogout = () => {
    signOut(auth);
  };

  const submitSearch = (e) => {
    setSearchQuery(e);
  };

  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search conversation or email"
            type="search"
            value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            onChange={(e) => submitSearch(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {user && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL} alt={user.displayName} />
                  <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                </Avatar>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          user={currentUser}
        />
      </div>
    </div>
  );
};

export default SidebarHeader;
