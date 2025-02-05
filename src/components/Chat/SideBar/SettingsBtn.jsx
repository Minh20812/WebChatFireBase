import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const SettingsBtn = () => {
  return (
    <div className="p-4 border-t">
      <Button variant="ghost" className="w-full justify-start gap-2">
        <Settings className="h-4 w-4" />
        Settings
      </Button>
    </div>
  );
};

export default SettingsBtn;
