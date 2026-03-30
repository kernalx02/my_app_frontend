import React, { useState } from 'react';

export default function Feed({ posts, handleVote, currentUser, handleComment, handleCommentLike }) {
  const [commentTexts, setCommentTexts] = useState({});

  const sortedPosts = [...posts].sort((a, b) => {
    const scoreA = (a.ups?.length || 0) - (a.downs?.length || 0);
    const scoreB = (b.ups?.length || 0) - (b.downs?.length || 0);
    return scoreB - scoreA;
  });

  const onCommentSubmit = (e, postId) => {
    e.preventDefault();
    if (!commentTexts[postId]?.trim()) return;
    handleComment(postId, commentTexts[postId]);
    setCommentTexts({ ...commentTexts, [postId]: '' });
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto px-4 pb-20">
      <h2 className="text-3xl font-bold mb-10 text-center text-cyan-400 uppercase tracking-widest animate-fade-in">
        Community Feed
      </h2>
      
      {posts.length === 0 ? (
        <p className="text-center text-slate-500 italic animate-fade-in">No posts yet. Start the conversation!</p>
      ) : (
        sortedPosts.map((post, index) => {
          const postId = post._id || post.id;
          const isUpvoted = post.ups?.includes(currentUser?.username);
          const isDownvoted = post.downs?.includes(currentUser?.username);
          const score = (post.ups?.length || 0) - (post.downs?.length || 0);

          return (
            <div 
              key={postId} 
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
                    className="rounded-2xl border border-white/10 shadow-lg object-contain w-full"
                    alt="Post content" 
                  />
                </div>
              )}

              <div className="flex justify-end items-center pt-2 border-b border-white/5 pb-4">
                <div className="flex items-center gap-4 bg-black/40 px-5 py-2 rounded-full border border-white/5">
                  <button 
                    className={`transition-all font-bold ${isUpvoted ? 'text-orange-500 scale-125' : 'text-slate-500 hover:text-orange-400'}`} 
                    onClick={() => handleVote(postId, 'up')}
                  > ▲ </button>
                  <span className={`font-mono font-bold text-sm ${isUpvoted ? 'text-orange-500' : isDownvoted ? 'text-indigo-400' : 'text-white'}`}>
                    {score}
                  </span>
                  <button 
                    className={`transition-all font-bold ${isDownvoted ? 'text-indigo-500 scale-125' : 'text-slate-500 hover:text-indigo-400'}`} 
                    onClick={() => handleVote(postId, 'down')}
                  > ▼ </button>
                </div>
              </div>

              <div className="mt-2 space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {post.comments?.map((comment, cIndex) => {
                    // FIX: Ensure likes is an array to prevent .includes crash
                    const likesArr = comment.likes || [];
                    const isLiked = likesArr.includes(currentUser?.username);
                    return (
                      <div key={cIndex} className="bg-white/5 rounded-2xl p-3 border border-white/5 flex justify-between items-start animate-fade-in">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black uppercase text-cyan-500 tracking-tighter">{comment.username}</span>
                          <p className="text-sm text-slate-300">{comment.text}</p>
                        </div>
                        <button 
                          onClick={() => handleCommentLike(postId, cIndex)}
                          className={`text-xs transition-all ${isLiked ? 'text-red-500 scale-110' : 'text-slate-600 hover:text-red-400'}`}
                        >
                          {isLiked ? '❤️' : '🤍'} <span className="ml-1 font-mono">{likesArr.length}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={(e) => onCommentSubmit(e, postId)} className="flex gap-2 mt-4">
                  <input 
                    type="text"
                    placeholder="Write a comment..."
                    className="input-mini bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white w-full outline-none focus:border-cyan-500/50 transition-colors"
                    value={commentTexts[postId] || ''}
                    onChange={(e) => setCommentTexts({...commentTexts, [postId]: e.target.value})}
                  />
                  <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[10px] px-4 rounded-xl uppercase tracking-widest transition-all">
                    Post
                  </button>
                </form>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}