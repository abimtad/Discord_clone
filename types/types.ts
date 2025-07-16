import { Server, Member, Profile } from "@/lib/generated/prisma";

export type serverWithMembersWithProfile = Server & {
  members: (Member & { profile: Profile })[];
};
