import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

import NavigationAction from "@/components/navigation/Navigation-action";
import NavigationItem from "./Navigation-item";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

async function NavigationSidebar() {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: { members: { some: { profileId: profile.id } } },
  });
  // TODO: what if one deletes all the server of a given profile wil this logic still hold true  return (
  return (
    <div className="flex flex-col dark:bg-[#1E1F22] bg-[#E3E5E8] py-3 w-full space-y-4 items-center text-primary h-full">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        <div className="flex flex-col space-y-4">
          {servers.map((server) => (
            <NavigationItem
              id={server.id}
              key={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="flex flex-col space-y-4 items-center my-auto">
        <ModeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
}

export default NavigationSidebar;
