import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

import toast from 'react-hot-toast';
export default function Settings() {
  const [session, setSession] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [usdtAddress, setUsdtAddress] = useState('');
  const [cryptoAddresses, setCryptoAddresses] = useState({
    usdt_address: '',
    usdt_erc20_address: '',
    btc_address: '',
    eth_address: '',
    bnb_address: '',
    xrp_address: '',
    sol_address: '',
    doge_address: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('cb_admin_session');
    if (saved) {
      setSession(JSON.parse(saved));
    }
    fetchUsdtAddress();
  }, []);

  const fetchUsdtAddress = async () => {
    try {
      const { data, error } = await supabase
        .from('cb_deposit_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (!error && data) {
        setUsdtAddress(data.usdt_address || '');
        setCryptoAddresses({
          usdt_address:       data.usdt_address       || '',
          usdt_erc20_address: data.usdt_erc20_address || '',
          btc_address:        data.btc_address        || '',
          eth_address:        data.eth_address        || '',
          bnb_address:        data.bnb_address        || '',
          xrp_address:        data.xrp_address        || '',
          sol_address:        data.sol_address        || '',
          doge_address:       data.doge_address       || '',
        });
      }
    } catch (err) {
      console.error('Error fetching deposit settings:', err);
    }
  };

  const handlePhotoUpdate = async (e) => {
    e.preventDefault();
    if (!session || !photoUrl) return;

    setLoading(true);
    try {
      const table = session.role === 'Staff' ? 'cb_staff' : 'cb_admins';
      const matchCol = session.role === 'Staff' ? 'email' : 'email';

      const { error } = await supabase
        .from(table)
        .update({ profile_photo: photoUrl })
        .eq(matchCol, session.email);

      if (error) {
        if (error.code === '42703') {
           toast.error("Database Schema Error: The profile_photo column does not exist. Please contact support or run the schema update.");
        } else {
           toast.error("Failed to update profile photo: " + error.message);
        }
      } else {
        toast.success("Profile photo updated successfully!");
        setPhotoUrl('');
      }
    } catch (err) {
      toast.error("Error updating profile photo.");
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) {
        toast.error("Failed to update password: " + error.message);
      } else {
        toast("Password updated securely!");
        setPasswordForm({ newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error("Error updating password.");
    }
    setLoading(false);
  };

  const handleUsdtUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('cb_deposit_settings')
        .update(cryptoAddresses)
        .eq('id', 1);

      if (error) {
        toast.error('Failed to update deposit addresses: ' + error.message);
      } else {
        toast.success('All crypto deposit addresses updated successfully!');
      }
    } catch (err) {
      toast.error('Error updating deposit settings.');
    }
    setLoading(false);
  };

  if (!session) return <div>Loading...</div>;

  return (
    <div className="admin-page-container scale-up">
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <h3 className="section-title" style={{ marginBottom: 12 }}>Operator Security Settings</h3>
        <p style={{ fontSize: 13, color: 'var(--text-admin-light)' }}>
          Update your secure access credentials and operational profile picture.
        </p>
      </div>

      <div className="settings-grid">
        <div className="admin-card">
          <h4 style={{ fontSize: 14, marginBottom: 12, color: 'var(--text-admin-dark)' }}>Update Profile Photo</h4>
          <form onSubmit={handlePhotoUpdate} className="settings-form">
            <div className="form-group-admin">
              <label>Image URL</label>
              <input 
                type="url" 
                placeholder="https://example.com/avatar.jpg" 
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-admin-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Save Avatar'}
            </button>
          </form>
        </div>

        <div className="admin-card">
          <h4 style={{ fontSize: 14, marginBottom: 12, color: 'var(--text-admin-dark)' }}>Update Access Password</h4>
          <form onSubmit={handlePasswordChange} className="settings-form">
            <div className="form-group-admin">
              <label>New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                required
              />
            </div>
            <div className="form-group-admin">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn-admin-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {session.role === 'Owner' && (
          <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
            <h4 style={{ fontSize: 14, marginBottom: 6, color: 'var(--text-admin-dark)' }}>Crypto Deposit Addresses (Owner Only)</h4>
            <p style={{ fontSize: 11, color: 'var(--text-admin-light)', marginBottom: 16 }}>Configure the receiving wallet addresses for each supported cryptocurrency. Leave blank to hide that network from users.</p>
            <form onSubmit={handleUsdtUpdate} className="settings-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { key: 'usdt_address',       label: '₮ USDT — TRC20',    placeholder: 'TY3N9dSk8s...' },
                  { key: 'usdt_erc20_address', label: '₮ USDT — ERC20',    placeholder: '0xAbc123...' },
                  { key: 'btc_address',        label: '₿ BTC — Bitcoin',   placeholder: 'bc1q...' },
                  { key: 'eth_address',        label: 'Ξ ETH — Ethereum',  placeholder: '0xAbc123...' },
                  { key: 'bnb_address',        label: 'B BNB — BEP20',     placeholder: '0xAbc123...' },
                  { key: 'xrp_address',        label: 'X XRP — Ripple',    placeholder: 'rN7n3473...' },
                  { key: 'sol_address',        label: '◎ SOL — Solana',    placeholder: '5FHwkrdxk...' },
                  { key: 'doge_address',       label: 'Ð DOGE — Dogecoin', placeholder: 'D7Y3hX...' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="form-group-admin">
                    <label>{label}</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={cryptoAddresses[key]}
                      onChange={e => setCryptoAddresses(prev => ({ ...prev, [key]: e.target.value }))}
                      id={`input-addr-${key}`}
                    />
                  </div>
                ))}
              </div>
              <button type="submit" className="btn-admin-primary" disabled={loading} style={{ maxWidth: 200 }}>
                {loading ? 'Saving...' : '💾 Save All Addresses'}
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group-admin {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group-admin label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-admin-light);
          text-transform: uppercase;
        }
        .form-group-admin input {
          height: 38px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          padding: 0 12px;
          font-size: 13px;
        }
        .form-group-admin input:focus {
          border-color: var(--color-primary);
          outline: none;
        }
        .btn-admin-primary {
          height: 38px;
          background-color: var(--color-primary);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-admin-primary:hover {
          background-color: #005fa7;
        }
        .btn-admin-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
