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

const MOCK_POSTS = [
  { id: 1, username: "Admin", content: "Welcome to the Club 2026.", ups: [], downs: [], image: null },
];

export default function App() {
  const [page, setPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) setCurrentUser(JSON.parse(user));
    refreshPosts();
  }, []);

  const refreshPosts = () => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      localStorage.setItem('posts', JSON.stringify(MOCK_POSTS));
      setPosts(MOCK_POSTS);
    }
  };

  const handleVote = (id, type) => {
    if (!currentUser) return alert("Please log in to vote!");
    const userId = currentUser.username;

    const updatedPosts = posts.map(p => {
      if (p.id === id) {
        // Ensure we are working with arrays
        let ups = Array.isArray(p.ups) ? p.ups : [];
        let downs = Array.isArray(p.downs) ? p.downs : [];

        if (type === 'up') {
          if (ups.includes(userId)) {
            ups = ups.filter(name => name !== userId); // Remove vote
          } else {
            ups = [...ups, userId]; // Add vote
            downs = downs.filter(name => name !== userId); // Clear opposite
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
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
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
        {page === 'posts' && <Feed posts={posts} handleVote={handleVote} currentUser={currentUser} />}
        {page === 'post' && <Post setPage={setPage} onPostCreated={refreshPosts} />}
        {page === 'login' && <Login setPage={setPage} />}
        {page === 'signup' && <Signup setPage={setPage} />}
        {page === 'profile' && <Profile />}
        {page === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}