import BottomNav from "@/components/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Scrollable Content Area (leaves room for bottom nav) */}
      <div className="flex-1 overflow-y-auto pb-24">
        {children}
      </div>
      
      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </div>
  );
}