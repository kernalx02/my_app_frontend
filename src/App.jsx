import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import NavbarLogged from './components/navbar_logged';
import Home from './components/Home';
import Feed from './components/Feed';
import Login from './components/Login';
import Post from './components/Post'; 
import Signup from './components/Signup';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';

export default function App() {
  const [page, setPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // --- CONFIG ---
  const API_URL = "https://api-myapp.onrender.com";

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) setCurrentUser(JSON.parse(user));
    refreshPosts();
  }, []);

  // --- DATABASE ACTIONS ---

  const refreshPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts from MongoDB:", err);
    }
  };

  const handleVote = async (id, type) => {
    if (!currentUser) return alert("Please log in to vote!");
    
    // Note: You may need a /api/posts/:id/vote route in server.js 
    // For now, this handles local state update for immediate feedback
    const userId = currentUser.username;
    const updatedPosts = posts.map(p => {
      const postId = p._id || p.id;
      if (postId === id) {
        let ups = Array.isArray(p.ups) ? p.ups : [];
        let downs = Array.isArray(p.downs) ? p.downs : [];

        if (type === 'up') {
          if (ups.includes(userId)) {
            ups = ups.filter(name => name !== userId);
          } else {
            ups = [...ups, userId];
            downs = downs.filter(name => name !== userId);
          }
        } else {
          if (downs.includes(userId)) {
            downs = downs.filter(name => name !== userId);
          } else {
            downs = [...downs, userId];
            ups = ups.filter(name => name !== userId);
          }
        }
        return { ...p, ups, downs };
      }
      return p;
    });
    setPosts(updatedPosts);
  };

  const handleComment = async (postId, text) => {
    if (!currentUser) return alert("Please log in to comment.");

    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: currentUser.username, 
          text: text 
        }),
      });

      if (response.ok) {
        refreshPosts(); // Reload posts to show the new comment
      }
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleCommentLike = async (postId, commentIndex) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/comment/${commentIndex}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username }),
      });

      if (response.ok) {
        refreshPosts(); // Reload posts to show the heart update
      }
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setPage('landing');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {currentUser ? (
        <NavbarLogged setPage={setPage} currentPage={page} onLogout={handleLogout} />
      ) : (
        <Navbar setPage={setPage} currentPage={page} />
      )}
      <main className="max-w-6xl mx-auto pt-36 px-8 pb-24">
        {page === 'landing' && <Home memberCount={posts.length * 5} />}
        
        {page === 'posts' && (
          <Feed 
            posts={posts} 
            handleVote={handleVote} 
            currentUser={currentUser} 
            handleComment={handleComment} 
            handleCommentLike={handleCommentLike} 
          />
        )}

        {page === 'post' && <Post setPage={setPage} onPostCreated={refreshPosts} />}
        {page === 'login' && <Login setPage={setPage} />}
        {page === 'signup' && <Signup setPage={setPage} />}
        {page === 'profile' && <Profile />}
        {page === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}