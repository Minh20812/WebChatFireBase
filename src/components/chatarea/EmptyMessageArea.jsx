import { MessageSquare } from "lucide-react";

const EmptyMessageArea = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <MessageSquare className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
      <p className="text-muted-foreground max-w-sm">
        Choose a conversation from the list or start a new one to begin chatting
      </p>
    </div>
  );
};

export default EmptyMessageArea;
