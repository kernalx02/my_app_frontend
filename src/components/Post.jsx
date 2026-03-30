import React, { useState } from 'react';

export default function Post({ setPage, onPostCreated }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const API_URL = "https://api-myapp.onrender.com"; // <--- Update this to your Render URL

  // --- CLOUDINARY UPLOAD LOGIC ---
  const handleCloudinaryUpload = () => {
    if (!window.cloudinary) {
      alert("Cloudinary script not loaded. Check index.html");
      return;
    }

    window.cloudinary.openUploadWidget(
      {
        cloudName: 'dlpy314z4', 
        uploadPreset: 'posts_upload',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        cropping: true, 
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
          setImage(result.info.secure_url);
        }
      }
    );
  };

  const handleSave = async () => {
    if(!image || !caption) return alert("Please fill everything!");
    setIsSaving(true);

    const newPost = {
      username: user.username || "Guest",
      profilePic: user.profilePic || null,
      content: caption,
      image: image, 
      ups: [],
      downs: [],
      comments: []
    };

    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        if (onPostCreated) onPostCreated(); // Triggers refreshPosts in App.jsx
        setTimeout(() => {
          setPage('posts');
        }, 500);
      } else {
        alert("Failed to save to database.");
        setIsSaving(false);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Database connection failed.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fade-in max-w-6xl mx-auto py-12 px-6">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="glass-card space-y-8 p-8 bg-white/5 rounded-3xl border border-white/10">
          <h2 className="text-4xl font-bold text-white uppercase tracking-tighter">Compose Post</h2>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Message</label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-32 text-white outline-none focus:border-cyan-500 transition-all" 
              placeholder="What's the vibe?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Upload Media</label>
            <div 
              onClick={handleCloudinaryUpload}
              className="relative group border-2 border-dashed border-white/10 rounded-xl p-10 text-center hover:border-cyan-500/50 transition-all cursor-pointer"
            >
              <span className="text-slate-500 font-bold uppercase text-xs tracking-tighter">
                {image ? "✅ Image Selected" : "Choose Image"}
              </span>
            </div>
          </div>

          <button onClick={handleSave} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
            {isSaving ? 'UPLOADING...' : 'POST TO CLUB'}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
           <h3 className="text-white font-bold uppercase text-xs tracking-[0.3em] opacity-40">Live Preview</h3>
           {image ? (
             <div className="max-w-md shadow-2xl shadow-black/50 transition-all">
                <img src={image} className="w-full rounded-2xl border border-white/10" alt="Preview" />
             </div>
           ) : (
             <div className="w-64 h-64 border border-white/5 rounded-3xl flex items-center justify-center bg-white/5 italic text-slate-600 text-center p-4">
                Waiting for image...
             </div>
           )}
        </div>
      </div>
    </div>
  );
}