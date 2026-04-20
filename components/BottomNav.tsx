"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Feed", path: "/dashboard", icon: "🏠" },
    { name: "Team", path: "/dashboard/team", icon: "🛡️" },
    { name: "Matches", path: "/dashboard/matches", icon: "📅" },
    { name: "Hub", path: "/dashboard/hub", icon: "🌍" },
    { name: "Profile", path: "/dashboard/profile", icon: "👤" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-orange-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[9px] font-black uppercase tracking-wider">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}