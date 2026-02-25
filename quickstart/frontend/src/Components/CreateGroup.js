import React, { useState, useEffect } from 'react'; // FIXED: Added useEffect to the import
import { supabase } from '../supabaseClient';

const CreateGroup = ({ userId }) => {
  const [groupName, setGroupName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  // FIXED: Moved the useEffect inside the component function
  useEffect(() => {
    if (supabase) {
      console.log("✅ Supabase Client Initialized and ready!");
    } else {
      console.error("❌ Supabase client failed to load. Check your supabaseClient.js file.");
    }
  }, []);

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const newCode = generateCode();

    const { data, error } = await supabase
      .from('groups')
      .insert([
        { 
          name: groupName, 
          goal_amount: goalAmount, 
          invite_code: newCode, 
          created_by: userId 
        }
      ])
      .select();

    if (error) {
      alert("Error creating group: " + error.message);
    } else {
      setInviteCode(newCode);
      alert("Group Created! Share this code: " + newCode);
      
      // Add the creator as the first member automatically
      if (data && data.length > 0) {
        await supabase
          .from('group_members')
          .insert([{ group_id: data[0].id, user_id: userId }]);
      }
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>Create a Savings Group</h3>
      <form onSubmit={handleCreateGroup}>
        <input 
          type="text" 
          placeholder="Group Name" 
          value={groupName} 
          onChange={(e) => setGroupName(e.target.value)} 
          required 
          style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
        />
        <input 
          type="number" 
          placeholder="Goal Amount ($)" 
          value={goalAmount} 
          onChange={(e) => setGoalAmount(e.target.value)} 
          required 
          style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
        />
        <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Create Group
        </button>
      </form>

      {inviteCode && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', border: '1px solid #c3e6cb' }}>
          <strong>Invite your friends with code: {inviteCode}</strong>
        </div>
      )}
    </div>
  );
};

export default CreateGroup;