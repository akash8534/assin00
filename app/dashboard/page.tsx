"use client";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

export default function SocialFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  // Comment States
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch(`/api/posts?role=${user.role}&teamId=${user.teamId || 't_fb'}`)
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [user]);

  // Handle File Selection (Base64 Encoding for Local Database)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      
      // Convert the image/video to a Base64 string so it survives page reloads
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Post
  const handleCreatePost = async () => {
    if (!caption && !mediaPreview) return;

    const mediaType = mediaFile?.type.startsWith('video/') ? "VIDEO" : "IMAGE";

    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          teamId: "t_fb", 
          content: caption, 
          location: location,
          mediaUrl: mediaPreview, // Using local blob URL for the demo
          mediaType: mediaFile ? mediaType : null
        })
      });
      if (res.ok) window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // Submit Comment
  const handleComment = async (postId: string) => {
    if (!commentText.trim()) return;
    try {
      const res = await fetch('/api/posts/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, text: commentText, userId: user?.id, userName: user?.name })
      });
      if (res.ok) {
        const newComment = await res.json();
        setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p));
        setCommentText("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle React - FIXED! Now sends the postId to the database
  const handleReact = async (postId: string) => {
    try {
      const res = await fetch('/api/posts/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }) // <-- This fixes the like count!
      });
      if (res.ok) {
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
      } else {
        console.error("Database failed to update like count.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Share
  const handleShare = (post: any) => {
    if (navigator.share) {
      navigator.share({
        title: 'Gully Stars',
        text: `Check out this post from ${post.team.name}!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 pt-8 pb-24 max-w-[390px] mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black italic text-gray-900 uppercase tracking-tighter">Gullygram</h1>
        {user.role === 'CAPTAIN' && (
          <button onClick={() => setIsModalOpen(true)} className="bg-orange-600 text-white font-bold p-2 px-4 rounded-xl shadow-md">
            + Post
          </button>
        )}
      </div>

      {/* CREATE POST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-6 h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-xl">New Post</h2>
              <button onClick={() => setIsModalOpen(false)} className="font-bold text-gray-400">Cancel</button>
            </div>
            
            <textarea 
              placeholder="Write a caption..." 
              className="w-full bg-gray-50 p-4 rounded-xl mb-4 resize-none h-24 font-medium outline-none"
              value={caption} onChange={(e) => setCaption(e.target.value)}
            />
            
            <input 
              type="text" 
              placeholder="Add Location (e.g. City Park)" 
              className="w-full bg-gray-50 p-4 rounded-xl mb-4 font-medium outline-none"
              value={location} onChange={(e) => setLocation(e.target.value)}
            />

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center mb-auto relative">
              {mediaPreview ? (
                <p className="font-bold text-green-600">✅ Media Selected</p>
              ) : (
                <p className="font-bold text-gray-500">Tap to select Video or Photo</p>
              )}
              <input type="file" accept="video/*, image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
            </div>

            <button onClick={handleCreatePost} className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl mt-4">
              Share Post
            </button>
          </div>
        </div>
      )}

      {/* FEED */}
      {loading ? (
        <p className="text-center font-bold text-gray-400 animate-pulse mt-10">Loading feed...</p>
      ) : posts.length === 0 ? (
        <p className="text-center font-bold text-gray-400 mt-10">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm">
              
              {/* Post Header */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-tr from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold p-0.5">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center">{post.team?.name?.charAt(0) || "T"}</div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900 leading-tight">{post.team?.name}</p>
                    {post.location && <p className="text-[11px] text-gray-500 font-medium">{post.location}</p>}
                  </div>
                </div>
                <span className="text-gray-400 text-xl font-bold">...</span>
              </div>

              {/* Media Render */}
              {post.mediaUrl && post.mediaType === "VIDEO" && (
                <video src={post.mediaUrl} controls className="w-full max-h-[400px] object-cover bg-black" />
              )}
              {post.mediaUrl && post.mediaType === "IMAGE" && (
                <img src={post.mediaUrl} className="w-full max-h-[400px] object-cover" alt="Game Content" />
              )}

              {/* Interaction Bar */}
              <div className="p-3 flex justify-between items-center">
                <div className="flex gap-4">
                  <button onClick={() => handleReact(post.id)} className="text-2xl hover:scale-110 transition-transform">❤️</button>
                  <button onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)} className="text-2xl hover:scale-110 transition-transform">💬</button>
                  <button onClick={() => handleShare(post)} className="text-2xl hover:scale-110 transition-transform">📤</button>
                </div>
              </div>

              {/* Likes & Caption */}
              <div className="px-4 pb-2">
                <p className="font-bold text-sm mb-1">{post.likes} likes</p>
                <p className="text-sm">
                  <span className="font-bold mr-2">{post.team?.name}</span>
                  {post.content}
                </p>
              </div>

              {/* Comments Section */}
              {activeCommentPost === post.id && (
                <div className="px-4 pb-4 mt-2 border-t border-gray-50 pt-3">
                  <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                    {post.comments?.map((c: any) => (
                      <p key={c.id} className="text-xs">
                        <span className="font-bold mr-2">{c.userName}</span>{c.text}
                      </p>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Add a comment..." 
                      className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-xs outline-none"
                      value={commentText} onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button onClick={() => handleComment(post.id)} className="text-orange-600 font-bold text-xs px-2">Post</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}