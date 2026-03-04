import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import "./Groups.css";

interface Props {
  userId: string;
}

const JoinGroup: React.FC<Props> = ({ userId }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!code) {
      alert("Please enter a 6-digit invite code.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Step 1: Verify the circle exists
      const { data: group, error: fetchError } = await supabase
        .from('groups')
        .select('id, name')
        .eq('invite_code', code.toUpperCase())
        .single();

      if (fetchError || !group) {
        alert("Circle not found. Double-check your code!");
      } else {
        // Step 2: Logic for joining the circle goes here
        // (Typically inserting a row into a 'members' or 'leaderboard' table)
        alert(`🤝 Success! You've joined the ${group.name} Circle.`);
        setCode('');
      }
    } catch (err) {
      console.error("Join Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-card">
      <h2 className="groups-header">🤝 Join a Circle</h2>
      
      <div className="input-group">
        <label>Invite Code</label>
        <input 
          placeholder="Enter 6-digit code" 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          style={{ textTransform: 'uppercase' }}
        />
      </div>

      <button 
        className="btn-modern-primary" 
        onClick={handleJoin} 
        disabled={loading}
      >
        {loading ? "Connecting..." : "Join Circle"}
      </button>
    </div>
  );
};

export default JoinGroup;