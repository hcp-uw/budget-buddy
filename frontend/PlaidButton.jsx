import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const PlaidButton = ({ onBankConnected, onTransactionsLoaded, onLoginComplete, compact = false, userEmail = null }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/create_link_token', {
          method: 'POST',
        });
        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error('Error fetching link token:', error);
      }
    };
    fetchLinkToken();
  }, []);

  const onSuccess = useCallback(async (public_token, metadata) => {
    try {
      // First, create/get user if email is provided
      let userData = null;
      if (userEmail && onLoginComplete) {
        setIsLoadingUser(true);
        const userResponse = await fetch('http://localhost:8000/api/create_user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail }),
        });
        const userDataFromServer = await userResponse.json();
        userData = userDataFromServer;
        setIsLoadingUser(false);
      }

      // Exchange public token for access token
      const tokenResponse = await fetch('http://localhost:8000/api/set_access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          public_token,
          user_id: userData?.id || null,
          institution_name: metadata?.institution?.name || 'Unknown'
        }),
      });
      
      const tokenData = await tokenResponse.json();
      const { access_token, item_id } = tokenData;

      setIsConnected(true);
      if (onBankConnected) onBankConnected(metadata?.institution?.name || 'Your Bank');

      // Fetch transactions
      setIsLoadingTransactions(true);
      const txResponse = await fetch('http://localhost:8000/api/transactions', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const txData = await txResponse.json();
      const transactions = txData.latest_transactions || txData.transactions || [];
      if (onTransactionsLoaded) onTransactionsLoaded(transactions);

      // Call onLoginComplete with all user data
      if (onLoginComplete && userData) {
        onLoginComplete({
          userId: userData.id,
          email: userData.email,
          transactions: transactions,
          accessToken: access_token,
          itemId: item_id
        });
      }
    } catch (error) {
      console.error('Error connecting bank or fetching transactions:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [onBankConnected, onTransactionsLoaded, onLoginComplete, userEmail]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  if (compact) {
    return (
      <button
        onClick={() => open()}
        disabled={!ready || isConnected || isLoadingTransactions || isLoadingUser}
        className="w-full py-3 pixel-font text-xs transition-all"
        style={{
          background: isConnected ? '#4ecdc4' : 'rgb(242, 250, 98)',
          color: 'black',
          border: '4px solid black',
          cursor: (isConnected || isLoadingTransactions || isLoadingUser) ? 'default' : 'pointer',
          fontFamily: 'monospace',
          fontWeight: '700',
          opacity: (!ready || isConnected || isLoadingTransactions || isLoadingUser) ? 0.6 : 1,
        }}
      >
        {isLoadingUser
          ? 'CREATING ACCOUNT...'
          : isLoadingTransactions
          ? 'LOADING TRANSACTIONS...'
          : isConnected
          ? '✓ BANK CONNECTED'
          : ready
          ? 'CONNECT BANK ACCOUNT'
          : 'LOADING PLAID...'}
      </button>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <button
        onClick={() => open()}
        disabled={!ready || isConnected || isLoadingTransactions || isLoadingUser}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px', 
          cursor: (isConnected || isLoadingTransactions || isLoadingUser) ? 'default' : 'pointer',
          opacity: (!ready || isConnected || isLoadingTransactions || isLoadingUser) ? 0.6 : 1,
        }}
      >
        {isLoadingUser
          ? 'Creating account...'
          : isLoadingTransactions
          ? 'Loading transactions...'
          : isConnected
          ? '✓ Bank Connected'
          : ready
          ? 'Connect a Bank Account'
          : 'Loading Plaid...'}
      </button>
    </div>
  );
};

export default PlaidButton;