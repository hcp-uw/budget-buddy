import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Wallet } from 'lucide-react';
import { useState } from 'react';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (budget: number, transactions: any[], username: string, userId: string) => void;
}

export function LoginPage({ onBack, onLoginSuccess }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [budgetInput, setBudgetInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setErrorMsg('');
    if (!username.trim()) return setErrorMsg('Please enter a username.');
    if (password.length < 4) return setErrorMsg('Password must be at least 4 characters.');
    if (password !== confirmPassword) return setErrorMsg('Passwords do not match.');
    if (!budgetInput || Number(budgetInput) <= 0) return setErrorMsg('Please enter a valid budget.');

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password, monthlyBudget: Number(budgetInput) })
      });
      const data = await res.json();
      if (!res.ok) return setErrorMsg(data.error || 'Signup failed');
      onLoginSuccess(data.monthlyBudget, [], data.username, data.userId);
    } catch {
      setErrorMsg('Could not reach server. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setErrorMsg('');
    if (!username.trim() || !password) return setErrorMsg('Enter your username and password.');

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });
      const data = await res.json();
      if (!res.ok) return setErrorMsg(data.error || 'Login failed');
      onLoginSuccess(data.monthlyBudget, [], data.username, data.userId);
    } catch {
      setErrorMsg('Could not reach server. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "p-3 border-4 border-black focus:outline-none focus:border-purple-600 w-64";
  const labelStyle = { fontFamily: 'monospace', fontWeight: '500' as const, color: 'black', marginBottom: 4, display: 'block' };

  return (
    <div
      className="fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{ background: 'linear-gradient(to bottom, #8b5cf6 0%, #8b5cf6 20%, #f012be 35%, #f012be 50%, #ff6b35 65%, #ff6b35 80%, #ffb399 100%)' }}
    >
      <AnimatePresence mode="wait">
        {isSignUp ? (
          <motion.div
            key="signup"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 px-16 py-10 border-8 border-black"
            style={{ boxShadow: '8px 8px 0px rgba(0,0,0,0.32)', background: 'rgba(255,255,255,0.9)', minWidth: '430px' }}
          >
            <button onClick={onBack} className="absolute top-4 left-4 p-2" style={{ color: 'black' }}>
              <ArrowLeft className="w-8 h-8" />
            </button>

            <h2 className="text-center mb-8" style={{ fontSize: '3rem', fontFamily: 'monospace', color: 'black', marginTop: '20px' }}>
              Sign Up
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  type="text" value={username} onChange={e => setUsername(e.target.value)}
                  className={inputStyle} placeholder="Choose a username"
                  style={{ fontFamily: 'monospace', color: 'black' }}
                  onKeyDown={e => e.key === 'Enter' && handleSignup()}
                />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className={inputStyle} placeholder="At least 4 characters"
                  style={{ fontFamily: 'monospace', color: 'black' }}
                  onKeyDown={e => e.key === 'Enter' && handleSignup()}
                />
              </div>
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  className={inputStyle} placeholder="Confirm password"
                  style={{ fontFamily: 'monospace', color: 'black' }}
                  onKeyDown={e => e.key === 'Enter' && handleSignup()}
                />
              </div>
              <div>
                <label style={labelStyle}>Monthly Budget Goal ($)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Wallet className="w-4 h-4 text-purple-600" />
                  <input
                    type="number" value={budgetInput} onChange={e => setBudgetInput(e.target.value)}
                    className={inputStyle} placeholder="e.g. 2000"
                    style={{ fontFamily: 'monospace', color: 'black', width: '208px' }}
                    onKeyDown={e => e.key === 'Enter' && handleSignup()}
                  />
                </div>
              </div>

              {errorMsg && <p style={{ color: 'red', fontFamily: 'monospace', fontSize: 13 }}>{errorMsg}</p>}

              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleSignup}
                disabled={loading}
                style={{ marginTop: 10, width: 256, padding: '12px', background: loading ? '#ccc' : 'rgb(242, 250, 98)', color: 'black', border: '4px solid black', fontFamily: 'monospace', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
              </motion.button>

              <p className="text-center text-sm" style={{ fontFamily: 'monospace', color: 'black' }}>
                Already have an account?{' '}
                <span className="text-purple-600 cursor-pointer hover:underline" onClick={() => { setIsSignUp(false); setErrorMsg(''); setUsername(''); setPassword(''); setConfirmPassword(''); setBudgetInput(''); }}>Log In</span>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 px-16 py-24 border-8 border-black"
            style={{ boxShadow: '8px 8px 0px rgba(0,0,0,0.32)', background: 'rgba(255,255,255,0.8)', minHeight: '500px', minWidth: '430px' }}
          >
            <button onClick={onBack} className="absolute top-4 left-4 p-2" style={{ color: 'black' }}>
              <ArrowLeft className="w-8 h-8" />
            </button>

            <h2 style={{ fontSize: '3.5rem', fontFamily: 'monospace', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
              Login
            </h2>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: 256 }}>
                <label className="block mb-2" style={{ fontFamily: 'monospace', fontWeight: '500', color: 'black' }}>Username</label>
                <input
                  type="text" value={username} onChange={e => setUsername(e.target.value)}
                  className="p-4 border-4 border-black focus:outline-none focus:border-purple-600"
                  style={{ fontFamily: 'monospace', color: 'black' }} placeholder="Enter username"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: 256 }}>
                <label className="block mb-2" style={{ fontFamily: 'monospace', color: 'black' }}>Password</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="p-4 border-4 border-black focus:outline-none focus:border-purple-600"
                  style={{ fontFamily: 'monospace', color: 'black' }} placeholder="Enter password"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
              </div>

              {errorMsg && <p style={{ color: 'red', fontFamily: 'monospace', fontSize: 13 }}>{errorMsg}</p>}

              <div className="flex justify-center" style={{ marginTop: '25px' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                  disabled={loading}
                  className="p-4 border-4 border-black"
                  style={{ width: 256, background: loading ? '#ccc' : 'rgb(242, 250, 98)', color: 'black', fontFamily: 'monospace', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'LOGGING IN...' : 'START BUDGET'}
                </motion.button>
              </div>

              <p className="text-center text-sm" style={{ fontFamily: 'monospace', color: 'black' }}>
                New Player?{' '}
                <span className="text-purple-600 cursor-pointer hover:underline" onClick={() => { setIsSignUp(true); setErrorMsg(''); setUsername(''); setPassword(''); }}>Sign Up</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
