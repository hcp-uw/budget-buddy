import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface JoinGroupProps {
  userId: string;
}

const JoinGroup: React.FC<JoinGroupProps> = ({ userId }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Find the group by the invite code
    const { data: group, error: findError } = await supabase
      .from('groups')
      .select('id, name')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();

    if (findError || !group) {
      alert("Group not found. Double check the code!");
      setLoading(false);
      return;
    }

    // 2. Add user to the group_members table
    const { error: joinError } = await supabase
      .from('group_members')
      .insert([{ group_id: group.id, user_id: userId }]);

    if (joinError) {
      // Error code 23505 is a unique constraint violation (already in group)
      if (joinError.code === '23505') {
        alert("You're already a member of " + group.name);
      } else {
        alert("Error joining group: " + joinError.message);
      }
    } else {
      alert(`Success! You've joined ${group.name}`);
      setInviteCode('');
    }
    
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded shadow mt-4 bg-white">
      <h3 className="text-lg font-bold mb-2">Join a Group</h3>
      <form onSubmit={handleJoin} className="flex gap-2">
        <input 
          type="text" 
          placeholder="Enter 6-digit code" 
          value={inviteCode} 
          onChange={(e) => setInviteCode(e.target.value)} 
          maxLength={6}
          required 
          className="border p-2 rounded uppercase flex-1"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Joining...' : 'Join'}
        </button>
      </form>
    </div>
  );
};

export default JoinGroup;