import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  try {
    const user = await currentUser();
    const { redirectToSignIn } = await auth();

    if (!user) {
      return redirectToSignIn();
    }

    const profile = await db.profile.findUnique({ where: { userId: user.id } });

    if (profile) {
      return profile;
    }

    const newProfile = await db.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress, // QUESTIONS: why array of email addresses ?
      },
    });

    return newProfile;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error((error as Error).message); // explicitly throw
  }
};
