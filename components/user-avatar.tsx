import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

interface userAvatarProps {
  src: string;
  className?: string;
}

export const UserAvatar = ({ src, className }: userAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage src={src} className={cn("size-11", className)} />
    </Avatar>
  );
};
