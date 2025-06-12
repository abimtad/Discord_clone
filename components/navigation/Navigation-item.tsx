"use client";

import ActionTooltip from "@/components/Action-tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams } from "next/navigation";

interface navigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}
function NavigationItem({ id, imageUrl, name }: navigationItemProps) {
  const { serverId } = useParams();
  console.log("Are they equal:", serverId === id);
  return (
    <ActionTooltip align="center" label={name}>
      <button className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            id === serverId ? "h-[36px]" : "h-[8px] group-hover:h-[20px]"
          )}
        />
        <div
          className={cn(
            "relative flex mx-3 size-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            serverId === id && "bg-primary/10 text-primary"
          )}
        >
          <Image fill src={imageUrl} alt="Channel" />
        </div>
      </button>
    </ActionTooltip>
  );
}

export default NavigationItem;
