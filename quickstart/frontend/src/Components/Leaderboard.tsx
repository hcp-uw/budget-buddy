import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Leaderboard = ({ groupId, circleName }: { groupId: string, circleName: string }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase
        .from('leaderboard_groups')
        .select('user_id')
        .eq('group_id', groupId);

      if (data) {
        // Mock data logic until real Plaid balances are attached
        const mocked = data.map(m => ({
          ...m,
          balance: Math.floor(Math.random() * 40000) + 10000 
        })).sort((a, b) => b.balance - a.balance);
        setMembers(mocked);
      }
      setLoading(false);
    };
    fetchMembers();
  }, [groupId]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '20px', color: '#64748b' }}>Fetching standings...</div>;

  return (
    <div className="leaderboard-wrapper">
      <h4>🏆 {circleName} Standings</h4>
      
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'left', paddingLeft: '20px' }}>Rank</th>
            <th style={{ textAlign: 'center' }}>Member ID</th>
            <th style={{ textAlign: 'right', paddingRight: '20px' }}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member.user_id} className={index === 0 ? "top-rank" : ""}>
              
              <td className="col-rank">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </td>
              
              <td className="col-member">
                {member.user_id.substring(0, 8)}...
              </td>
              
              <td className="col-balance">
                ${member.balance.toLocaleString()}
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;