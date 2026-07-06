import React, { useState } from "react";
import { useDB } from "../DBContext";
import { CommunityPost } from "../types";
import { Users, ThumbsUp, MessageSquare, Plus, Send, CalendarDays, HelpCircle, Tag, Filter } from "lucide-react";

export default function CommunityPage() {
  const { posts, addPost, updatePost, likePost } = useDB();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Create post states
  const [authorName, setAuthorName] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCat, setPostCat] = useState<"rideshare" | "event" | "question">("question");
  const [showCreate, setShowCreate] = useState(false);

  const filteredPosts = posts.filter(post => 
    activeCategory === "all" || post.category === activeCategory
  );

  const handleLike = (id: string, currentLikes: number) => {
    likePost(id);
  };

  const handleJoin = (id: string, currentJoined: number = 0) => {
    updatePost(id, { joinedCount: currentJoined + 1 });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !postTitle || !postContent) return;

    addPost({
      authorName,
      authorAvatar: `https://images.unsplash.com/photo-${Math.floor(1500000000000 + Math.random() * 100000000000)}?auto=format&fit=crop&w=150&q=80`,
      title: postTitle,
      content: postContent,
      category: postCat,
      joinedCount: postCat === "rideshare" || postCat === "event" ? 1 : undefined
    });
    
    // Clear inputs
    setAuthorName("");
    setPostTitle("");
    setPostContent("");
    setShowCreate(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="text-left space-y-3 border-b border-emerald-100 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/50 rounded-full text-emerald-800 text-xs font-semibold tracking-wide font-mono">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            LNT COOPERATIVE FORUM & CHATS
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-emerald-950">
            SylhetGo Eco-Community Board
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl">
            Coordinate rideshares, sign up for forest cleanups, ask experienced guides about local tribal traditions, and share your pristine photo logs.
          </p>
        </div>

        {/* Trigger Create Post */}
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/15 flex items-center gap-1.5 sm:self-start transition-all"
        >
          <Plus className="w-4 h-4" />
          Start Discussion
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Topics" },
            { id: "rideshare", label: "🚗 Ride Shares" },
            { id: "event", label: "🌿 Cleanups & Events" },
            { id: "question", label: "❓ Questions & Etiquette" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === tab.id
                  ? "bg-emerald-950 text-white shadow-sm"
                  : "bg-emerald-50/50 text-emerald-900 hover:bg-emerald-100 border border-emerald-100/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Create Discussion Section (Collapsible) */}
      {showCreate && (
        <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-[2rem] text-left max-w-2xl mx-auto space-y-4 animate-in slide-in-from-top duration-300">
          <h3 className="font-display font-bold text-base text-emerald-950 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-600" />
            Launch a Sustainable Conversation
          </h3>

          <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">Your Name / Handle</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Tanvir Chowdhury"
                  className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">Category Type</label>
                <select
                  value={postCat}
                  onChange={(e) => setPostCat(e.target.value as any)}
                  className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="question">Question & Advice</option>
                  <option value="rideshare">Rideshare Coordination</option>
                  <option value="event">Eco Cleanup / Event</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">Thread Title</label>
              <input
                type="text"
                required
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Make it specific and eco-focused..."
                className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-sm font-medium focus:outline-none focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">Message Body</label>
              <textarea
                required
                rows={4}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share coordinates, details, or lists..."
                className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:ring-1"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                Publish Thread
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-emerald-50/10 rounded-3xl border border-dashed border-emerald-200">
          <p className="text-gray-500 text-sm font-semibold">No discussions posted under this filter category.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start gap-4 text-left group hover:border-emerald-200 transition-all"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-emerald-50 flex-shrink-0 border border-emerald-100">
                <img 
                  src={post.authorAvatar} 
                  alt={post.authorName} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Core thread layout */}
              <div className="space-y-2 flex-1 w-full">
                
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-950 font-display">{post.authorName}</span>
                    <span className="text-[10px] text-gray-400 font-semibold font-mono">{post.timestamp}</span>
                  </div>

                  {/* Category Pill */}
                  <span className={`text-[9px] font-extrabold uppercase font-mono px-2 py-0.5 rounded ${
                    post.category === "rideshare" 
                      ? "bg-teal-100 text-teal-800" 
                      : post.category === "event"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {post.category}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-emerald-950">
                  {post.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Engagement / Joins Actions */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-50 mt-4 text-[11px] font-mono">
                  
                  {/* Left stats */}
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleLike(post.id, post.likes)}
                      className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-600 transition-colors font-bold"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.likes} Likes</span>
                    </button>

                    <span className="flex items-center gap-1.5 text-gray-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.commentsCount} comments</span>
                    </span>
                  </div>

                  {/* Right Event RSVP */}
                  {(post.category === "rideshare" || post.category === "event") && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-bold">
                        {post.joinedCount || 0} RSVPs logged
                      </span>
                      <button
                        onClick={() => handleJoin(post.id, post.joinedCount)}
                        className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-1 rounded-lg text-[10px] font-bold border border-emerald-100/40 transition-all"
                      >
                        {post.category === "rideshare" ? "🚗 Split Ride" : "🌿 RSVP Event"}
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
