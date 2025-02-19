import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Bell,
  Shield,
  Camera,
  AtSign,
  Phone,
  MapPin,
  Globe,
  Volume2,
  MessageSquare,
  Mail,
  Lock,
  Eye,
  Pencil,
  Languages,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SettingsModal({ isOpen, onClose, user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menuItems = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "privacy", icon: Lock, label: "Privacy" },
    { id: "language", icon: Languages, label: "Language" },
    { id: "account", icon: Shield, label: "Account" },
  ];

  const getTabTitle = () => {
    return menuItems.find((item) => item.id === activeTab)?.label || "Settings";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 sm:p-6 text-black bg-white">
        {/* Mobile Header */}
        <div className="sm:hidden flex items-center p-4 border-b">
          {!showMobileMenu ? (
            <button
              onClick={() => setShowMobileMenu(true)}
              className="flex items-center text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Settings
            </button>
          ) : (
            <button
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          )}
          <span className="flex-1 text-center font-medium">
            {showMobileMenu ? "Settings" : getTabTitle()}
          </span>
          {!showMobileMenu &&
            (isEditing ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" className="hover-gradient">
                  Save
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            ))}
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span className="text-lg">Settings</span>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" className="hover-gradient">
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className=" z-50"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu ? (
          <div className="sm:hidden">
            <div className="py-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center w-full p-4 hover:bg-indigo-50 transition-colors"
                >
                  <item.icon className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {activeTab === item.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Desktop Tabs */}
            <div className="hidden sm:block border-b mb-4">
              <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="inline-flex w-full h-auto space-x-2 bg-transparent p-0">
                  {menuItems.map((item) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className="px-3 py-2 data-[state=active]:bg-indigo-50 rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 transition-all"
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      <span>{item.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-0">
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6 mt-0">
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="relative">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt="Profile"
                      className="w-24 h-24 rounded-full"
                    />
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 rounded-full"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input defaultValue={user.name} className="pl-9" />
                      ) : (
                        <div className="p-2 pl-9 border rounded-md bg-muted/50">
                          {user.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Bio</Label>
                    {isEditing ? (
                      <Textarea
                        defaultValue={user.bio}
                        placeholder="Write something about yourself..."
                        className="min-h-[100px]"
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-muted/50 min-h-[100px]">
                        {user.bio}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          type="email"
                          defaultValue={user.email}
                          className="pl-9"
                        />
                      ) : (
                        <div className="p-2 pl-9 border rounded-md bg-muted/50">
                          {user.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          type="tel"
                          defaultValue={user.phone}
                          className="pl-9"
                        />
                      ) : (
                        <div className="p-2 pl-9 border rounded-md bg-muted/50">
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input defaultValue={user.location} className="pl-9" />
                      ) : (
                        <div className="p-2 pl-9 border rounded-md bg-muted/50">
                          {user.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          type="url"
                          defaultValue={user.website}
                          className="pl-9"
                        />
                      ) : (
                        <div className="p-2 pl-9 border rounded-md bg-muted/50">
                          {user.website}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-4">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new messages
                        </p>
                      </div>
                    </div>

                    <Switch
                      defaultChecked
                      className="border-pink-300 data-[state=active]:bg-indigo-50"
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-4">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Sound</p>
                        <p className="text-sm text-muted-foreground">
                          Play sound on new message
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked className="border-pink-300" />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-4">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Message Preview</p>
                        <p className="text-sm text-muted-foreground">
                          Show message preview in notifications
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked className="border-pink-300" />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-4">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive email about new messages
                        </p>
                      </div>
                    </div>
                    <Switch className="border-pink-300" />
                  </div>
                </div>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-4">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Private Account</p>
                        <p className="text-sm text-muted-foreground">
                          Only approved followers can see your activity
                        </p>
                      </div>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-4">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Online Status</p>
                        <p className="text-sm text-muted-foreground">
                          Show when you're active
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-4">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Read Receipts</p>
                        <p className="text-sm text-muted-foreground">
                          Show others when you've read their messages
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </TabsContent>

              {/* Language Tab */}
              <TabsContent value="language" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>App Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Message Translation</Label>
                    <Select defaultValue="auto">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-translate</SelectItem>
                        <SelectItem value="off">Off</SelectItem>
                        <SelectItem value="ask">
                          Ask before translating
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-4">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
