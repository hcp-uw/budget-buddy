import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import "./Groups.css"; 

const CreateGroup = ({ userId }) => {
  const [groupName, setGroupName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName || !goalAmount) {
      alert("Please give your circle a name and a goal!");
      return;
    }
    
    setLoading(true);
    // Generates a random 6-digit invite code
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      const { error } = await supabase
        .from('groups')
        .insert([{ 
          name: groupName, 
          goal_amount: parseFloat(goalAmount), 
          invite_code: inviteCode,
          created_by: userId 
        }]);

      if (error) {
        if (error.code === '23505') {
          alert("That name is taken! Try a more unique circle name.");
        } else {
          throw error;
        }
      } else {
        alert(`🚀 Circle Created! Share this code: ${inviteCode}`);
        setGroupName('');
        setGoalAmount('');
      }
    } catch (error) {
      console.error('Database Error:', error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-card">
      <h2 className="groups-header">⭕ Create a Circle</h2>
      
      <form onSubmit={handleCreateGroup}>
        <div className="input-group">
          <label>Circle Name</label>
          <input 
            placeholder="e.g. Dream Home Fund" 
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Savings Goal ($)</label>
          <input 
            type="number" 
            placeholder="5000" 
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
          />
        </div>

        <button className="btn-modern-primary" type="submit" disabled={loading}>
          {loading ? "Launching..." : "Launch Circle"}
        </button>
      </form>
    </div>
  );
};

// This line is crucial—it fixes the "No default export" error in App.tsx
export default CreateGroup;