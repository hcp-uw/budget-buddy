import { useState } from 'react';
import { User, Lock, CreditCard, CheckCircle2 } from 'lucide-react';

interface ProfilePageProps {
  username: string;
  userId: string;
}

export function ProfilePage({ username, userId }: ProfilePageProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    setPasswordError('');
    if (!oldPassword) return setPasswordError('Enter your current password.');
    if (newPassword.length < 4) return setPasswordError('New password must be at least 4 characters.');
    if (newPassword !== confirmPassword) return setPasswordError('Passwords do not match.');

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, oldPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) return setPasswordError(data.error || 'Failed to change password');
      setPasswordSuccess(true);
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 1500);
    } catch {
      setPasswordError('Could not reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#a78bfa] via-[#ff6b9d] to-[#ffd93d] p-6 pixel-borders">
        <h2 className="text-[#1a0f2e] pixel-font text-lg mb-2">PROFILE</h2>
        <p className="text-[#1a0f2e] text-sm opacity-90">Manage your account!</p>
      </div>

      <div className="bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91]">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-6 h-6 text-[#ffd93d]" />
          <h3 className="text-white pixel-font text-sm">USERNAME</h3>
        </div>
        <div className="bg-[#3d2661] p-4 pixel-borders">
          <p className="text-[#ffd93d] pixel-font text-lg">{username}</p>
        </div>
      </div>

      <div className="bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-[#4ecdc4]" />
            <h3 className="text-white pixel-font text-sm">PASSWORD</h3>
          </div>
          <button
            onClick={() => { setShowPasswordModal(true); setPasswordError(''); setPasswordSuccess(false); }}
            className="bg-[#ff6b9d] text-white pixel-font text-xs px-4 py-2 pixel-borders hover:bg-[#ff5a8d]"
            style={{ cursor: 'pointer' }}
          >
            CHANGE
          </button>
        </div>
      </div>

      <div className="bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-[#a78bfa]" />
            <h3 className="text-white pixel-font text-sm">LINKED BANK</h3>
          </div>
          <button
            onClick={() => setShowBankModal(true)}
            className="bg-[#a78bfa] text-white pixel-font text-xs px-4 py-2 pixel-borders hover:bg-[#9b7ae8]"
            style={{ cursor: 'pointer' }}
          >
            SWITCH
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#2d1b4e] pixel-borders border-4 border-[#6b4e91]" style={{ width: '400px', padding: '40px' }}>
            {passwordSuccess ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <CheckCircle2 className="w-12 h-12 text-[#4ecdc4]" />
                <p className="text-[#4ecdc4] pixel-font text-sm">PASSWORD CHANGED!</p>
              </div>
            ) : (
              <>
                <h3 className="text-white pixel-font text-sm mb-6">CHANGE PASSWORD</h3>
                <input
                  type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)}
                  placeholder="Current password..."
                  className="w-full p-3 bg-[#1a0f2e] text-white pixel-font text-sm border-4 border-[#6b4e91] mb-3 focus:outline-none focus:border-[#ff6b9d]"
                />
                <input
                  type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="New password..."
                  className="w-full p-3 bg-[#1a0f2e] text-white pixel-font text-sm border-4 border-[#6b4e91] mb-3 focus:outline-none focus:border-[#ff6b9d]"
                />
                <input
                  type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password..."
                  className="w-full p-3 bg-[#1a0f2e] text-white pixel-font text-sm border-4 border-[#6b4e91] mb-4 focus:outline-none focus:border-[#ff6b9d]"
                  onKeyDown={e => e.key === 'Enter' && handleChangePassword()}
                />
                {passwordError && <p style={{ color: '#ff6b9d', fontFamily: 'monospace', fontSize: '12px', marginBottom: '8px' }}>{passwordError}</p>}
                <div className="flex gap-3">
                  <button
                    onClick={handleChangePassword} disabled={loading}
                    className="flex-1 bg-[#ff6b9d] text-white pixel-font text-xs py-2 pixel-borders"
                    style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'SAVING...' : 'CONFIRM'}
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 bg-[#3d2661] text-white pixel-font text-xs py-2 pixel-borders"
                    style={{ cursor: 'pointer' }}
                  >
                    CANCEL
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#2d1b4e] pixel-borders border-4 border-[#6b4e91]" style={{ width: '400px', padding: '40px' }}>
            <h3 className="text-white pixel-font text-sm mb-6">LINKED BANK</h3>
            <p className="text-[#c7b8ea] text-xs mb-6">Bank linking via Plaid is available in development mode. Currently running in sandbox mode with test data.</p>
            <button
              onClick={() => setShowBankModal(false)}
              className="w-full bg-[#3d2661] text-white pixel-font text-xs py-2 pixel-borders"
              style={{ cursor: 'pointer' }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
