import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const MyGroups = ({ userId }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, [userId]);

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('created_by', userId); // Shows groups you created

    if (!error) setGroups(data);
    setLoading(false);
  };

  if (loading) return <div className="loader">Syncing Adventures...</div>;

  return (
    <div className="my-groups-section">
      <h3>Your Active Adventures</h3>
      <div className="groups-list">
        {groups.length === 0 ? (
          <p className="empty-msg">No adventures yet. Start one above!</p>
        ) : (
          groups.map(group => (
            <div key={group.id} className="mini-card">
              <div className="card-info">
                <h4>{group.name}</h4>
                <p>Goal: ${group.goal_amount}</p>
              </div>
              <div className="invite-tag">
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