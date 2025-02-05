import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const Messages = () => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
            <AvatarFallback>{selectedChat[0]}</AvatarFallback>
          </Avatar>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className="mb-2 bg-muted rounded-lg p-3 max-w-[80%]"
            >
              <p className="text-sm">
                <strong>{msg.user}:</strong> {msg.text}
              </p>

              <span className="text-xs text-muted-foreground mt-1">
                {msg.timestamp?.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-end">
          <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
            <p className="text-sm">I'm doing great! How about you?</p>
            <span className="text-xs text-primary-foreground/70 mt-1">
              2:31 PM
            </span>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Messages;
