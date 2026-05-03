import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Landmark, Wallet } from 'lucide-react';
import { useState } from 'react';
import PlaidButton from '../PlaidButton';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (budget: number, transactions: any[], username: string) => void;
}

export function LoginPage({ onBack, onLoginSuccess }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [budgetInput, setBudgetInput] = useState('');

  // Signup multi-step state
  const [signupStep, setSignupStep] = useState<'form' | 'plaid'>('form');
  const [pendingBudget, setPendingBudget] = useState(0);
  const [pendingUsername, setPendingUsername] = useState('');
  const [bankConnected, setBankConnected] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [institutionName, setInstitutionName] = useState('');

  const handleSignupFormSubmit = () => {
    if (!username.trim()) { setPasswordError('Please enter a username.'); return; }
    if (password !== confirmPassword) { setPasswordError('Passwords do not match!'); return; }
    if (!budgetInput || Number(budgetInput) <= 0) { setPasswordError('Please enter a valid budget.'); return; }
    setPasswordError('');
    setPendingBudget(Number(budgetInput));
    setPendingUsername(username.trim());
    setSignupStep('plaid');
  };

  const handleBankConnected = (name: string) => {
    setInstitutionName(name || 'Your Bank');
  };

  const handleTransactionsLoaded = (txns: any[]) => {
    setTransactions(txns);
    setBankConnected(true);
  };

  const handleEnterDashboard = () => {
    onLoginSuccess(pendingBudget, transactions, pendingUsername);
  };

  // Login just skips straight to dashboard (no real auth yet)
  const handleLogin = () => {
    onLoginSuccess(2000, [], username.trim() || 'Player');
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{
        background: 'linear-gradient(to bottom, #8b5cf6 0%, #8b5cf6 20%, #f012be 35%, #f012be 50%, #ff6b35 65%, #ff6b35 80%, #ffb399 100%)'
      }}
    >
      <AnimatePresence mode="wait">
        {/* ── STEP 1: Sign Up Form ── */}
        {isSignUp && signupStep === 'form' && (
          <motion.div
            key="signup-form"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 px-16 py-10 rounded-none border-8 border-black"
            style={{ boxShadow: '8px 8px 0px rgba(0,0,0,0.32)', background: 'rgba(255,255,255,0.9)', minWidth: '430px' }}
          >
            <button onClick={onBack} className="absolute top-4 left-4 p-2" style={{ color: 'black' }}>
              <ArrowLeft className="w-8 h-8" />
            </button>

            <h2 className="text-center mb-6 tracking-wider" style={{ fontSize: '3rem', textShadow: '3px 3px 0px rgba(0,0,0,0.2)', fontFamily: 'monospace', color: 'black', marginTop: '20px' }}>
              Sign Up
            </h2>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div style={{ width: 28, height: 28, background: '#a855f7', border: '3px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', color: 'white', fontWeight: 700, fontSize: 13 }}>1</div>
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#a855f7', fontWeight: 700 }}>YOUR INFO</span>
              </div>
              <div style={{ flex: 1, height: 3, background: '#ddd', maxWidth: 40 }} />
              <div className="flex items-center gap-2">
                <div style={{ width: 28, height: 28, background: '#ddd', border: '3px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', color: '#999', fontWeight: 700, fontSize: 13 }}>2</div>
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#999' }}>LINK BANK</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: 256 }}>
                <label style={{ fontFamily: 'monospace', fontWeight: '500', color: 'black', marginBottom: 4 }}>Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="p-3 border-4 border-black focus:outline-none focus:border-purple-600" placeholder="Enter username" style={{ fontFamily: 'monospace', color: 'black' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: 256 }}>
                <label style={{ fontFamily: 'monospace', fontWeight: '500', color: 'black', marginBottom: 4 }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="p-3 border-4 border-black focus:outline-none focus:border-purple-600" placeholder="Enter password" style={{ fontFamily: 'monospace', color: 'black' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: 256 }}>
                <label style={{ fontFamily: 'monospace', fontWeight: '500', color: 'black', marginBottom: 4 }}>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="p-3 border-4 border-black focus:outline-none focus:border-purple-600" placeholder="Confirm password" style={{ fontFamily: 'monospace', color: 'black' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: 256 }}>
                <label style={{ fontFamily: 'monospace', fontWeight: '500', color: 'black', marginBottom: 4 }}>Monthly Budget Goal ($)</label>
                <input type="number" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} className="p-3 border-4 border-black focus:outline-none focus:border-purple-600" placeholder="e.g. 2000" style={{ fontFamily: 'monospace', color: 'black' }} />
              </div>

              {passwordError && <p style={{ color: 'red', fontFamily: 'monospace', fontSize: 14 }}>{passwordError}</p>}

              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleSignupFormSubmit}
                style={{ marginTop: 10, width: 256, padding: '12px', background: 'rgb(242, 250, 98)', color: 'black', border: '4px solid black', fontFamily: 'monospace', fontWeight: 700, cursor: 'pointer' }}
              >
                NEXT: LINK BANK →
              </motion.button>

              <p className="text-center text-sm" style={{ fontFamily: 'monospace', color: 'black' }}>
                Already have an account?{' '}
                <span className="text-purple-600 cursor-pointer hover:underline" onClick={() => setIsSignUp(false)}>Log In</span>
              </p>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Plaid Bank Link ── */}
        {isSignUp && signupStep === 'plaid' && (
          <motion.div
            key="signup-plaid"
            initial={{ scale: 0.8, opacity: 0, x: 60 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 px-16 py-12 rounded-none border-8 border-black"
            style={{ boxShadow: '8px 8px 0px rgba(0,0,0,0.32)', background: 'rgba(255,255,255,0.9)', minWidth: '430px', maxWidth: 500 }}
          >
            <button onClick={() => setSignupStep('form')} className="absolute top-4 left-4 p-2" style={{ color: 'black' }}>
              <ArrowLeft className="w-8 h-8" />
            </button>

            <h2 className="text-center mb-4 tracking-wider" style={{ fontSize: '2.5rem', textShadow: '3px 3px 0px rgba(0,0,0,0.2)', fontFamily: 'monospace', color: 'black', marginTop: '20px' }}>
              Link Your Bank
            </h2>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#22c55e', fontWeight: 700 }}>YOUR INFO</span>
              </div>
              <div style={{ flex: 1, height: 3, background: '#a855f7', maxWidth: 40 }} />
              <div className="flex items-center gap-2">
                <div style={{ width: 28, height: 28, background: '#a855f7', border: '3px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', color: 'white', fontWeight: 700, fontSize: 13 }}>2</div>
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#a855f7', fontWeight: 700 }}>LINK BANK</span>
              </div>
            </div>

            {/* Budget summary */}
            <div style={{ background: '#f3e8ff', border: '3px solid #a855f7', padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Wallet className="w-5 h-5 text-purple-600" />
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b21a8' }}>Monthly budget set for</div>
                <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: '#3b0764' }}>${pendingBudget.toLocaleString()}</div>
              </div>
            </div>

            {!bankConnected ? (
              <>
                <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#333', textAlign: 'center', marginBottom: 20, lineHeight: 1.6 }}>
                  Connect your bank to automatically track transactions and see your real spending in the dashboard.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <PlaidButton
                    compact={true}
                    onBankConnected={(name: string) => handleBankConnected(name)}
                    onTransactionsLoaded={(txns: any[]) => handleTransactionsLoaded(txns)}
                    onLoginComplete={() => handleEnterDashboard()}
                  />
                  <button
                    onClick={() => onLoginSuccess(pendingBudget, [], pendingUsername)}
                    style={{ padding: '12px', background: 'transparent', color: '#666', border: '3px solid #ccc', fontFamily: 'monospace', fontSize: 13, cursor: 'pointer' }}
                  >
                    Skip for now →
                  </button>
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                  <div style={{ width: 64, height: 64, background: '#dcfce7', border: '4px solid #22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <p style={{ fontFamily: 'monospace', fontWeight: 700, color: '#166534', fontSize: 16, marginBottom: 4 }}>Bank Connected!</p>
                <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#555', marginBottom: 6 }}>
                  {transactions.length > 0
                    ? `${transactions.length} transaction${transactions.length !== 1 ? 's' : ''} loaded`
                    : 'Ready to go'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                  <Landmark className="w-4 h-4 text-purple-600" />
                  <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b21a8' }}>{institutionName ? `${institutionName} linked successfully` : 'Account linked successfully'}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleEnterDashboard}
                  style={{ width: '100%', padding: '14px', background: 'rgb(242, 250, 98)', color: 'black', border: '4px solid black', fontFamily: 'monospace', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                >
                  ENTER DASHBOARD →
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── Login Form ── */}
        {!isSignUp && (
          <motion.div
            key="login"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 px-16 py-24 rounded-none border-8 border-black"
            style={{ boxShadow: '8px 8px 0px rgba(0,0,0,0.32)', background: 'rgba(255,255,255,0.8)', minHeight: '500px', minWidth: '430px' }}
          >
            <button onClick={onBack} className="absolute top-4 left-4 p-2" style={{ color: 'black' }}>
              <ArrowLeft className="w-8 h-8" />
            </button>

            <h2 style={{ fontSize: '3.5rem', textShadow: '3px 3px 0px rgba(0,0,0,0.2)', fontFamily: 'monospace', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
              Login
            </h2>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: 256 }}>
                <label className="block mb-2 tracking-wide" style={{ fontFamily: 'monospace', fontWeight: '500', color: 'black' }}>Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="p-4 border-4 border-black focus:outline-none focus:border-purple-600" style={{ boxShadow: '2px 2px 0px rgba(0,0,0,0.3)', fontFamily: 'monospace', color: 'black' }} placeholder="Enter username" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: 256 }}>
                <label className="block mb-2 tracking-wide" style={{ fontFamily: 'monospace', color: 'black' }}>Password</label>
                <input type="password" className="p-4 border-4 border-black focus:outline-none focus:border-purple-600" style={{ boxShadow: '2px 2px 0px rgba(0,0,0,0.3)', fontFamily: 'monospace', color: 'black' }} placeholder="Enter password" />
              </div>

              <div className="flex justify-center" style={{ marginTop: '25px' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                  className="p-4 border-4 border-black tracking-wide"
                  style={{ width: 256, background: 'rgb(242, 250, 98)', color: 'black', boxShadow: '3px 3px 0px rgba(0,0,0,0.8)', fontFamily: 'monospace', fontWeight: '700' }}
                >
                  START BUDGET
                </motion.button>
              </div>

              <p className="text-center text-sm tracking-wide" style={{ fontFamily: 'monospace', color: 'black' }}>
                New Player?{' '}
                <span className="text-purple-600 cursor-pointer hover:underline" onClick={() => { setIsSignUp(true); setSignupStep('form'); }}>Sign Up</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}