import React from 'react';

export default function NavbarLogged({ setPage, currentPage, onLogout }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const username = currentUser.username || 'User';
  const profilePic = currentUser.profilePic || '/default_pic.jpg';
  const role = currentUser.role || 'user';

  // Permissions check
  const hasAccess = role === 'admin' || role === 'owner';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <nav className="navbar w-full max-w-6xl px-8 py-3 rounded-2xl grid grid-cols-3 items-center border border-white/5 shadow-2xl backdrop-blur-md bg-black/20">
        
        {/* Left: Feed & Creation */}
        <div className="flex items-center gap-8 justify-start">
          <button 
            onClick={() => setPage('posts')} 
            className={`text-[10px] font-black tracking-[0.2em] transition-all hover:text-cyan-400 
              ${currentPage === 'posts' ? 'text-cyan-400' : 'text-slate-400'}`}
          >
            FEED
          </button>

          {/* PLUS ICON: Sized to match Logo (h-10) */}
          {hasAccess && (
            <button 
              onClick={() => setPage('post')} 
              className="flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              <img 
                src="/plus.png" 
                alt="Create" 
                className={`h-10 w-auto object-contain transition-all 
                  ${currentPage === 'post' 
                    ? 'brightness-125 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
                    : 'opacity-70 hover:opacity-100 hover:brightness-110'}`} 
              />
            </button>
          )}
        </div>

        {/* Center: Brand Logo (Home) */}
        <div className="flex justify-center">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-10 w-auto cursor-pointer hover:opacity-80 transition-all hover:scale-105 active:scale-95" 
            onClick={() => setPage('landing')}
          />
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex justify-end gap-4 items-center">
          
          {hasAccess && (
            <button 
              onClick={() => setPage('dashboard')}
              className={`text-[10px] font-black tracking-widest px-4 py-2 rounded-lg transition-all border
                ${currentPage === 'dashboard' 
                  ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                  : 'text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/10'}`}
            >
              DASHBOARD
            </button>
          )}

          <div 
            className={`flex items-center gap-3 cursor-pointer group transition-all ${currentPage === 'profile' ? 'scale-105' : ''}`} 
            onClick={() => setPage('profile')}
          >
            <div className="text-right hidden sm:block">
              <p className={`text-[8px] font-black uppercase tracking-tighter leading-none mb-1
                ${role === 'owner' ? 'text-yellow-500' : role === 'admin' ? 'text-cyan-400' : 'text-slate-500'}`}>
                {role}
              </p>
              <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors uppercase leading-none">
                {username}
              </p>
            </div>
            
            <img 
              src={profilePic} 
              className={`w-9 h-9 rounded-full border-2 object-cover transition-all shadow-lg 
                ${currentPage === 'profile' ? 'border-cyan-400' : 'border-cyan-500/30'}`} 
              alt="Profile" 
            />
          </div>
          
          <button 
            onClick={onLogout} 
            className="text-[10px] font-black text-red-400/40 hover:text-red-400 uppercase pl-4 border-l border-white/5 transition-colors tracking-widest"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}