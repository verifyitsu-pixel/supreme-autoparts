import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
import { Star, AlertCircle, Loader2, Trash2, Edit2, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function Reviews() {
  const { getToken, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", rating: 5 });
  const [filter, setFilter] = useState<"all" | "my">("all");

  useEffect(() => {
    if (!isAuthenticated) { setLocation("/login"); return; }
    fetchReviews();
  }, [isAuthenticated]);

  const fetchReviews = async () => {
    setIsLoading(true); setError(null);
    try {
      const res = await fetch("/api/reviews", { headers: { Authorization: `Bearer ${getToken()}` } });
      if (!res.ok) { if (res.status === 401) { setLocation("/login"); return; } throw new Error("Failed to load reviews"); }
      setReviews(await res.json());
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load reviews"); }
    finally { setIsLoading(false); }
  };

  const deleteReview = async (id: string) => {
    try {
      await fetch(`/api/reviews/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch {}
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditForm({ title: review.title, content: review.content, rating: review.rating });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`/api/reviews/${editingId}`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(editForm),
      });
      if (res.ok) { setEditingId(null); fetchReviews(); }
    } catch {}
  };

  const myReviews = reviews.filter(r => !r.userId || isAuthenticated);

  const displayed = filter === "my" ? myReviews : reviews;

  const renderStars = (rating: number, interactive?: boolean, onChange?: (r: number) => void) => (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button" onClick={() => interactive && onChange?.(i)} className={interactive ? "" : ""}>
          <Star size={interactive ? 24 : 16} className={`${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} ${interactive ? "hover:scale-110 transition-transform" : ""}`} />
        </button>
      ))}
    </div>
  );

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#E42933]" size={32} /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 mb-8">
            <Star className="text-[#E42933]" size={32} fill="currentColor" /> My Reviews
          </h1>

          <div className="flex gap-2 mb-6">
            <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === "all" ? "bg-[#E42933] text-white" : "bg-white border border-gray-300 text-gray-700"}`}>All Reviews ({reviews.length})</button>
            <button onClick={() => setFilter("my")} className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === "my" ? "bg-[#E42933] text-white" : "bg-white border border-gray-300 text-gray-700"}`}>My Reviews ({myReviews.length})</button>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"><AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} /><p className="text-red-700 text-sm font-medium">{error}</p></div>}

          {displayed.length === 0 ? (
            <div className="text-center py-20">
              <Star className="mx-auto text-gray-300 mb-4" size={64} />
              <h2 className="text-2xl font-black text-gray-900 mb-2">No reviews yet</h2>
              <p className="text-gray-600">Share your experience with products you've purchased</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayed.map(review => (
                <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  {editingId === review.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label>
                        {renderStars(editForm.rating, true, (r) => setEditForm(f => ({ ...f, rating: r })))}
                      </div>
                      <input type="text" value={editForm.title} onChange={(e) => setEditForm(f => ({ ...f, title: e.target.value }))} placeholder="Review title" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]" />
                      <textarea value={editForm.content} onChange={(e) => setEditForm(f => ({ ...f, content: e.target.value }))} placeholder="Your review..." rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]" />
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="px-4 py-2 bg-[#E42933] text-white rounded-lg text-sm font-semibold hover:bg-[#d41f28]">Save</button>
                        <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{review.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.rating)}
                            {review.verifiedPurchase && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">Verified Purchase</span>}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{review.content}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{review.helpfulCount} helpful</span>
                        {review.userId && <div className="flex gap-1 ml-auto">
                          <button onClick={() => startEdit(review)} className="w-8 h-8 text-blue-600 hover:bg-blue-50 rounded-full flex items-center justify-center"><Edit2 size={14} /></button>
                          <button onClick={() => deleteReview(review.id)} className="w-8 h-8 text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center"><Trash2 size={14} /></button>
                        </div>}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
