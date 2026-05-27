import { useState, useEffect } from "react";

interface StreakTrackerProps {
  userId?: string;
}

export default function StreakTracker({ userId }: StreakTrackerProps) {
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState("");

  const updateStreak = async () => {
    try {
      // call backend API
      const res = await fetch("/api/streak/click", {
        method: "GET",
      });
      const data = await res.json();
      setStreak(data.streak);
      setMessage(data.message || "🔥 Keep it going!");
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    }
  };

  // Load streak on first render
  useEffect(() => {
    updateStreak();
  }, []);

  return (
    <div style={{ textAlign: "center", margin: "40px 0" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "700" }}>
        Daily Streak Tracker
      </h2>
      <div style={{ fontSize: "2.5rem", color: "#ff4500", margin: "10px 0" }}>
        {streak} 🔥
      </div>
      <button
        onClick={updateStreak}
        style={{
          padding: "12px 25px",
          fontSize: "1.1rem",
          borderRadius: "8px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Click to maintain streak
      </button>
      <div style={{ marginTop: "10px", color: "#555", fontStyle: "italic" }}>
        {message}
      </div>
    </div>
  );
}