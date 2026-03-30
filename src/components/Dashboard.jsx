import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('members');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Get current logged-in user to check permissions
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setUsers(JSON.parse(localStorage.getItem('users') || '[]'));
    setPosts([...JSON.parse(localStorage.getItem('posts') || '[]')].reverse());
    setBlacklist(JSON.parse(localStorage.getItem('blacklist') || '[]'));
  };

  const sync = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage'));
    refreshData();
  };

  /**
   * HIERARCHY CHECK
   * Returns true if the logged-in user has power over the target user.
   */
  const canManage = (targetUser) => {
    if (currentUser.role === 'owner') {
      // Owner can manage everyone except themselves
      return currentUser.id !== targetUser.id;
    }
    if (currentUser.role === 'admin') {
      // Admins can ONLY manage regular users
      return targetUser.role === 'user';
    }
    return false;
  };

  const toggleRole = (u) => {
    if (!canManage(u)) return;

    const updatedUsers = users.map(user => {
      if (user.id === u.id) {
        // Simple swap: if admin -> user, if user -> admin
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        return { ...user, role: newRole };
      }
      return user;
    });
    sync('users', updatedUsers);
  };

  const banUser = (u) => {
    if (!canManage(u)) return;

    const newBlacklist = [...blacklist, u.email.toLowerCase()];
    const remainingUsers = users.filter(user => user.id !== u.id);
    sync('blacklist', newBlacklist);
    sync('users', remainingUsers);
  };

  const deletePost = (id) => {
    const remainingPosts = JSON.parse(localStorage.getItem('posts') || '[]').filter(p => p.id !== id);
    sync('posts', remainingPosts);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 fade-in items-start">
      
      {/* SIDEBAR */}
      <aside className="w-full lg:w-64 glass-card p-6 flex flex-col gap-2 sticky top-40">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-2">Management</p>
        {['members', 'posts', 'blacklist'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
              ${activeTab === tab ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:bg-white/5'}`}
          >
            {tab}
          </button>
        ))}
      </aside>

      {/* MAIN PANEL */}
      <div className="flex-1 w-full glass-card p-8 min-h-[600px]">
        
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl font-black text-white">Members</h2>
              <input 
                type="text" 
                placeholder="Search users..." 
                className="input max-w-xs py-2 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid gap-4">
              {users.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                <div key={u.id} className="flex items-center justify-between p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <img src={u.profilePic || '/default_pic.jpg'} className="w-10 h-10 rounded-full object-cover border border-cyan-500/20" alt="" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white leading-none">{u.username}</p>
                        {u.role === 'owner' && <span className="text-[8px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/30 font-black uppercase">Owner</span>}
                        {u.role === 'admin' && <span className="text-[8px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/30 font-black uppercase">Admin</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {canManage(u) ? (
                      <>
                        <button 
                          onClick={() => toggleRole(u)}
                          className="text-[9px] font-black border border-white/10 px-3 py-2 rounded-lg hover:bg-white/5 uppercase tracking-widest text-slate-300"
                        >
                          {u.role === 'admin' ? 'Demote' : 'Promote'}
                        </button>
                        <button 
                          onClick={() => banUser(u)}
                          className="text-[9px] font-black bg-red-500/10 text-red-400 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest"
                        >
                          Ban
                        </button>
                      </>
                    ) : (
                      <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest px-3">Protected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* POSTS & BLACKLIST TABS REMAIN THE SAME AS PREVIOUS VERSION */}
        {activeTab === 'posts' && (
           <div className="space-y-6">
             <h2 className="text-3xl font-black text-white mb-8">Feed Moderation</h2>
             {posts.map(p => (
               <div key={p.id} className="p-5 bg-slate-900/40 border border-white/5 rounded-2xl flex justify-between items-start">
                 <div className="flex-1">
                   <p className="text-slate-300 text-sm italic mb-2">"{p.content}"</p>
                   <p className="text-[10px] font-bold text-slate-600 uppercase">Post ID: {p.id}</p>
                 </div>
                 <button onClick={() => deletePost(p.id)} className="text-[10px] font-black text-red-400 hover:underline">DELETE</button>
               </div>
             ))}
           </div>
        )}

        {activeTab === 'blacklist' && (
          <div className="space-y-6 text-white">
            <h2 className="text-3xl font-black">Blacklist</h2>
            <div className="grid gap-2">
              {blacklist.map(email => (
                <div key={email} className="flex justify-between items-center p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <span className="text-xs font-mono text-red-400">{email}</span>
                  <button onClick={() => sync('blacklist', blacklist.filter(e => e !== email))} className="text-[10px] font-black text-slate-400 hover:text-white">REMOVE</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}