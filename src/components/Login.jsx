import React, { useState } from 'react';

// Added { setPage } here so the component can receive the function
export default function Login({ setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    // --- BLACKLIST CHECK ---
    const blacklist = JSON.parse(localStorage.getItem('blacklist') || '[]');
    if (blacklist.includes(email.toLowerCase())) {
      setErrorMessage("ACCESS DENIED: This email is blacklisted from the EPC registry.");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = existingUsers.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (!foundUser) {
      setErrorMessage("No account found with this email.");
      return;
    }

    if (foundUser.password !== password) {
      setErrorMessage("Incorrect password. Please try again.");
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    setLoggedInUsername(foundUser.username);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto glass-card p-12 mt-10 animate-fade-in text-center flex flex-col items-center">
        <div className="p-6 mb-6 rounded-full bg-cyan-500/10 ring-2 ring-cyan-500/20 shadow-inner">
          <img src="/correct_login.png" alt="Success" className="w-24 h-24 object-contain" />
        </div>
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Welcome Back!</h2>
        <p className="text-slate-400 mt-2 mb-8 font-medium">
          Authorized as <span className="text-cyan-500">{loggedInUsername}</span>
        </p>
        <button 
          onClick={() => window.location.reload()} // Reloads to trigger App state reset to home
          className="btn-cyan w-full py-4 text-xs tracking-widest font-black uppercase"
        >
          CONTINUE TO DASHBOARD
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto glass-card p-12 mt-10 animate-fade-in border border-white/5">
      <h2 className="text-3xl font-black mb-2 text-white italic uppercase tracking-tighter">Log In</h2>
      <p className="text-slate-500 text-sm mb-8 font-medium uppercase tracking-widest">Identify Protocol Required</p>
      
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-6 text-[10px] font-black rounded-xl animate-shake flex items-center gap-2">
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Email Address</label>
          <input 
            type="email" 
            placeholder="name@domain.com" 
            className="input mt-1" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="input mt-1" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-cyan w-full py-4 mt-4 text-xs tracking-[0.2em] font-black uppercase shadow-lg">
          Authorize Login
        </button>
        
        <p className="text-center text-[10px] text-slate-500 mt-6 uppercase font-bold tracking-tighter">
          No ID yet? <span 
            className="underline cursor-pointer text-cyan-500 hover:text-cyan-400 transition-colors" 
            onClick={() => setPage('signup')} // Use lowercase 'signup' to stay consistent
          >Sign Up</span>
        </p>
      </form>
    </div>
  );
}