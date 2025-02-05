import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MessageInput = () => {
  return (
    <div className="p-4 border-t">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <Input
          placeholder="Type a message..."
          className="flex-1"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

export default MessageInput;
