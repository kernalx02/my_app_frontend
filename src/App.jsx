import React, { useState } from 'react';

export default function Login({ setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = "https://api-myapp.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(),
          password: password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // 1. Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(data));
      
      // 2. FIX: Dispatch event so App.jsx's handleSync listener catches it immediately
      window.dispatchEvent(new Event('storage'));

      setLoggedInUsername(data.username);
      setIsSuccess(true); 

    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto glass-card p-12 mt-10 animate-fade-in text-center flex flex-col items-center border border-white/5 bg-[#1e293b]/50 backdrop-blur-xl rounded-[2rem]">
        <div className="p-6 mb-6 rounded-full bg-cyan-500/10 ring-2 ring-cyan-500/20 shadow-inner">
          {/* FIX: Absolute path for public folder image */}
          <img 
            src="/correct_login.png" 
            alt="Success" 
            className="w-24 h-24 object-contain" 
          />
        </div>
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Welcome Back!</h2>
        <p className="text-slate-400 mt-2 mb-8 font-medium">
          Authorized as <span className="text-cyan-500">{loggedInUsername}</span>
        </p>
        <button 
          onClick={() => setPage('posts')} // FIX: Now correctly takes you to the Feed
          className="bg-cyan-500 hover:bg-cyan-400 text-black w-full py-4 text-xs tracking-widest font-black uppercase rounded-xl transition-all shadow-lg shadow-cyan-500/20"
        >
          CONTINUE TO FEED
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto glass-card p-12 mt-10 animate-fade-in border border-white/5 bg-[#1e293b]/50 backdrop-blur-xl rounded-[2rem]">
      <h2 className="text-3xl font-black mb-2 text-white italic uppercase tracking-tighter">Log In</h2>
      <p className="text-slate-500 text-sm mb-8 font-medium uppercase tracking-widest">Identify Protocol Required</p>
      
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-6 text-[10px] font-black rounded-xl flex items-center gap-2">
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Email Address</label>
          <input 
            type="email" 
            placeholder="name@domain.com"
            className="w-full p-4 mt-1 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500 transition-all font-bold" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Password</label>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full p-4 mt-1 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500 transition-all font-bold" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`bg-cyan-500 hover:bg-cyan-400 text-black w-full py-4 mt-4 text-xs tracking-[0.2em] font-black uppercase shadow-lg shadow-cyan-500/10 rounded-xl transition-all transform active:scale-[0.98] ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'Verifying Credentials...' : 'Authorize Login'}
        </button>
        
        <p className="text-center text-[10px] text-slate-500 mt-6 uppercase font-bold tracking-tighter">
          No ID yet? <span 
            className="underline cursor-pointer text-cyan-500 hover:text-cyan-400 transition-colors" 
            onClick={() => setPage('signup')} 
          >Sign Up</span>
        </p>
      </form>
    </div>
  );
}