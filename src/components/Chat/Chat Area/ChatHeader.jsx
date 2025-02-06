import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatHeader = () => {
  return (
    <div className="p-4 border-b flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage />
        <AvatarFallback>{selectedChat[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="font-medium">{selectedChat}</h2>
        <p className="text-sm text-muted-foreground">Online</p>
      </div>
    </div>
  );
};

export default ChatHeader;
