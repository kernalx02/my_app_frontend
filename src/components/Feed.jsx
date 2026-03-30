import React from 'react';

export default function Feed({ posts, handleVote, currentUser }) {
  // Sort posts by popularity (Net Score)
  const sortedPosts = [...posts].sort((a, b) => {
    const scoreA = (a.ups?.length || 0) - (a.downs?.length || 0);
    const scoreB = (b.ups?.length || 0) - (b.downs?.length || 0);
    return scoreB - scoreA;
  });

  return (
    <div className="space-y-8 max-w-2xl mx-auto px-4">
      {/* Added animate-fade-in here */}
      <h2 className="text-3xl font-bold mb-10 text-center text-cyan-400 uppercase tracking-widest animate-fade-in">
        Community Feed
      </h2>
      
      {posts.length === 0 ? (
        <p className="text-center text-slate-500 italic animate-fade-in">No posts yet. Start the conversation!</p>
      ) : (
        sortedPosts.map((post, index) => {
          const isUpvoted = post.ups?.includes(currentUser?.username);
          const isDownvoted = post.downs?.includes(currentUser?.username);
          const score = (post.ups?.length || 0) - (post.downs?.length || 0);

          return (
            <div 
              key={post.id} 
              /* Added animate-slide-up and stagger delay */
              className="glass-card p-6 flex flex-col gap-4 border border-white/5 shadow-2xl bg-white/5 rounded-3xl animate-slide-up"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                opacity: 0, 
                animationFillMode: 'forwards' 
              }}
            >
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center overflow-hidden font-bold text-xs text-cyan-400">
                  {post.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">{post.username}</span>
              </div>

              <p className="text-slate-200 text-lg leading-relaxed">{post.content}</p>

              {post.image && (
                <div className="flex justify-center">
                  <img 
                    src={post.image} 
                    style={{ width: post.width ? `${post.width}px` : '100%' }} 
                    className="rounded-2xl border border-white/10 shadow-lg object-contain"
                    alt="Post content" 
                  />
                </div>
              )}

              <div className="flex justify-end items-center pt-2">
                <div className="flex items-center gap-4 bg-black/40 px-5 py-2 rounded-full border border-white/5">
                  <button 
                    className={`transition-all font-bold ${isUpvoted ? 'text-orange-500 scale-125' : 'text-slate-500 hover:text-orange-400'}`} 
                    onClick={() => handleVote(post.id, 'up')}
                  >
                    ▲
                  </button>
                  
                  <span className={`font-mono font-bold text-sm ${isUpvoted ? 'text-orange-500' : isDownvoted ? 'text-indigo-400' : 'text-white'}`}>
                    {score}
                  </span>
                  
                  <button 
                    className={`transition-all font-bold ${isDownvoted ? 'text-indigo-500 scale-125' : 'text-slate-500 hover:text-indigo-400'}`} 
                    onClick={() => handleVote(post.id, 'down')}
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}