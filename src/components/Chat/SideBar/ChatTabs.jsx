import { Button } from "@/components/ui/button";

const ChatTabs = () => {
  return (
    <div className="flex border-b">
      <Button
        variant="ghost"
        className="flex-1 rounded-none"
        onClick={() => setSelectedChat(null)}
      >
        Chats
      </Button>
      <Button variant="ghost" className="flex-1 rounded-none">
        Users
      </Button>
    </div>
  );
};

export default ChatTabs;
