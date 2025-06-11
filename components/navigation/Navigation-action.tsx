import { Plus } from "lucide-react";
import React from "react";
import ActionTooltip from "@/components/Action-tooltip";

function NavigationAction() {
  return (
    <ActionTooltip label="add Server" side="right" align="start">
      <div>
        <button className="group flex items-center">
          <div className="flex items-center bg-background justify-center size-[48px] overflow-hidden rounded-[24px] group-hover:rounded-[16px] dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              className="text-emerald-500 group-hover:text-white transition"
              size={25}
            />
          </div>
        </button>
      </div>
    </ActionTooltip>
  );
}

export default NavigationAction;
