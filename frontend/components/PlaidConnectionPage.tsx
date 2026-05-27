import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet } from 'lucide-react';

interface PlaidConnectionPageProps {
  userId: string;
  username: string;
  onPlaidConnected: (transactions: any[]) => void;
  onSkip: () => void;
}

export function PlaidConnectionPage({
  userId,
  username,
  onPlaidConnected,
  onSkip,
}: PlaidConnectionPageProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch link token when component mounts
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await fetch('/api/create_link_token', {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error('Failed to create link token');
        }
        const data = await response.json();
        setLinkToken(data.link_token);
        console.log('✅ Link token created');
      } catch (err) {
        console.error('❌ Error fetching link token:', err);
        setError('Failed to load Plaid. Please try again.');
      }
    };
    fetchLinkToken();
  }, []);

  const onSuccess = useCallback(
    async (public_token: string, metadata: any) => {
      try {
        setLoading(true);
        console.log('🔑 Plaid flow completed, exchanging token...');

        // Exchange public token for access token
        const tokenResponse = await fetch('/api/set_access_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            public_token,
            user_id: userId,
            institution_name: metadata?.institution?.name || 'Unknown',
          }),
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          throw new Error(errorData.error || 'Failed to set access token');
        }

        const tokenData = await tokenResponse.json();
        console.log('✅ Access token set, fetching transactions...');

        // Fetch transactions for this user
        const txResponse = await fetch(`/api/transactions?user_id=${userId}`, {
          method: 'GET',
        });

        if (!txResponse.ok) {
          const errorData = await txResponse.json();
          throw new Error(errorData.error || 'Failed to fetch transactions');
        }

        const txData = await txResponse.json();
        console.log('✅ Transactions fetched:', txData.added.length, 'transactions');

        onPlaidConnected(txData.added || []);
      } catch (err) {
        console.error('❌ Plaid error:', err);
        setError(err instanceof Error ? err.message : 'Connection failed');
        setLoading(false);
      }
    },
    [userId, onPlaidConnected]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit: (error) => {
      if (error) {
        console.error('⚠️ Plaid error:', error);
        setError(`Plaid error: ${error.error_message || error.error_code || 'Unknown error'}`);
      } else {
        console.log('⚠️ User exited Plaid');
      }
    },
  });

  return (
    <div
      className="fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{
        background: 'linear-gradient(to bottom, #8b5cf6 0%, #8b5cf6 20%, #f012be 35%, #f012be 50%, #ff6b35 65%, #ff6b35 80%, #ffb399 100%)',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 px-16 py-10 border-8 border-black"
        style={{
          boxShadow: '8px 8px 0px rgba(0,0,0,0.32)',
          background: 'rgba(255,255,255,0.95)',
          minWidth: '500px',
        }}
      >
        <button
          onClick={onSkip}
          className="absolute top-4 left-4 p-2"
          style={{ color: 'black' }}
        >
          <ArrowLeft className="w-8 h-8" />
        </button>

        <h2
          className="text-center mb-4"
          style={{
            fontSize: '2.5rem',
            fontFamily: 'monospace',
            color: 'black',
            marginTop: '20px',
          }}
        >
          Connect Your Bank
        </h2>

        <p
          style={{
            textAlign: 'center',
            fontFamily: 'monospace',
            color: '#333',
            marginBottom: '24px',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        >
          Hey {username}! 🏦<br />
          Connect your bank account to see your real spending and track your budget.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          {error && (
            <p style={{ color: 'red', fontFamily: 'monospace', fontSize: '13px', textAlign: 'center' }}>
              ❌ {error}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => open()}
            disabled={!ready || loading}
            style={{
              width: 300,
              padding: '16px',
              background: !ready || loading ? '#ccc' : 'rgb(59, 130, 246)',
              color: 'white',
              border: '4px solid black',
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: '16px',
              cursor: !ready || loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Wallet className="w-5 h-5" />
            {loading ? 'CONNECTING...' : ready ? 'CONNECT BANK' : 'LOADING...'}
          </motion.button>

          <p
            style={{
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#666',
              marginTop: '12px',
              maxWidth: '350px',
              textAlign: 'center',
              lineHeight: '1.6',
            }}
          >
            <strong>Demo Mode Instructions:</strong><br/>
            1. Search for "Sandbox" bank<br/>
            2. Username: <strong>user_good</strong><br/>
            3. Password: <strong>pass_good</strong><br/>
            4. MFA: <strong>1111</strong> (when asked)<br/>
            <br/>
            ⚠️ If you get "pattern error", double-check credentials are lowercase!
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSkip}
            style={{
              marginTop: '12px',
              padding: '12px 24px',
              background: 'transparent',
              color: 'black',
              border: '3px solid black',
              fontFamily: 'monospace',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            SKIP FOR NOW
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
