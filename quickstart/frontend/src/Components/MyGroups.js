import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Leaderboard from './Leaderboard';
import "./Groups.css";



const MyGroups = ({ userId }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLeaderboard, setActiveLeaderboard] = useState(null);

  useEffect(() => {
    const fetchMyGroups = async () => {
      setLoading(true);
      try {
        const { data: membershipData, error: membershipError } = await supabase
          .from('leaderboard_groups')
          .select('group_id')
          .eq('user_id', userId);

        if (membershipError) throw membershipError;

        if (membershipData && membershipData.length > 0) {
          const groupIds = membershipData.map(item => item.group_id);

          const { data: groupDetails, error: groupError } = await supabase
            .from('groups')
            .select('*')
            .in('id', groupIds);

          if (groupError) throw groupError;
          setGroups(groupDetails || []);
        }
      } catch (error) {
        console.error('Error fetching circles:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMyGroups();
    }
  }, [userId]);

  const toggleLeaderboard = (groupId) => {
    setActiveLeaderboard(activeLeaderboard === groupId ? null : groupId);
  };

  if (loading) return <div className="loading-text">Scanning your Circles...</div>;

  return (
    <div className="my-groups-container">
      <h2 className="groups-header" style={{ textAlign: 'center', fontSize: '2.8rem' }}>
        ⭕ Your Active Circles
      </h2>

      {groups.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.4rem', color: '#888', marginTop: '40px' }}>
          You haven't joined any circles yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
          {groups.map((group) => (
            <div key={group.id} className="group-card" style={{ maxWidth: '800px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>{group.name}</h3>
                  <p style={{ fontSize: '1.3rem', margin: '0 0 15px 0' }}>
                    Target: <strong>${group.goal_amount.toLocaleString()}</strong>
                  </p>
                  <code className="leaderboard-code-badge">
                    Code: {group.invite_code}
                  </code>
                </div>
                
                <button 
                  className="btn-modern-primary"
                  onClick={() => toggleLeaderboard(group.id)}
                  style={{
                    width: 'auto',
                    padding: '15px 30px',
                    backgroundColor: activeLeaderboard === group.id ? '#334155' : '#000'
                  }}
                >
                  {activeLeaderboard === group.id ? "Hide Standings" : "View Leaderboard"}
                </button>
              </div>

              {activeLeaderboard === group.id && (
                <div style={{ marginTop: '30px' }}>
                  <Leaderboard groupId={group.id} circleName={group.name} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGroups;