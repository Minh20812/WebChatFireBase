import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const UserList = () => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-2">
        {/* Chat List Items */}
        {["Alice", "Bob", "Charlie", "David", "Eve"].map((name) => (
          <button
            key={name}
            onClick={() => setSelectedChat(name)}
            className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 ${
              selectedChat === name ? "bg-muted" : ""
            }`}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <div className="flex justify-between">
                <span className="font-medium">{name}</span>
                <span className="text-xs text-muted-foreground">2m ago</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                Latest message preview...
              </p>
            </div>
          </button>
        ))}

        {/* Online Users */}
        <div className="pt-4">
          <h3 className="px-2 text-sm font-medium text-muted-foreground">
            Online Users
          </h3>
          <div className="mt-2 space-y-2">
            {["Frank", "Grace", "Henry"].map((name) => (
              <button
                key={name}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage />
                    <AvatarFallback>{name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-background" />
                </div>
                <span className="text-sm font-medium">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default UserList;
