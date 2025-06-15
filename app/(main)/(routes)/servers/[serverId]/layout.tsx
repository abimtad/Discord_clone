import NavigationSidebar from "@/components/navigation/Navigation-sidebar";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      {/*
        QUESTION: 'hidden md:flex' means:
        - The sidebar is hidden (display: none) on all screens by default.
        - It becomes flex (display: flex) at the md breakpoint (≥768px).
        PROBLEM: When ModalProvider was added to the layout, the sidebar stayed hidden at md and up, even though it should have become visible. The exact reason for this CSS specificity conflict is unclear, but it was resolved by using 'md:!flex' (which adds !important).
        NOTE: It should have worked without !important, so the root cause is still a mystery to unravel another time.
        FIX: Use 'md:!flex' to ensure the sidebar is visible at md and up, even if other styles try to hide it.
        SHORT-TERM-FIX: This is a workaround; revisit if related styles or providers change in the future.
      */}
      <div className="hidden md:!flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
}

export default MainLayout;
