import { useState, useEffect, useRef } from "react";
import { Search, X, ChevronDown, Filter } from "lucide-react";

interface SearchFilters {
  query: string;
  brand: string;
  model: string;
  category: string;
  priceMin: string;
  priceMax: string;
  condition: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  brands: string[];
  categories: string[];
  models: Record<string, string[]>;
}

export function AdvancedSearch({
  onSearch,
  brands,
  categories,
  models,
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    brand: "",
    model: "",
    category: "",
    priceMin: "",
    priceMax: "",
    condition: "All",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (filters.brand && models[filters.brand]) {
      setAvailableModels(models[filters.brand]);
    } else {
      setAvailableModels([]);
    }
    setFilters((prev) => ({ ...prev, model: "" }));
  }, [filters.brand, models]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: "",
      brand: "",
      model: "",
      category: "",
      priceMin: "",
      priceMax: "",
      condition: "All",
    });
    setAvailableModels([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const hasActiveFilters =
    filters.query ||
    filters.brand ||
    filters.model ||
    filters.category ||
    filters.priceMin ||
    filters.priceMax ||
    filters.condition !== "All";

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6 py-6">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Main Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by part name, model, or brand..."
                value={filters.query}
                onChange={(e) => handleFilterChange("query", e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] focus:border-transparent transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] transition-colors text-sm whitespace-nowrap"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-gray-200">
              {/* Brand Filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Model
                </label>
                <select
                  value={filters.model}
                  onChange={(e) => handleFilterChange("model", e.target.value)}
                  disabled={!filters.brand}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">All Models</option>
                  {availableModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Min */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Min Price (KES)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm"
                />
              </div>

              {/* Price Max */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Max Price (KES)
                </label>
                <input
                  type="number"
                  placeholder="999999"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm"
                />
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange("condition", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm"
                >
                  <option value="All">All</option>
                  <option value="New">New</option>
                  <option value="Certified Used">Certified Used</option>
                </select>
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <X size={16} />
                    Reset
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
