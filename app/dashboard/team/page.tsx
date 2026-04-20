"use client";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

export default function TeamManagementPage() {
  const { user } = useAuth();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/team?teamId=${user.teamId || 't_fb'}`)
      .then(res => res.json())
      .then(data => {
        setTeam(data);
        setLoading(false);
      });
  }, [user]);

  const handleRequest = async (requestId: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/team/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action })
      });
      if (res.ok) {
        alert(`✅ Player ${action.toLowerCase()} successfully!`);
        window.location.reload(); // Refresh roster
      }
    } catch (error) {
      console.error(error);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(team?.id);
    alert(`Invite code copied: ${team?.id}\nShare this with players to join!`);
  };

  if (!user) return null;

  return (
    <div className="p-4 pt-8 pb-24 max-w-[390px] mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-black italic text-gray-900 uppercase tracking-tighter mb-6">Squad HQ</h1>

      {loading ? (
        <p className="text-center font-bold text-gray-400 mt-10 animate-pulse">Loading roster...</p>
      ) : (
        <div className="space-y-6">
          
          {/* Team Header & Invite Code */}
          <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-pink-500"></div>
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-2xl font-black mx-auto mb-3">
              {team?.name?.charAt(0) || "T"}
            </div>
            <h2 className="text-2xl font-black">{team?.name}</h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{team?.sport}</p>
            
            {user.role === 'CAPTAIN' && (
              <button onClick={copyInviteCode} className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2">
                <span>📋 Copy Invite Code</span>
              </button>
            )}
          </div>

          {/* Join Requests (Captain Only) */}
          {user.role === 'CAPTAIN' && team?.joinRequests?.length > 0 && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
              <h3 className="font-black text-orange-900 mb-3 flex items-center gap-2">
                <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">{team.joinRequests.length}</span>
                Pending Requests
              </h3>
              <div className="space-y-3">
                {team.joinRequests.map((req: any) => (
                  <div key={req.id} className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm">
                    <p className="font-bold text-gray-900">{req.user.name}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleRequest(req.id, 'APPROVED')} className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-lg text-sm hover:bg-green-200">Accept</button>
                      <button onClick={() => handleRequest(req.id, 'REJECTED')} className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-lg text-sm hover:bg-red-200">Deny</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Player Roster */}
          <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 border-b border-gray-100 p-4">
              <h3 className="font-black text-gray-900">ACTIVE ROSTER ({team?.players?.length || 0})</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {team?.players?.map((player: any) => (
                <div key={player.id} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400">
                    {player.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 flex items-center gap-2">
                      {player.name}
                      {player.id === team.captainId && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-black px-2 py-0.5 rounded-md tracking-widest">Captain</span>
                      )}
                    </p>
                    <p className="text-xs font-medium text-gray-500 capitalize">{player.role.toLowerCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}