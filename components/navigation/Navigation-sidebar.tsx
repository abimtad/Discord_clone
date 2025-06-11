import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import NavigationAction from "@/components/navigation/Navigation-action";

async function NavigationSidebar() {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: { members: { some: { profileId: profile.id } } },
  });
  return (
    <div className="flex flex-col dark:bg-[#1E1F22] py-3 w-full space-y-4 items-center text-primary h-full">
      <NavigationAction />
    </div>
  );
}

export default NavigationSidebar;
