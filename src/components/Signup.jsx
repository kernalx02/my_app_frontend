import React, { useState } from 'react';

export default function Signup({ setPage }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Your Render Backend URL
  const API_URL = "https://api-myapp.onrender.com";

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email.toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // This catches "User already exists" or server errors from your server.js
        throw new Error(data.message || "Registration failed.");
      }

      // --- SUCCESS ---
      setShowSuccess(true);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[600px] flex items-center justify-center animate-fade-in">
      {/* --- SUCCESS WINDOW --- */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl px-4 animate-fade-in">
          <div className="glass-card max-w-md w-full p-12 text-center border border-cyan-500/20 shadow-2xl">
            <div className="mb-8 flex justify-center">
              <img 
                src="/correct.png" 
                alt="Success" 
                className="w-32 h-32 object-contain animate-pulse-slow drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
              />
            </div>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Registration Sent!</h2>
            <p className="text-slate-400 mt-4 font-light text-lg leading-relaxed">
              Your profile has been added to the EPC Database. Please sign in to access the pioneer dashboard.
            </p>
            
            <button 
              onClick={() => setPage('login')}
              className="btn-cyan w-full py-4 mt-10 text-xs tracking-[0.2em] font-black uppercase shadow-xl hover:scale-105 transition-transform"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/* --- SIGNUP FORM --- */}
      <div className={`max-w-md w-full glass-card p-12 mt-10 border border-white/5 transition-all duration-700 ${showSuccess ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100'}`}>
        <h2 className="text-3xl font-black mb-2 text-white italic">Join the Club</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium uppercase tracking-widest">New Identity Protocol</p>
        
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-6 text-xs font-black rounded-xl animate-shake flex items-center gap-2">
            <span>⚠️</span> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Username</label>
            <input type="text" placeholder="johndoe" className="input mt-1" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loading} />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Email Address</label>
            <input type="email" placeholder="name@domain.com" className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Password</label>
              <input type="password" placeholder="••••••••" className="input mt-1" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Confirm</label>
              <input type="password" placeholder="••••••••" className={`input mt-1 ${confirmPassword && password !== confirmPassword ? 'border-red-500/50' : ''}`} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`btn-cyan w-full py-4 mt-4 text-xs tracking-[0.2em] font-black uppercase shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>
          
          <p className="text-center text-[10px] text-slate-500 mt-6 uppercase font-bold tracking-tighter">
            Already a member? <span className="underline cursor-pointer text-cyan-500 hover:text-cyan-400 transition-colors" onClick={() => setPage('login')}>Log In</span>
          </p>
        </form>
      </div>
    </div>
  );
}