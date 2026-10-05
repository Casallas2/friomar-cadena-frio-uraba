import { BottomNav } from "@/components/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <main className="scroll-area flex-1 overflow-y-auto">{children}</main>
      <BottomNav />
    </div>
  );
}
