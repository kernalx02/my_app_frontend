import React, { useState, useEffect } from 'react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [profilePic, setProfilePic] = useState('/default_pic.jpg');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [copied, setCopied] = useState(false);

  // Update this to your real Render URL
  const API_URL = "https://api-myapp.onrender.com";

  // Load user on mount
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      setUser(currentUser);
      setNewUsername(currentUser.username);
      if (currentUser.profilePic) setProfilePic(currentUser.profilePic);
    }
  }, []);

  // --- CLOUDINARY AUTOMATIC UPLOAD ---
  const handleCloudinaryUpload = () => {
    if (!window.cloudinary) {
      setMessage({ type: 'error', text: 'Cloudinary script not loaded. Check index.html' });
      return;
    }

    window.cloudinary.openUploadWidget(
      {
        cloudName: 'dlpy314z4', 
        uploadPreset: 'profile_picture', 
        sources: ['local', 'url', 'camera'],
        showAdvancedOptions: false,
        cropping: true,
        multiple: false,
        defaultSource: 'local',
        styles: {
          palette: {
            window: '#1e293b',
            sourceBg: '#0f172a',
            windowBorder: '#0ea5e9',
            tabIcon: '#0ea5e9',
            inactiveTabIcon: '#64748b',
            menuIcons: '#0ea5e9',
            link: '#0ea5e9',
            action: '#0ea5e9',
            inProgress: '#0ea5e9',
            complete: '#22c55e',
            error: '#ef4444',
            textDark: '#000000',
            textLight: '#ffffff'
          }
        }
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          const cleanUrl = result.info.secure_url;
          setProfilePic(cleanUrl); 
          setMessage({ type: 'success', text: 'Image uploaded to cloud!' });
        }
      }
    );
  };

  const copyId = () => {
    const displayId = user._id || "ID_PENDING";
    navigator.clipboard.writeText(displayId.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- UPDATED SAVE TO DATABASE ---
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: 'Updating cloud profile...' });

    try {
      const response = await fetch(`${API_URL}/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          profilePic: profilePic
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      // Update State and Sync LocalStorage for the Navbar/Feed
      setUser(data);
      localStorage.setItem('currentUser', JSON.stringify(data));
      window.dispatchEvent(new Event('storage'));
      
      setMessage({ type: 'success', text: 'Identity Updated Successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
    
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  if (!user) return null;

  const isOwner = user.username?.toLowerCase() === "taha";
  const displayId = user._id || "ID_PENDING";

  return (
    <div className="max-w-2xl mx-auto glass-card p-12 mt-10 fade-in relative border border-white/5 bg-[#1e293b]/50 backdrop-blur-xl rounded-[2rem]">
      <div className="flex flex-col sm:flex-row items-center gap-8 mb-12">
        <div className="relative group">
          <div className={`w-32 h-32 rounded-full overflow-hidden border-4 shadow-xl transition-all ${isOwner ? 'border-cyan-500 shadow-cyan-500/20' : 'border-cyan-500/20 group-hover:border-cyan-400'}`}>
            <img 
              src={profilePic} 
              className="w-full h-full object-cover" 
              alt="Profile" 
            />
          </div>
          <div 
            onClick={handleCloudinaryUpload}
            className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all"
          >
            <span className="text-[10px] font-black text-white uppercase tracking-widest text-center px-2">Change Photo</span>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-black text-white leading-tight">
            {isOwner ? 'Owner Settings' : 'Settings'}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded ${isOwner ? 'bg-cyan-500 text-black' : 'bg-cyan-500/10 text-cyan-500'}`}>
              {user.role || 'Member'}
            </span>
            {isOwner && <span className="text-cyan-400 text-xs font-bold">✓ Verified Access</span>}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Database UUID (Permanent)</label>
          <div className="flex gap-2 mt-1">
            <input 
              type="text" 
              className="w-full p-3 rounded-xl bg-slate-900/50 text-slate-500 border border-white/5 outline-none cursor-not-allowed opacity-70 font-mono text-xs" 
              value={displayId} 
              readOnly 
            />
            <button 
              type="button" 
              onClick={copyId}
              className={`px-6 rounded-xl border border-white/10 text-[10px] font-black uppercase transition-all whitespace-nowrap
                ${copied ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'hover:bg-white/5 text-slate-400'}`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
          <input 
            type="text" 
            className="w-full p-3 mt-1 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500 transition-all font-bold" 
            value={newUsername} 
            onChange={(e) => setNewUsername(e.target.value)} 
            required
          />
        </div>

        <button 
          type="submit" 
          className="bg-cyan-500 hover:bg-cyan-400 text-black w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/10 transition-all transform active:scale-[0.98]"
        >
          Update Cloud Identity
        </button>
      </form>

      {message.text && (
        <div className={`mt-6 p-4 rounded-xl text-[10px] font-black uppercase text-center tracking-widest animate-pulse
          ${message.type === 'success' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-red-500/10 text-red-400'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}