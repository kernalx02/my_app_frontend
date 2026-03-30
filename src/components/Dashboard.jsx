import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('members');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');

  const API_URL = "https://api-myapp.onrender.com";
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const refreshData = async () => {
    try {
      const [uRes, pRes, bRes] = await Promise.all([
        fetch(`${API_URL}/api/users`),
        fetch(`${API_URL}/api/posts`),
        fetch(`${API_URL}/api/blacklist`)
      ]);
      setUsers(await uRes.json());
      setPosts(await pRes.json());
      const bData = await bRes.json();
      setBlacklist(bData.map(b => b.email));
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    }
  };

  const canManage = (targetUser) => {
    if (currentUser.role === 'owner') return currentUser._id !== targetUser._id;
    if (currentUser.role === 'admin') return targetUser.role === 'user';
    return false;
  };

  const toggleRole = async (u) => {
    if (!canManage(u)) return;
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    await fetch(`${API_URL}/api/users/${u._id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    refreshData();
  };

  const banUser = async (u) => {
    if (!canManage(u) || !window.confirm(`Ban ${u.username}?`)) return;
    await fetch(`${API_URL}/api/blacklist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: u.email, userId: u._id })
    });
    refreshData();
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post permanently?")) return;
    await fetch(`${API_URL}/api/posts/${id}`, { method: 'DELETE' });
    refreshData();
  };

  const handleEditPost = async (id) => {
    await fetch(`${API_URL}/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent })
    });
    setEditingPost(null);
    refreshData();
  };

  const deleteComment = async (postId, index) => {
    if (!window.confirm("Remove this comment?")) return;
    await fetch(`${API_URL}/api/posts/${postId}/comment/${index}`, { method: 'DELETE' });
    refreshData();
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

      {/* MAIN CONTENT */}
      <div className="flex-1 w-full glass-card p-8 min-h-[600px]">
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-white">Members</h2>
              <input 
                type="text" placeholder="Search..." className="bg-white/5 border border-white/10 rounded-lg text-white px-4 py-2 text-xs outline-none focus:border-cyan-500"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid gap-4">
              {users.filter(u => u.username?.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                <div key={u._id} className="flex items-center justify-between p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <img src={u.profilePic || '/default_pic.jpg'} className="w-10 h-10 rounded-full object-cover border border-cyan-500/20" alt="" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white leading-none">{u.username}</p>
                        {u.role === 'owner' && <span className="text-[8px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/30 font-black">OWNER</span>}
                        {u.role === 'admin' && <span className="text-[8px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/30 font-black">ADMIN</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {canManage(u) ? (
                      <>
                        <button onClick={() => toggleRole(u)} className="text-[9px] font-black border border-white/10 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 uppercase">
                          {u.role === 'admin' ? 'Demote' : 'Promote'}
                        </button>
                        <button onClick={() => banUser(u)} className="text-[9px] font-black bg-red-500/10 text-red-400 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all uppercase">
                          Ban
                        </button>
                      </>
                    ) : <span className="text-[9px] font-black text-slate-700 uppercase px-3 tracking-widest">Protected</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white mb-8">Post Moderation</h2>
            {posts.map(p => (
              <div key={p._id} className="p-5 bg-slate-900/40 border border-white/5 rounded-2xl space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {editingPost === p._id ? (
                      <div className="flex gap-2">
                        <input className="bg-black/40 border border-cyan-500/50 rounded-lg p-2 text-sm text-white flex-1 outline-none" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                        <button onClick={() => handleEditPost(p._id)} className="bg-cyan-500 text-black px-4 rounded-lg font-black text-[10px]">SAVE</button>
                      </div>
                    ) : (
                      <p className="text-slate-300 text-sm">"{p.content}"</p>
                    )}
                    <p className="text-[10px] font-bold text-slate-600 uppercase mt-2">Author: {p.username} | ID: {p._id}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => { setEditingPost(p._id); setEditContent(p.content); }} className="text-[10px] font-black text-cyan-500 hover:underline">EDIT</button>
                    <button onClick={() => deletePost(p._id)} className="text-[10px] font-black text-red-400 hover:underline">DELETE</button>
                  </div>
                </div>
                {p.comments?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Comments ({p.comments.length})</p>
                    {p.comments.map((c, i) => (
                      <div key={i} className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                        <p className="text-[11px] text-slate-400"><b className="text-cyan-600">{c.username}:</b> {c.text}</p>
                        <button onClick={() => deleteComment(p._id, i)} className="text-[9px] font-black text-red-900 hover:text-red-500 transition-colors uppercase">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'blacklist' && (
          <div className="space-y-6 text-white">
            <h2 className="text-3xl font-black">Blacklist</h2>
            <div className="grid gap-2">
              {blacklist.length === 0 ? <p className="text-slate-600 italic">No one is banned... yet.</p> : 
                blacklist.map(email => (
                <div key={email} className="flex justify-between items-center p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <span className="text-xs font-mono text-red-400">{email}</span>
                  <button onClick={async () => {
                    await fetch(`${API_URL}/api/blacklist/${email}`, { method: 'DELETE' });
                    refreshData();
                  }} className="text-[10px] font-black text-slate-400 hover:text-white transition-colors">UNBAN</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}