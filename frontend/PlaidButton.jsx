import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const PlaidButton = () => {
  const [linkToken, setLinkToken] = useState(null);

  
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/create_link_token', { 
          method: 'POST' 
        });
        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error("Error fetching link token:", error);
      }
    };
    fetchLinkToken();
  }, []);


  const onSuccess = useCallback(async (public_token, metadata) => {
    console.log("Success! Public Token:", public_token);
    try {
      await fetch('http://localhost:8000/api/set_access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token }),
      });
      alert("Bank connected successfully!");
    } catch (error) {
      console.error("Error setting access token:", error);
    }
  }, []);


  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <button 
        onClick={() => open()} 
        disabled={!ready}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        {ready ? 'Connect a Bank Account' : 'Loading Plaid...'}
      </button>
    </div>
  );
};

export default PlaidButton;