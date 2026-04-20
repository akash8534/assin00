"use client";
import { useAuth } from "@/lib/auth-context";

export default function TeamHubPage() {
  const { user } = useAuth();

  if (!user) return null;

  const handleCreateTeam = async () => {
    if (!user || user.role !== 'CAPTAIN') return;
    
    const name = prompt("Enter your new Team Name:");
    if (!name) return;

    const sport = prompt("Which sport? (FOOTBALL, CRICKET, BASKETBALL):", "FOOTBALL");
    if (!sport) return;

    try {
      const res = await fetch('/api/team/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, sport: sport.toUpperCase(), captainId: user.id })
      });

      if (res.ok) {
        alert(`✅ Welcome to the league! ${name} has been created successfully.`);
      } else {
        alert("❌ Failed to create team.");
      }
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleJoinTeam = async () => {
    const code = prompt("Enter a 6-digit Invite Code to join a team (e.g., 123456):");
    if (!code) return;

    try {
      const res = await fetch('/api/team/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, inviteCode: code })
      });

      if (res.ok) {
        alert(`✅ Request sent! The Captain will review your application for code ${code}.`);
      } else {
        alert("❌ Failed to send request.");
      }
    } catch (error) {
      console.error("Error joining team:", error);
    }
  };

  return (
    <div className="p-4 pt-8 pb-24">
      <h1 className="text-2xl font-black italic text-orange-600 mb-2">TEAM REGISTRATION</h1>
      <p className="text-gray-500 font-medium mb-6">Find your squad or build a new one.</p>

      <div className="space-y-4">
        {/* Create Team - Captains & Organisers */}
        {(user.role === 'CAPTAIN' || user.role === 'ORGANISER') && (
          <div className="bg-orange-600 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <h2 className="text-2xl font-black relative z-10">BUILD A SQUAD</h2>
            <p className="text-orange-100 text-sm mt-1 relative z-10 mb-4">Register a new club for the upcoming season.</p>
            <button onClick={handleCreateTeam} className="bg-white text-orange-600 font-bold px-5 py-2.5 rounded-xl relative z-10 w-full hover:bg-gray-50 transition-colors">
              + Create Team
            </button>
          </div>
        )}

        {/* Tournaments - Everyone can view, Organisers can manage */}
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-black text-gray-900">TOURNAMENTS</h2>
          <p className="text-gray-500 text-sm mt-1 mb-4">View live standings and upcoming leagues.</p>
          <button onClick={() => window.location.href = '/dashboard/tournaments'} className="bg-gray-100 text-gray-900 font-bold px-5 py-2.5 rounded-xl w-full hover:bg-gray-200 transition-colors">
            View Standings
          </button>
        </div>

        {/* Join Team - Players */}
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-black text-gray-900">JOIN EXISTING TEAM</h2>
          <p className="text-gray-500 text-sm mt-1 mb-4">Have an invite code from a captain?</p>
          <button onClick={handleJoinTeam} className="bg-black text-white font-bold px-5 py-2.5 rounded-xl w-full hover:bg-gray-800 transition-colors">
            Enter Invite Code
          </button>
        </div>
      </div>
    </div>
  );
}