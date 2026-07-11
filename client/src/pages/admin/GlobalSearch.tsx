import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { adminFetch } from "./lib/api";
import { Search, Package, ShoppingBag, Users, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  type: "product" | "order" | "customer";
  id: string;
  title: string;
  subtitle: string;
  url: string;
}

const RESULT_ICONS = {
  product: Package,
  order: ShoppingBag,
  customer: Users,
};

const RESULT_COLORS = {
  product: "bg-blue-50 text-blue-600",
  order: "bg-green-50 text-green-600",
  customer: "bg-purple-50 text-purple-600",
};

interface GlobalSearchProps {
  onClose: () => void;
}

export default function GlobalSearch({ onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await adminFetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
        setResults(data.results || []);
        setSelected(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      navigate(results[selected].url);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, orders, customers..."
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-gray-200 border-t-[#E42933] rounded-full animate-spin" />
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="max-h-80 overflow-y-auto py-2">
            {results.map((result, i) => {
              const Icon = RESULT_ICONS[result.type];
              const colorClass = RESULT_COLORS[result.type];
              return (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                    selected === i ? "bg-gray-100" : "hover:bg-gray-50"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", colorClass)}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{result.title}</p>
                    <p className="text-xs text-gray-400 truncate">{result.subtitle}</p>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                    {result.type}
                  </span>
                  <ArrowRight size={14} className="text-gray-300 shrink-0" />
                </button>
              );
            })}
          </div>
        ) : query.trim() && !loading ? (
          <div className="py-10 text-center">
            <Search size={28} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No results for "{query}"</p>
          </div>
        ) : !query.trim() ? (
          <div className="px-4 py-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Products", icon: Package, url: "/admin/products" },
                { label: "Orders", icon: ShoppingBag, url: "/admin/orders" },
                { label: "Customers", icon: Users, url: "/admin/customers" },
              ].map((item) => (
                <button
                  key={item.url}
                  onClick={() => { navigate(item.url); onClose(); }}
                  className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <item.icon size={20} className="text-gray-500" />
                  <span className="text-xs font-semibold text-gray-600">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-4">
          <span className="text-[10px] text-gray-400">
            <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">↑↓</kbd> navigate
          </span>
          <span className="text-[10px] text-gray-400">
            <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">↵</kbd> select
          </span>
          <span className="text-[10px] text-gray-400">
            <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
