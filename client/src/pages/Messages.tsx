import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
import { MessageCircle, Send, Plus, AlertCircle, Loader2, X, Clock } from "lucide-react";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: "customer" | "admin";
  senderName: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  status: "open" | "closed" | "pending_customer";
  priority: "low" | "medium" | "high" | "urgent";
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const priorityColors = { low: "bg-green-100 text-green-800", medium: "bg-yellow-100 text-yellow-800", high: "bg-orange-100 text-orange-800", urgent: "bg-red-100 text-red-800" };
const statusColors = { open: "bg-blue-100 text-blue-800", closed: "bg-gray-100 text-gray-800", pending_customer: "bg-yellow-100 text-yellow-800" };

export default function Messages() {
  const { getToken, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) { setLocation("/login"); return; }
    fetchConversations();
  }, [isAuthenticated]);

  useEffect(() => { if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" }); }, [selectedId, conversations]);

  const fetchConversations = async () => {
    setIsLoading(true); setError(null);
    try {
      const res = await fetch("/api/messages/conversations", { headers: { Authorization: `Bearer ${getToken()}` } });
      if (!res.ok) { if (res.status === 401) { setLocation("/login"); return; } throw new Error("Failed to load conversations"); }
      setConversations(await res.json());
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load conversations"); }
    finally { setIsLoading(false); }
  };

  const createConversation = async () => {
    if (!newSubject.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages/conversations", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ subject: newSubject.trim() }),
      });
      if (res.ok) { setShowNewConversation(false); setNewSubject(""); fetchConversations(); }
    } catch {} finally { setSending(false); }
  };

  const sendMessage = async (conversationId: string) => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      if (res.ok) { setNewMessage(""); fetchConversations(); }
    } catch {} finally { setSending(false); }
  };

  const selected = conversations.find(c => c.id === selectedId);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#E42933]" size={32} /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 mb-8">
            <MessageCircle className="text-[#E42933]" size={32} /> Messages & Support
          </h1>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"><AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} /><p className="text-red-700 text-sm font-medium">{error}</p></div>}

          <div className="flex gap-6">
            {/* Conversation List */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="font-black text-gray-900 text-sm">Conversations</h2>
                  <button onClick={() => setShowNewConversation(true)} className="w-8 h-8 bg-[#E42933] text-white rounded-full flex items-center justify-center hover:bg-[#d41f28]">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                  {conversations.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 text-sm">No conversations yet</p>
                  ) : (
                    conversations.map(conv => (
                      <button key={conv.id} onClick={() => setSelectedId(conv.id)} className={`w-full text-left p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${selectedId === conv.id ? "bg-red-50 border-l-4 border-l-[#E42933]" : ""}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900 text-sm truncate">{conv.subject}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[conv.status]}`}>{conv.status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[conv.priority]}`}>{conv.priority}</span>
                          <span className="text-xs text-gray-400">{new Date(conv.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1">
              {!selectedId || !selected ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <MessageCircle className="mx-auto text-gray-300 mb-4" size={48} />
                  <h2 className="text-xl font-black text-gray-900 mb-2">Select a conversation</h2>
                  <p className="text-gray-500 text-sm mb-6">Or start a new conversation with our support team</p>
                  <button onClick={() => setShowNewConversation(true)} className="px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28]">
                    Start New Conversation
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[500px]">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-gray-900">{selected.subject}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[selected.status]}`}>{selected.status}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[selected.priority]}`}>{selected.priority}</span>
                      </div>
                    </div>
                    <button onClick={() => setSelectedId(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selected.messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.senderType === "customer" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${msg.senderType === "customer" ? "bg-[#E42933] text-white" : "bg-gray-100 text-gray-900"}`}>
                          <p className="text-sm">{msg.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs ${msg.senderType === "customer" ? "text-red-200" : "text-gray-500"}`}>{msg.senderName}</span>
                            <span className={`text-xs ${msg.senderType === "customer" ? "text-red-200" : "text-gray-400"}`}><Clock size={10} className="inline mr-0.5" />{new Date(msg.createdAt).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !sending && sendMessage(selected.id)} placeholder="Type your message..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]" />
                      <button onClick={() => sendMessage(selected.id)} disabled={!newMessage.trim() || sending} className="px-4 py-2 bg-[#E42933] text-white rounded-lg hover:bg-[#d41f28] disabled:opacity-50">
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* New Conversation Modal */}
          {showNewConversation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-gray-900">New Conversation</h3>
                  <button onClick={() => setShowNewConversation(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="What's your issue about?" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] mb-4" />
                <button onClick={createConversation} disabled={!newSubject.trim() || sending} className="w-full py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] disabled:opacity-50">
                  {sending ? "Creating..." : "Start Conversation"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
