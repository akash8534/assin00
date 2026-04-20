"use client";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [statData, setStatData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (user.role === 'PLAYER' || user.role === 'CAPTAIN')) {
      fetch(`/api/profile/stats?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setStatData(data);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) return null;

  const nonPlayerStats = [
    { label: "Tournaments", value: "3" },
    { label: "Active Teams", value: "12" },
  ];

  return (
    <div className="p-4 pt-8 pb-24">
      <h1 className="text-2xl font-black italic text-orange-600 mb-6">PLAYER PROFILE</h1>
      
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm text-center mb-6">
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-4">
          {user.name.charAt(0)}
        </div>
        <h2 className="text-2xl font-black text-gray-900">{user.name.replace(/(Player|Captain|Organiser|Fan)/, '').trim()}</h2>
        <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-widest rounded-md">
          {user.role}
        </span>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 font-bold animate-pulse">Loading season stats...</p>
      ) : (user.role === 'PLAYER' || user.role === 'CAPTAIN') ? (
        <>
          <h3 className="font-black text-lg mb-3">SEASON STATS ({statData?.sport || 'FOOTBALL'})</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {statData?.stats?.map((stat: any, idx: number) => (
              <div key={idx} className="bg-white border-2 border-gray-100 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-orange-600">{stat.value}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">{stat.label}</p>
              </div>
            ))}
            <div className="col-span-2 bg-blue-50 border-2 border-blue-100 rounded-xl p-4 flex justify-between items-center">
              <span className="font-bold text-blue-900">Training Sessions Attended</span>
              <span className="text-2xl font-black text-blue-600">{statData?.trainings || 0}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <h3 className="font-black text-lg mb-3">PLATFORM ACTIVITY</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {nonPlayerStats.map((stat, idx) => (
              <div key={idx} className="bg-white border-2 border-gray-100 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-orange-600">{stat.value}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}