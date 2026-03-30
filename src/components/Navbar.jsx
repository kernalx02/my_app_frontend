import React from 'react';

export default function Navbar({ setPage, currentPage }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <nav className="navbar w-full max-w-6xl px-8 py-3 rounded-2xl grid grid-cols-3 items-center">
        
        {/* Left: Navigation Links */}
        <div className="flex gap-6 items-center justify-start">
          <button 
            onClick={() => setPage('landing')} 
            className={`nav-link ${currentPage === 'landing' ? 'active' : ''}`}
          >
            HOME
          </button>
          <button 
            onClick={() => setPage('posts')} 
            className={`nav-link ${currentPage === 'posts' ? 'active' : ''}`}
          >
            FEED
          </button>
        </div>

        {/* Center: Brand Logo */}
        <div className="flex justify-center">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-10 w-auto cursor-pointer hover:opacity-80 transition-all hover:scale-105 active:scale-95" 
            onClick={() => setPage('landing')}
          />
        </div>

        {/* Right: Authentication Action Buttons */}
        <div className="flex justify-end gap-4 items-center">
          <button 
            onClick={() => setPage('login')} 
            className="btn-outline text-xs uppercase tracking-wider px-6"
          >
            Login
          </button>
          <button 
            onClick={() => setPage('signup')} 
            className="btn-cyan text-xs uppercase tracking-wider px-6"
          >
            Sign Up
          </button>
        </div>
      </nav>
    </header>
  );
}