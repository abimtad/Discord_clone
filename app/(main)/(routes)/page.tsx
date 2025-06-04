import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main>
      <div>
        <UserButton />
        <ModeToggle />
      </div>
    </main>
  );
}
