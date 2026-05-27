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
      // Step 1: Find the circle using the invite code
      const { data: circle, error: fetchError } = await supabase
        .from('groups')
        .select('id, name')
        .eq('invite_code', code.toUpperCase())
        .single();

      if (fetchError || !circle) {
        alert("Circle not found. Check the code and try again!");
      } else {
        // Step 2: Add this user to the circle's leaderboard/members table
        const { error: joinError } = await supabase
          .from('leaderboard_groups') 
          .insert([{ 
            group_id: circle.id, 
            user_id: userId,
            joined_at: new Date()
          }]);

        if (joinError) {
          // Error 23505 is a unique constraint violation (already joined)
          if (joinError.code === '23505') {
            alert("You are already a member of this circle!");
          } else {
            throw joinError;
          }
        } else {
          alert(`🤝 Success! You've joined the ${circle.name} Circle.`);
          setCode('');
        }
      }
    } catch (err: any) {
      console.error("Join Error:", err);
      alert(`Error joining: ${err.message}`);
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