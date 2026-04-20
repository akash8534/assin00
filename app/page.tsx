"use client";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { login } = useAuth();
  const roles = [
    { id: 'u_play', name: 'Rahul Player', role: 'PLAYER' as const, teamId: 't_fb', desc: 'Join teams & track stats' },
    { id: 'u_cap', name: 'Arjun Captain', role: 'CAPTAIN' as const, teamId: 't_fb', desc: 'Manage squads & schedules' },
    { id: 'u_org', name: 'Sunny Organiser', role: 'ORGANISER' as const, desc: 'Run tournaments' },
    { id: 'u_fan', name: 'Ishaan Fan', role: 'FAN' as const, desc: 'Follow the action' },
  ];

  return (
    <div className="p-6 pt-16 flex flex-col h-full">
      <h1 className="text-4xl font-black italic text-orange-600 mb-2 tracking-tighter">GULLY STARS</h1>
      <p className="text-gray-500 mb-10 font-medium">Select your role to enter.</p>
      <div className="space-y-4">
        {roles.map((r) => (
          <button key={r.id} onClick={() => login(r)} className="w-full p-5 border-2 border-gray-100 rounded-2xl text-left hover:border-orange-500 hover:bg-orange-50 transition-all shadow-sm">
            <h3 className="font-bold text-xl">{r.role}</h3>
            <p className="text-sm text-gray-500 mt-1">{r.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}