"use client";

import ActionTooltip from "@/components/Action-tooltip";
import { cn } from "@/lib/utils";
import { Router } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface navigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}
function NavigationItem({ id, imageUrl, name }: navigationItemProps) {
  const { serverId } = useParams();
  const router = useRouter();
  console.log("Are they equal:", serverId === id);

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip align="center" side="right" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            id === serverId ? "h-[36px]" : "h-[8px] group-hover:h-[20px]"
          )}
        />
        <div
          className={cn(
            "relative flex mx-3 size-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            serverId === id && "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image fill src={imageUrl} alt="Channel" />
        </div>
      </button>
    </ActionTooltip>
  );
}

export default NavigationItem;
