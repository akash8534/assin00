"use client";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTeamPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [sport, setSport] = useState("FOOTBALL");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/team/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, sport, captainId: user?.id })
      });

      if (res.ok) {
        alert("✅ Team Created Successfully!");
        router.push('/dashboard/team'); // Send them back to the roster page
      } else {
        alert("❌ Failed to create team.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  // Prevent non-captains from creating teams
  if (!user || user.role !== 'CAPTAIN') {
    return <div className="p-6 text-center mt-10 font-bold text-gray-500">Only Captains can register new teams.</div>;
  }

  return (
    <div className="p-4 pt-8 pb-24 h-full">
      <button onClick={() => router.back()} className="text-sm font-bold text-gray-400 mb-4 hover:text-gray-800">
        ← Back
      </button>
      
      <h1 className="text-2xl font-black italic text-orange-600 mb-2">CREATE SQUAD</h1>
      <p className="text-gray-500 font-medium mb-6">Register your team to start playing.</p>

      <form onSubmit={handleCreate} className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Team Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-orange-500 font-medium"
            placeholder="e.g. Mumbai Mavericks"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Sport</label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-orange-500 font-medium bg-white"
          >
            <option value="FOOTBALL">Football</option>
            <option value="CRICKET">Cricket</option>
            <option value="BASKETBALL">Basketball</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700 transition-all mt-4"
        >
          {loading ? "Creating..." : "Register Team 🚀"}
        </button>
      </form>
    </div>
  );
}