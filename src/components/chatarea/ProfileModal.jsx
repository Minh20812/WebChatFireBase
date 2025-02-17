import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Link2, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ProfileModal = ({ isOpen, onClose, profile }) => {
  const formattedCreateAt =
    profile.createdAt && profile.createdAt.seconds
      ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : profile.createdAt || "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-[425px] max-h-[80vh] bg-white text-black overflow-y-auto mx-auto my-auto rounded-xl">
        <DialogHeader>
          <DialogTitle>Profile Information</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative">
            <img
              src={profile.photo || "/placeholder.svg"}
              alt={profile.name}
              className="w-24 h-24 rounded-full"
            />
            <span
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white
              ${
                profile.status === "online"
                  ? "bg-green-500"
                  : profile.status === "away"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
              }`}
            />
          </div>
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-600">
            {/* {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)} */}
            {profile.status || "Online nha"}
          </span>
        </div>
        <Separator />
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{profile.email}</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-3 ${
              profile.phone ? "" : "hidden"
            }`}
          >
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p>{profile.phone || "0123456789"}</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-3 ${
              profile.location ? "" : "hidden"
            }`}
          >
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Location</p>
              <p>{profile.location || "TPHCM"}</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-3 ${
              profile.website ? "" : "hidden"
            }`}
          >
            <Link2 className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Website</p>
              <a
                href={profile.website || "minhnova.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {profile.website || "minhnova.com"}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Joined</p>
              <p>{formattedCreateAt}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button className="hover-gradient" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
