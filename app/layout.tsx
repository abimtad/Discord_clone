import "./globals.css";
import { Open_Sans } from "next/font/google";
import { type Metadata } from "next";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-providers";
import { cn } from "@/lib/utils";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team chat application",
  description: "A discord clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="discord-theme"
          >
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
