"use client";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

export default function MatchesPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => {
        setMatches(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  // Submit Training Session
  const handleCreateTraining = async () => {
    if (!location || !date || !time) return alert("Please fill all fields.");

    // Combine Date and Time
    const combinedDateTime = new Date(`${date}T${time}`).toISOString();

    try {
      const res = await fetch('/api/matches/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          teamId: user?.teamId || "t_fb", 
          location, 
          dateTime: combinedDateTime 
        })
      });
      if (res.ok) window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // Submit RSVP
  const handleRSVP = async (matchId: string, status: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, userId: user.id, status })
      });
      if (res.ok) window.location.reload(); 
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 pt-8 pb-24 max-w-[390px] mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black italic text-gray-900 uppercase tracking-tighter">Fixtures</h1>
        {user?.role === 'CAPTAIN' && (
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-bold p-2 px-4 rounded-xl shadow-md">
            + Schedule
          </button>
        )}
      </div>

      {/* SCHEDULE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-6 flex flex-col pb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-xl">Schedule Training</h2>
              <button onClick={() => setIsModalOpen(false)} className="font-bold text-gray-400">Cancel</button>
            </div>
            
            <label className="text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
            <input 
              type="text" placeholder="e.g. Main Pitch, North Park" 
              className="w-full bg-gray-50 p-4 rounded-xl mb-4 font-medium outline-none border border-gray-100"
              value={location} onChange={(e) => setLocation(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full bg-gray-50 p-4 rounded-xl font-medium outline-none border border-gray-100"
                  value={date} onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
                <input 
                  type="time" 
                  className="w-full bg-gray-50 p-4 rounded-xl font-medium outline-none border border-gray-100"
                  value={time} onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <button onClick={handleCreateTraining} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl">
              Create Session
            </button>
          </div>
        </div>
      )}

      {/* FIXTURE LIST */}
      {loading ? (
        <p className="text-center font-bold text-gray-400 mt-10 animate-pulse">Loading fixtures...</p>
      ) : matches.length === 0 ? (
        <p className="text-center font-bold text-gray-400 mt-10">No upcoming fixtures.</p>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => {
            // Calculate Live Count
            const going = match.rsvps?.filter((r: any) => r.status === 'GOING').length || 0;
            const maybe = match.rsvps?.filter((r: any) => r.status === 'MAYBE').length || 0;
            const notGoing = match.rsvps?.filter((r: any) => r.status === 'NOT_GOING').length || 0;
            
            const matchDate = new Date(match.date);
            const dateStr = matchDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
            const timeStr = matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={match.id} className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${match.isTraining ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                      {match.isTraining ? 'Training' : 'Match'}
                    </span>
                    <h2 className="text-lg font-black mt-2 leading-tight">{match.team.name} vs {match.opponent}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">{dateStr}</p>
                    <p className="text-xs font-bold text-gray-500">{timeStr}</p>
                  </div>
                </div>

                <p className="text-sm font-medium text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg inline-block">
                  📍 {match.location || 'TBA'}
                </p>

                {/* THE LIVE COUNT (Captain Only) */}
                {match.isTraining && user.role === 'CAPTAIN' && (
                  <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-800 mb-2">Live Attendance</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white p-2 rounded-lg border border-blue-50">
                        <p className="text-lg font-black text-green-600">{going}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Going</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-blue-50">
                        <p className="text-lg font-black text-orange-400">{maybe}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Maybe</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-blue-50">
                        <p className="text-lg font-black text-red-500">{notGoing}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Out</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* RSVP CONTROLS (Players & Captains) */}
                {(user.role === 'PLAYER' || user.role === 'CAPTAIN') && !match.score && (
                  <div className="mt-2 pt-4 border-t border-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase text-center mb-3">Your RSVP</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleRSVP(match.id, 'GOING')} className="flex-1 bg-green-50 text-green-700 border border-green-200 font-bold py-2 rounded-xl hover:bg-green-100 text-sm">✅ Going</button>
                      <button onClick={() => handleRSVP(match.id, 'MAYBE')} className="flex-1 bg-orange-50 text-orange-700 border border-orange-200 font-bold py-2 rounded-xl hover:bg-orange-100 text-sm">🤔 Maybe</button>
                      <button onClick={() => handleRSVP(match.id, 'NOT_GOING')} className="flex-1 bg-red-50 text-red-700 border border-red-200 font-bold py-2 rounded-xl hover:bg-red-100 text-sm">❌ Out</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}