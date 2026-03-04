import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import "./Groups.css";

const MyGroups = ({ userId }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch groups on load and whenever the userId changes
  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('created_by', userId); // For now, showing groups you created

      if (error) {
        console.error('Error fetching groups:', error.message);
      } else {
        setGroups(data);
      }
      setLoading(false);
    };

    fetchGroups();
  }, [userId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Syncing your adventures...</div>;

  return (
    <div className="my-groups-container">
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '800' }}>🗺️ Your Active Adventures</h2>
      
      <div className="groups-list">
        {groups.length === 0 ? (
          <div className="empty-state">
            <p>No adventures found. Start one above to begin your journey!</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.id} className="group-card-mini">
              <div className="group-info">
                <h4>{group.name}</h4>
                <p>Goal: <strong>${group.goal_amount.toLocaleString()}</strong></p>
              </div>
              <div className="group-code-badge">
                <span>CODE</span>
                <code>{group.invite_code}</code>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyGroups;