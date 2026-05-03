import { useState } from 'react';
import { User, Lock, CreditCard } from 'lucide-react';

interface ProfilePageProps {
  username: string;
}

export function ProfilePage({ username }: ProfilePageProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#a78bfa] via-[#ff6b9d] to-[#ffd93d] p-6 pixel-borders">
        <h2 className="text-[#1a0f2e] pixel-font text-lg mb-2">PROFILE</h2>
        <p className="text-[#1a0f2e] text-sm opacity-90">Manage your account!</p>
      </div>

      {/* Username */}
      <div className="bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91]">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-6 h-6 text-[#ffd93d]" />
          <h3 className="text-white pixel-font text-sm">USERNAME</h3>
        </div>
        <div className="bg-[#3d2661] p-4 pixel-borders">
          <p className="text-[#ffd93d] pixel-font text-lg">{username}</p>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-[#4ecdc4]" />
            <h3 className="text-white pixel-font text-sm">PASSWORD</h3>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-[#ff6b9d] text-white pixel-font text-xs px-4 py-2 pixel-borders hover:bg-[#ff5a8d]"
            style={{ cursor: 'pointer' }}
          >
            CHANGE
          </button>
        </div>
      </div>

      {/* Linked Bank */}
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

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#2d1b4e] pixel-borders border-4 border-[#6b4e91]" style={{ width: '400px', padding: '40px' }}>
            <h3 className="text-white pixel-font text-sm mb-6">CHANGE PASSWORD</h3>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password..."
              className="w-full p-3 bg-[#1a0f2e] text-white pixel-font text-sm border-4 border-[#6b4e91] mb-4 focus:outline-none focus:border-[#ff6b9d]"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password..."
              className="w-full p-3 bg-[#1a0f2e] text-white pixel-font text-sm border-4 border-[#6b4e91] mb-4 focus:outline-none focus:border-[#ff6b9d]"
            />
            {passwordError && <p style={{ color: 'red', fontFamily: 'monospace', fontSize: '12px', marginBottom: '8px' }}>{passwordError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (newPassword !== confirmPassword) {
                    setPasswordError('Passwords do not match!');
                  } else {
                    setPasswordError('');
                    setShowPasswordModal(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }
                }}
                className="flex-1 bg-[#ff6b9d] text-white pixel-font text-xs py-2 pixel-borders"
                style={{ cursor: 'pointer' }}
              >
                CONFIRM
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-[#3d2661] text-white pixel-font text-xs py-2 pixel-borders"
                style={{ cursor: 'pointer' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Switch Bank Modal */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#2d1b4e] pixel-borders border-4 border-[#6b4e91]" style={{ width: '400px', padding: '40px' }}>
            <h3 className="text-white pixel-font text-sm mb-6">SWITCH BANK ACCOUNT</h3>
            <p className="text-[#c7b8ea] text-xs mb-6">Connect a new bank account to replace your current one.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBankModal(false)}
                className="flex-1 bg-[#a78bfa] text-white pixel-font text-xs py-2 pixel-borders"
                style={{ cursor: 'pointer' }}
              >
                CONNECT NEW BANK
              </button>
              <button
                onClick={() => setShowBankModal(false)}
                className="flex-1 bg-[#3d2661] text-white pixel-font text-xs py-2 pixel-borders"
                style={{ cursor: 'pointer' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}