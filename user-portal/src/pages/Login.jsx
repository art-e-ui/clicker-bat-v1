import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import LanguageSwitcher from '../components/LanguageSwitcher';
import loginBg from '@/login.png';

import toast from 'react-hot-toast';

const COUNTRIES = [
  { code: '+213', flagCode: 'dz', name: 'Algeria' },
  { code: '+54', flagCode: 'ar', name: 'Argentina' },
  { code: '+61', flagCode: 'au', name: 'Australia' },
  { code: '+43', flagCode: 'at', name: 'Austria' },
  { code: '+973', flagCode: 'bh', name: 'Bahrain' },
  { code: '+880', flagCode: 'bd', name: 'Bangladesh' },
  { code: '+32', flagCode: 'be', name: 'Belgium' },
  { code: '+591', flagCode: 'bo', name: 'Bolivia' },
  { code: '+55', flagCode: 'br', name: 'Brazil' },
  { code: '+673', flagCode: 'bn', name: 'Brunei' },
  { code: '+855', flagCode: 'kh', name: 'Cambodia' },
  { code: '+56', flagCode: 'cl', name: 'Chile' },
  { code: '+86', flagCode: 'cn', name: 'China' },
  { code: '+57', flagCode: 'co', name: 'Colombia' },
  { code: '+53', flagCode: 'cu', name: 'Cuba' },
  { code: '+420', flagCode: 'cz', name: 'Czech Republic' },
  { code: '+45', flagCode: 'dk', name: 'Denmark' },
  { code: '+1', flagCode: 'do', name: 'Dominican Republic' },
  { code: '+593', flagCode: 'ec', name: 'Ecuador' },
  { code: '+20', flagCode: 'eg', name: 'Egypt' },
  { code: '+358', flagCode: 'fi', name: 'Finland' },
  { code: '+33', flagCode: 'fr', name: 'France' },
  { code: '+49', flagCode: 'de', name: 'Germany' },
  { code: '+30', flagCode: 'gr', name: 'Greece' },
  { code: '+502', flagCode: 'gt', name: 'Guatemala' },
  { code: '+504', flagCode: 'hn', name: 'Honduras' },
  { code: '+852', flagCode: 'hk', name: 'Hong Kong' },
  { code: '+36', flagCode: 'hu', name: 'Hungary' },
  { code: '+91', flagCode: 'in', name: 'India' },
  { code: '+62', flagCode: 'id', name: 'Indonesia' },
  { code: '+964', flagCode: 'iq', name: 'Iraq' },
  { code: '+353', flagCode: 'ie', name: 'Ireland' },
  { code: '+972', flagCode: 'il', name: 'Israel' },
  { code: '+39', flagCode: 'it', name: 'Italy' },
  { code: '+81', flagCode: 'jp', name: 'Japan' },
  { code: '+7', flagCode: 'kz', name: 'Kazakhstan' },
  { code: '+254', flagCode: 'ke', name: 'Kenya' },
  { code: '+82', flagCode: 'kr', name: 'Korea' },
  { code: '+965', flagCode: 'kw', name: 'Kuwait' },
  { code: '+856', flagCode: 'la', name: 'Laos' },
  { code: '+853', flagCode: 'mo', name: 'Macao' },
  { code: '+60', flagCode: 'my', name: 'Malaysia' },
  { code: '+52', flagCode: 'mx', name: 'Mexico' },
  { code: '+212', flagCode: 'ma', name: 'Morocco' },
  { code: '+95', flagCode: 'mm', name: 'Myanmar' },
  { code: '+977', flagCode: 'np', name: 'Nepal' },
  { code: '+31', flagCode: 'nl', name: 'Netherlands' },
  { code: '+64', flagCode: 'nz', name: 'New Zealand' },
  { code: '+505', flagCode: 'ni', name: 'Nicaragua' },
  { code: '+234', flagCode: 'ng', name: 'Nigeria' },
  { code: '+47', flagCode: 'no', name: 'Norway' },
  { code: '+968', flagCode: 'om', name: 'Oman' },
  { code: '+92', flagCode: 'pk', name: 'Pakistan' },
  { code: '+507', flagCode: 'pa', name: 'Panama' },
  { code: '+595', flagCode: 'py', name: 'Paraguay' },
  { code: '+51', flagCode: 'pe', name: 'Peru' },
  { code: '+63', flagCode: 'ph', name: 'Philippines' },
  { code: '+48', flagCode: 'pl', name: 'Poland' },
  { code: '+351', flagCode: 'pt', name: 'Portugal' },
  { code: '+974', flagCode: 'qa', name: 'Qatar' },
  { code: '+40', flagCode: 'ro', name: 'Romania' },
  { code: '+7', flagCode: 'ru', name: 'Russia' },
  { code: '+966', flagCode: 'sa', name: 'Saudi Arabia' },
  { code: '+65', flagCode: 'sg', name: 'Singapore' },
  { code: '+421', flagCode: 'sk', name: 'Slovakia' },
  { code: '+27', flagCode: 'za', name: 'South Africa' },
  { code: '+34', flagCode: 'es', name: 'Spain' },
  { code: '+94', flagCode: 'lk', name: 'Sri Lanka' },
  { code: '+46', flagCode: 'se', name: 'Sweden' },
  { code: '+41', flagCode: 'ch', name: 'Switzerland' },
  { code: '+886', flagCode: 'tw', name: 'Taiwan' },
  { code: '+66', flagCode: 'th', name: 'Thailand' },
  { code: '+216', flagCode: 'tn', name: 'Tunisia' },
  { code: '+90', flagCode: 'tr', name: 'Turkey' },
  { code: '+971', flagCode: 'ae', name: 'UAE' },
  { code: '+44', flagCode: 'gb', name: 'UK' },
  { code: '+380', flagCode: 'ua', name: 'Ukraine' },
  { code: '+598', flagCode: 'uy', name: 'Uruguay' },
  { code: '+1', flagCode: 'us', name: 'USA/Canada' },
  { code: '+998', flagCode: 'uz', name: 'Uzbekistan' },
  { code: '+58', flagCode: 've', name: 'Venezuela' },
  { code: '+84', flagCode: 'vn', name: 'Vietnam' }
];

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Country code selector state
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.code === '+1' && c.flagCode === 'us') || COUNTRIES[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const countryDropdownRef = useRef(null);

  // Click-away listener for country picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setCountryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      toast("Please enter both phone number and password.");
      return;
    }

    try {
      // Build filters for absolute, spaced, and raw telephone variants
      const rawPhone = phone.trim();
      const cleanedDigits = rawPhone.replace(/^[+]/, ''); // Strip typed '+'
      const fullPhone = `${selectedCountry.code}${cleanedDigits}`;
      const fullPhoneWithSpace = `${selectedCountry.code} ${cleanedDigits}`;

      // Build or query so the user can use any valid format
      const queryFilter = `username.eq.${fullPhone},phone.eq.${fullPhone},username.eq.${fullPhoneWithSpace},phone.eq.${fullPhoneWithSpace},username.eq.${rawPhone},phone.eq.${rawPhone}`;

      const { data: users, error } = await supabase
        .from('cb_users')
        .select('*')
        .or(queryFilter);

      if (error) {
        toast.error("Authentication error: " + error.message);
        return;
      }

      const user = users && users[0];
      if (user) {
        // Verify password
        if (user.password && user.password !== password) {
          toast("Incorrect password. Please try again.");
          return;
        }

        // Successful login: Sync session parameters in localStorage
        await supabase.from('cb_users').update({ online: 'Online' }).eq('id', user.id);
        
        localStorage.setItem('cb_username', user.username);
        localStorage.setItem('cb_balance', user.balance.toString());
        localStorage.setItem('cb_user_session', JSON.stringify({
          id: user.id,
          username: user.username,
          referredBy: user.referred_by_staff_id || 'None'
        }));
        toast(`Welcome back, ${user.username}!`);
        navigate('/home');
        return;
      }

      // If user not found in database
      toast("Account not found. Please check your credentials or register using a staff referral code first.");
    } catch (err) {
      toast.error("Sign in failed: " + err.message);
    }
  };

  return (
    <div className="login-container scale-up" style={{ backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.08) 100%), url(${loginBg})` }}>
      {/* Background blurred glowing layers for high fidelity glassmorphic effects */}
      <div className="glass-ambient-glow glow-1"></div>
      <div className="glass-ambient-glow glow-2"></div>

      {/* Upper Top Corner Language Swapper */}
      <div className="login-lang-corner">
        <LanguageSwitcher />
      </div>

      <div className="login-glass-card">
        <div className="demo-disclaimer-banner">
          <strong>⚠️ DEVELOPMENT & SIMULATION NOTICE:</strong> This website is an educational simulation platform designed solely for demonstration and software testing purposes. It is <strong>NOT</strong> affiliated with, operated by, endorsed by, or associated with Walmart Inc., Walmark, or any real-world brand. All activities, balances, orders, and matchings on this site are fully simulated, artificial, and for development validation purposes only. No real currency is involved, and no physical order fulfillment or payout services are provided.
        </div>

        <div className="login-brand-header">
          <div className="logo-badge-walmart large">
            <span className="logo-text-walmart">Walmart</span>
            <span className="logo-spark-walmart">
              <svg viewBox="0 0 100 100" width="24" height="24">
                <g transform="translate(50,50)" stroke="#FFC220" strokeWidth="15" strokeLinecap="round">
                  <line x1="0" y1="-10" x2="0" y2="-38" />
                  <line x1="0" y1="-10" x2="0" y2="-38" transform="rotate(60)" />
                  <line x1="0" y1="-10" x2="0" y2="-38" transform="rotate(120)" />
                  <line x1="0" y1="-10" x2="0" y2="-38" transform="rotate(180)" />
                  <line x1="0" y1="-10" x2="0" y2="-38" transform="rotate(240)" />
                  <line x1="0" y1="-10" x2="0" y2="-38" transform="rotate(300)" />
                </g>
              </svg>
            </span>
          </div>
          <p className="brand-tagline">Financial Enhancement In Your Pocket</p>
        </div>

        <form className="login-card-form" onSubmit={handleLogin}>
          <h3 className="form-title">Merchant Sign In</h3>

          <div className="login-form-group">
            <label>Phone Number</label>
            <div className="phone-input-wrapper" ref={countryDropdownRef}>
              <div className="country-code-selector">
                <button 
                  type="button" 
                  className="country-trigger-btn"
                  onClick={() => { setCountryDropdownOpen(!countryDropdownOpen); setCountrySearchQuery(''); }}
                >
                  <span className="country-flag-icon">
                    <img 
                      src={`https://flagcdn.com/w40/${selectedCountry.flagCode}.png`} 
                      alt="" 
                      className="real-flag-img" 
                      referrerPolicy="no-referrer"
                    />
                  </span>
                  <span className="country-code-text">{selectedCountry.code}</span>
                  <span className="country-chevron">▼</span>
                </button>
                {countryDropdownOpen && (
                  <div className="country-dropdown-list">
                    
                    <div className="country-search-box">
                      <input 
                        type="text" 
                        placeholder="Search country..." 
                        value={countrySearchQuery}
                        onChange={(e) => setCountrySearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="country-search-input"
                      />
                    </div>
                    {COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) || c.code.includes(countrySearchQuery)).map(c => (
                      <div 
                        key={c.flagCode} 
                        className="country-dropdown-item"
                        onClick={() => {
                          setSelectedCountry(c);
                          setCountryDropdownOpen(false);
                        }}
                      >
                        <span className="item-flag-icon">
                          <img 
                            src={`https://flagcdn.com/w40/${c.flagCode}.png`} 
                            alt="" 
                            className="real-flag-img" 
                            referrerPolicy="no-referrer"
                          />
                        </span>
                        <span className="country-item-title">{c.name}</span>
                        <span className="item-code">{c.code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input 
                type="tel" 
                className="phone-input-field"
                placeholder="Enter your phone number" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label>Secure Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit-btn">
            Sign In
          </button>

          <p className="register-prompt">
            Don't have an account? <span className="reg-link-inline" onClick={() => navigate('/register')}>Register here</span>
          </p>
        </form>
      </div>

      <style>{`
        .login-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 40px 16px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.08) 100%), 
                      url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          overflow: hidden;
        }

        /* Ambient lighting backplate orbs behind glass */
        .glass-ambient-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          z-index: 0;
          pointer-events: none;
        }
        .glow-1 {
          width: 300px;
          height: 300px;
          background: #0071ce;
          top: 15%;
          left: 10%;
        }
        .glow-2 {
          width: 250px;
          height: 250px;
          background: #FFC220;
          bottom: 20%;
          right: 10%;
        }

        .login-lang-corner {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 10001;
        }

        .login-glass-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.015);
          backdrop-filter: blur(10px) saturate(140%);
          -webkit-backdrop-filter: blur(10px) saturate(140%);
          border: 1px solid rgba(255, 255, 255, 0.75);
          border-radius: 24px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 15px 35px -5px rgba(0, 0, 0, 0.04);
          padding: 36px 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: cardBounce 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes cardBounce {
          0% { transform: scale(0.92) translateY(10px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        .login-brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          text-align: center;
          background: rgba(255, 255, 255, 0.02);
          padding: 16px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.55);
        }

        .brand-tagline {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          background: linear-gradient(135deg, #0071ce 0%, #d97706 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          margin: 0;
        }

        .login-card-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: transparent;
          border: none;
          padding: 0;
          box-shadow: none;
        }

        .form-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin-bottom: 4px;
          letter-spacing: -0.3px;
        }

        .login-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .login-form-group label {
          font-size: 11px;
          font-weight: 700;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .login-form-group > input {
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.45);
          background-color: rgba(255, 255, 255, 0.15);
          padding: 0 16px;
          font-size: 14px;
          color: #0f172a;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .login-form-group > input:focus {
          border-color: #0071ce;
          background-color: rgba(255, 255, 255, 0.85);
          box-shadow: 0 0 0 4px rgba(0, 113, 206, 0.15);
          outline: none;
        }

        /* Combined/nested country flag phone input wrapper styles */
        .phone-input-wrapper {
          display: flex;
          align-items: center;
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.45);
          background-color: rgba(255, 255, 255, 0.15);
          position: relative;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .phone-input-wrapper:focus-within {
          border-color: #0071ce;
          background-color: rgba(255, 255, 255, 0.85);
          box-shadow: 0 0 0 4px rgba(0, 113, 206, 0.15);
        }

        .country-code-selector {
          position: relative;
          height: 100%;
          border-right: 1px solid rgba(0, 0, 0, 0.1);
        }

        .country-trigger-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 12px;
          height: 100%;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }

        .country-flag-icon {
          width: 20px;
          height: 15px;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          border: 1px solid rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .country-flag-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .country-code-text {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .country-chevron {
          font-size: 8px;
          color: #64748b;
          margin-left: 2px;
        }

        .country-search-box {
          padding: 8px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.98);
          z-index: 2;
        }
        .country-search-input {
          width: 100%;
          padding: 6px 10px;
          font-size: 13px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          outline: none;
        }
        .country-search-input:focus {
          border-color: var(--primary-color);
        }
        .country-dropdown-list {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          width: 190px;
          max-height: 200px;
          overflow-y: auto;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
          z-index: 100;
          padding: 4px;
        }

        .country-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-size: 13px;
          color: #334155;
        }

        .country-dropdown-item:hover {
          background: rgba(0, 113, 206, 0.08);
          color: #0071ce;
        }

        .item-flag-icon {
          width: 20px;
          height: 15px;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0,0,0,0.15);
          border: 1px solid rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-flag-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .country-item-title {
          flex: 1;
          font-weight: 500;
          text-align: left;
        }

        .item-code {
          font-weight: 600;
          color: #64748b;
        }

        .phone-input-field {
          flex: 1;
          height: 100%;
          border: none !important;
          background: transparent !important;
          padding: 0 16px !important;
          font-size: 14px;
          color: #0f172a;
          box-shadow: none !important;
          outline: none !important;
        }

        .login-submit-btn {
          height: 46px;
          border-radius: 23px;
          background: linear-gradient(135deg, #0071ce 0%, #004b87 100%);
          color: white;
          font-weight: 700;
          font-size: 15px;
          box-shadow: 0 10px 20px -5px rgba(0, 113, 206, 0.3);
          margin-top: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px -5px rgba(0, 113, 206, 0.4);
          background: linear-gradient(135deg, #0080eb 0%, #00569c 100%);
        }

        .register-prompt {
          font-size: 13px;
          color: #475569;
          text-align: center;
          margin-top: 8px;
        }

        .reg-link-inline {
          color: #0071ce;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.15s;
        }

        .reg-link-inline:hover {
          color: #004b87;
          text-decoration: underline;
        }

        .demo-disclaimer-banner {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          color: #78350f;
          padding: 12px;
          border-radius: 12px;
          font-size: 11.5px;
          line-height: 1.5;
          margin-bottom: 20px;
          text-align: left;
        }
        .demo-disclaimer-banner strong {
          color: #b45309;
        }
      `}</style>
    </div>
  );
}
