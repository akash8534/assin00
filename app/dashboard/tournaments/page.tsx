"use client";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

export default function TournamentsPage() {
  const { user } = useAuth();
  const [standings, setStandings] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Standings
    fetch('/api/standings').then(res => res.json()).then(data => setStandings(data));
    // Fetch Tournaments & Apps
    fetch('/api/tournaments').then(res => res.json()).then(data => {
      setTournaments(data);
      setLoading(false);
    });
  }, []);

  const handleApply = async (tournamentId: string) => {
    if (!user?.teamId) return alert("You must be on a team to apply!");
    const res = await fetch('/api/tournaments/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournamentId, teamId: user.teamId })
    });
    if (res.ok) {
      alert("✅ Application sent!");
      window.location.reload();
    }
  };

  const handleApprove = async (appId: string) => {
    const res = await fetch('/api/tournaments/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appId })
    });
    if (res.ok) window.location.reload();
  };

  const handleGenerateFixtures = async (tournamentId: string) => {
    const res = await fetch('/api/tournaments/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournamentId })
    });
    if (res.ok) {
      alert("🏆 Round-Robin Fixtures Generated! Check the Matches tab.");
      window.location.reload();
    } else {
      alert("❌ Need at least 2 approved teams to generate fixtures.");
    }
  };

  // Mocking the creation for the demo so it works instantly without a modal
  const createTournament = async () => {
    alert("In a full app, this opens a form. For this MVP, we use the pre-seeded 'Summer League'.");
  };

  if (!user) return null;

  return (
    <div className="p-4 pt-8 pb-24 max-w-[390px] mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-black italic text-orange-600 uppercase tracking-tighter">Leagues</h1>
        </div>
        {user.role === 'ORGANISER' && (
          <button onClick={createTournament} className="bg-black text-white text-xs font-bold px-3 py-2 rounded-lg">
            + New
          </button>
        )}
      </div>

      {/* ORGANISER DASHBOARD */}
      {user.role === 'ORGANISER' && tournaments.map(tourney => (
        <div key={tourney.id} className="mb-8 bg-orange-50 border border-orange-100 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black text-orange-900">{tourney.name}</h2>
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white rounded-md text-orange-600">{tourney.status}</span>
          </div>

          {tourney.status === 'OPEN' && (
            <>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Pending Applications</h3>
              <div className="space-y-2 mb-4">
                {tourney.applications.filter((a:any) => a.status === 'PENDING').map((app: any) => (
                  <div key={app.id} className="bg-white p-2 rounded-lg flex justify-between items-center shadow-sm text-sm">
                    <span className="font-bold">{app.team.name}</span>
                    <button onClick={() => handleApprove(app.id)} className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs">Approve</button>
                  </div>
                ))}
                {tourney.applications.filter((a:any) => a.status === 'PENDING').length === 0 && (
                  <p className="text-xs font-medium text-gray-400">No pending requests.</p>
                )}
              </div>

              <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Approved Teams ({tourney.applications.filter((a:any) => a.status === 'APPROVED').length})</h3>
              
              <button 
                onClick={() => handleGenerateFixtures(tourney.id)}
                className="w-full bg-orange-600 text-white font-black py-3 rounded-xl mt-2 shadow-md hover:bg-orange-700"
              >
                Generate Round-Robin Schedule
              </button>
            </>
          )}
        </div>
      ))}

      {/* CAPTAIN APPLY SECTION */}
      {user.role === 'CAPTAIN' && tournaments.map(tourney => {
        const hasApplied = tourney.applications.some((a:any) => a.teamId === user.teamId);
        return tourney.status === 'OPEN' && !hasApplied ? (
          <div key={tourney.id} className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="font-black text-blue-900">{tourney.name}</p>
              <p className="text-xs font-bold text-blue-600">Registrations Open</p>
            </div>
            <button onClick={() => handleApply(tourney.id)} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md">Apply</button>
          </div>
        ) : null;
      })}

      {/* LIVE STANDINGS (Everyone) */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-black text-gray-900">LIVE STANDINGS</h2>
        </div>
        
        {loading ? (
          <p className="text-center text-gray-400 font-bold py-10 animate-pulse">Calculating table...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-[10px] text-gray-400 uppercase tracking-wider font-bold border-b border-gray-50">
                <th className="p-3">Pos</th>
                <th className="p-3">Team</th>
                <th className="p-3 text-center">P</th>
                <th className="p-3 text-center">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {standings.map((row, index) => (
                <tr key={row.id}>
                  <td className="p-3 font-bold text-gray-500">{index + 1}</td>
                  <td className="p-3 font-bold text-gray-900">{row.team}</td>
                  <td className="p-3 text-center text-gray-500">{row.played}</td>
                  <td className="p-3 text-center font-black text-orange-600">{row.points}</td>
                </tr>
              ))}
              {standings.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400 font-bold">No matches played yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}